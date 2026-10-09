// Contract and extraction checks with controlled upstream fixtures. The app
// itself always reads DailyMed; these fixtures are only used in this test.
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { buildSync } = require("esbuild");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const express = require("express");

const directory = mkdtempSync(join(tmpdir(), "medication-label-tests-"));
const bundle = join(directory, "route.cjs");
buildSync({
  entryPoints: [resolve(__dirname, "../src/routes/medication-labels.ts")],
  outfile: bundle, bundle: true, platform: "node", format: "cjs",
});
const { default: router, sectionText, formatEffectiveDate } = require(bundle);
const app = express();
app.use("/api", router);
const server = app.listen(0, "127.0.0.1");
const originalFetch = global.fetch;
const types = ["34391-3", "34390-5", "75031-5", "53404-0", "60683-0", "60684-8", "53408-1", "53405-7", "60682-2"];
const idFor = (typeIndex, index) =>
  `${String(typeIndex).padStart(8, "0")}-1111-4111-8111-${String(index).padStart(12, "0")}`;
const calls = [];
let detailXml = "";
let upstreamFails = false;
global.fetch = async (input, options) => {
  const url = new URL(input);
  if (url.hostname !== "dailymed.nlm.nih.gov") return originalFetch(input, options);
  calls.push(url);
  if (upstreamFails) return new Response("Unavailable", { status: 503 });
  if (url.pathname.endsWith(".xml")) return new Response(detailXml);
  const query = url.searchParams.get("drug_name");
  const type = types.indexOf(url.searchParams.get("doctype"));
  const counts = query === "otc-only" ? [0, 42] :
    query === "rx-only" ? [23, 0] : query === "empty" ? [] : [23, 42, 0, 3];
  const count = url.searchParams.has("setid") ? 1 : counts[type] || 0;
  const size = Number(url.searchParams.get("pagesize"));
  const page = Number(url.searchParams.get("page") || 1);
  assert.ok(page === 1 || page <= Math.ceil(count / size), "never request an exhausted category page");
  const data = Array.from({ length: Math.max(0, Math.min(size, count - (page - 1) * size)) }, (_, offset) => ({
    setid: url.searchParams.get("setid") || idFor(type, (page - 1) * size + offset),
    title: `Product ${type}-${(page - 1) * size + offset}`,
    published_date: "Oct 08, 2026",
  }));
  return Response.json({
    data, metadata: {
      total_elements: query === "bad-count" ? null : count,
      total_pages: Math.ceil(count / size),
      db_published_date: "Oct 08, 2026 08:01:43PM EST",
    },
  });
};
const request = async (path) => {
  const response = await originalFetch(`http://127.0.0.1:${server.address().port}/api${path}`);
  return { status: response.status, body: await response.json() };
};
after(async () => {
  global.fetch = originalFetch;
  await new Promise(resolve => server.close(resolve));
  rmSync(directory, { recursive: true, force: true });
});

test("unified pagination reaches every record across unequal and empty categories", async () => {
  const ids = new Set();
  for (let page = 1; page <= 4; page++) {
    const { status, body } = await request(`/medication-labels?query=mixed&page=${page}`);
    assert.equal(status, 200);
    assert.equal(body.totalItems, 68);
    assert.equal(body.totalPages, 4);
    assert.equal(body.items.length, page === 4 ? 8 : 20);
    assert.equal(body.catalogUpdatedAt, "2026-10-09T01:01:43.000Z");
    for (const item of body.items) {
      assert.ok(!ids.has(item.setId), "no duplicate record across boundaries");
      ids.add(item.setId);
      assert.equal(item.sourceUrl, `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${item.setId}`);
    }
  }
  assert.equal(ids.size, 68);
  const { body } = await request("/medication-labels?query=mixed&page=999");
  assert.equal(body.page, 4);
  assert.equal(body.items.length, 8);
});

