// Test-only DailyMed replacement. Exercise the production route, validation,
// extraction and paging without a database, live service or production switches.
const express = require("express");
const { buildSync } = require("esbuild");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");

const directory = mkdtempSync(join(tmpdir(), "medication-browser-"));
const bundle = join(directory, "route.cjs");
buildSync({
  entryPoints: [resolve(__dirname, "../src/routes/medication-labels.ts")],
  outfile: bundle, bundle: true, platform: "node", format: "cjs",
});
const { default: router } = require(bundle);
const types = ["34391-3", "34390-5", "75031-5", "53404-0", "60683-0", "60684-8", "53408-1", "53405-7", "60682-2"];
const idFor = (type, index) =>
  `${String(type).padStart(8, "0")}-1111-4111-8111-${String(index).padStart(12, "0")}`;
const longTitle = `Fixture medicine ${"SuperLongUnbrokenProductName".repeat(16)} extended-release tablets`;
let unavailable = false;
let release;
let gate = null;
const originalFetch = global.fetch;
global.fetch = async (input) => {
  const url = new URL(input);
  // Fail closed: an accidentally unhandled upstream URL must never go live.
  if (url.hostname !== "dailymed.nlm.nih.gov")
    throw new Error(`Unexpected fixture upstream: ${url.hostname}`);
  if (gate) await gate;
  if (unavailable) return new Response("Unavailable", { status: 503 });
  if (url.pathname.endsWith(".xml")) {
    const id = url.pathname.split("/").pop().replace(".xml", "");
    if (id === idFor(0, 999)) return new Response("Not found", { status: 404 });
    const uses = id === idFor(0, 1) ? "" :
      '<section><code code="34067-9"/><title>INDICATIONS AND USAGE</title><text><paragraph>Fixture labeled use for temporary pain relief.</paragraph></text><component><section><title>Additional use</title><text><paragraph>Fixture nested indication.</paragraph></text></section></component></section>';
    return new Response(`<document><code code="34391-3"/><effectiveTime value="20261008"/><component>${uses}</component></document>`);
  }
  if (!url.pathname.endsWith("/spls.json"))
    throw new Error(`Unexpected DailyMed fixture path: ${url.pathname}`);
  const query = url.searchParams.get("drug_name") || "";
  const type = types.indexOf(url.searchParams.get("doctype"));
  const setId = url.searchParams.get("setid");
  const counts = query === "empty" ? [] : [23, 22, 0, 3];
  const count = setId ? 1 : counts[type] || 0;
  const size = Number(url.searchParams.get("pagesize"));
  const page = Number(url.searchParams.get("page") || 1);
  const data = Array.from({ length: Math.max(0, Math.min(size, count - (page - 1) * size)) }, (_, offset) => {
    const index = (page - 1) * size + offset;
    const id = setId || idFor(type, index);
    return {
      setid: id,
      title: id === idFor(0, 0) ? longTitle : `Fixture product ${id}`,
      published_date: "Oct 08, 2026",
    };
  });
  return Response.json({ data, metadata: {
    total_elements: count, total_pages: Math.ceil(count / size),
    db_published_date: "Oct 08, 2026 08:01:43PM EST",
  } });
};

const app = express();
app.use(express.json());
// Available only on the isolated loopback test server, never the app workflow.
app.post("/__fixtures", (req, res) => {
  if (req.body.hold === false) { release?.(); gate = null; release = undefined; }
  if (req.body.hold === true && !gate) gate = new Promise(resolve => { release = resolve; });
  if (typeof req.body.unavailable === "boolean") unavailable = req.body.unavailable;
  res.sendStatus(204);
});
app.get("/__ready", (_req, res) => res.sendStatus(200));
app.use("/api", router);
module.exports = {
  app,
  cleanup() {
    release?.();
    global.fetch = originalFetch;
    rmSync(directory, { recursive: true, force: true });
  },
};