test("zero matches in one category do not hide the other category", async () => {
  for (const [query, type, pages, lastSize] of [
    ["otc-only", "otc", 3, 2], ["rx-only", "prescription", 2, 3],
  ]) {
    const { status, body } = await request(`/medication-labels?query=${query}&page=${pages}`);
    assert.equal(status, 200);
    assert.equal(body.totalPages, pages);
    assert.equal(body.items.length, lastSize);
    assert.ok(body.items.every(item => item.labelType === type));
  }
  const { status, body } = await request("/medication-labels?query=empty&page=9");
  assert.equal(status, 200);
  assert.deepEqual(body.items, []);
  assert.equal(body.totalItems, 0);
  assert.equal(body.page, 1);
});

test("invalid input and invalid upstream counts fail visibly and remain retryable", async () => {
  for (const query of ["page=0", "page=1.5", "page=100001", `query=${"x".repeat(101)}`]) {
    assert.equal((await request(`/medication-labels?${query}`)).status, 400);
  }
  assert.equal((await request("/medication-labels?query=bad-count")).status, 502);
  upstreamFails = true;
  assert.equal((await request("/medication-labels?query=retry-me")).status, 502);
  upstreamFails = false;
  assert.equal((await request("/medication-labels?query=retry-me")).status, 200);
});

test("full prescription, OTC, combination, and nested uses preserve text, not abbreviated highlights", () => {
  const xml = `<document><effectiveTime value="20261008"/><section>
    <code code="34067-9"/><title>INDICATIONS AND USAGE</title>
    <text><paragraph>Medicine A &amp; medicine B are indicated for adults.</paragraph></text>
    <excerpt><text>Abbreviated highlights only.</text></excerpt>
    <component><section><title>1.1 First indication</title><text>
      <paragraph>Use in combination with diet.</paragraph><list><item>Not for children.</item></list>
    </text></section></component>
    <component><section><title>1.2 Second indication</title><text><paragraph>Limitations of use: do not use alone.</paragraph></text></section></component>
  </section><section><code code="34066-1"/><text>Unrelated warnings.</text></section></document>`;
  const uses = sectionText(xml);
  for (const text of ["Medicine A & medicine B", "1.1 First indication", "Not for children.", "1.2 Second indication", "do not use alone."]) assert.ok(uses.includes(text));
  assert.ok(!uses.includes("Abbreviated") && !uses.includes("Unrelated warnings"));
  assert.equal(formatEffectiveDate(xml), "2026-10-08");
  assert.equal(sectionText('<section><code code="34067-9"/><title>Uses</title><text><list><item>temporarily relieves pain</item><item>reduces fever</item></list></text></section>'), "temporarily relieves pain\nreduces fever");
  assert.equal(sectionText("<document><section><text>No coded uses.</text></section></document>"), null);
  assert.equal(sectionText('<section><code code="34067-9"/><title>Uses</title></section>'), null);
  assert.equal(sectionText('<document><section><code code="34067-9"/><title>Uses</title></section><section><code code="34067-9"/><text><paragraph>First product use.</paragraph></text><section><code code="34067-9"/><text><paragraph>Nested use.</paragraph></text></section></section><section><code code="34067-9"/><text><paragraph>Second product use.</paragraph></text></section></document>'), "First product use.\nNested use.\nSecond product use.");
});

test("detail responses include source and dates; missing uses stay explicit", async () => {
  const setId = idFor(0, 0);
  detailXml = '<document><code code="34391-3"/><effectiveTime value="20261008"/><section><code code="34067-9"/><text><paragraph>For labeled use only.</paragraph></text></section></document>';
  let result = await request(`/medication-labels/${setId}`);
  assert.equal(result.status, 200);
  assert.equal(result.body.usesText, "For labeled use only.");
  assert.equal(result.body.labelEffectiveDate, "2026-10-08");
  assert.ok(result.body.sourceUrl.endsWith(setId));
  detailXml = '<document><code code="34390-5"/></document>';
  result = await request(`/medication-labels/${setId}`);
  assert.equal(result.body.usesText, null);
  assert.equal(result.body.labelEffectiveDate, null);
  assert.equal((await request("/medication-labels/not-a-uuid")).status, 404);
  detailXml = '<document><code code="34392-1"/></document>';
  assert.equal((await request(`/medication-labels/${setId}`)).status, 404);
});
