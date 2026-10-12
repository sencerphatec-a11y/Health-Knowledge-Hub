import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

test("Render production command serves the website and API on one port", { timeout: 30000 }, async () => {
  const probe = createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));

  const child = spawn(process.execPath, ["scripts/render.mjs", "start"], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  const exited = once(child, "exit");
  const base = `http://127.0.0.1:${port}`;
  const get = (url) => fetch(`${base}${url}`, { signal: AbortSignal.timeout(3000) });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      assert.equal(child.exitCode, null, output);
      try {
        const res = await get("/api/healthz");
        if (res.ok) {
          assert.deepEqual(await res.json(), { status: "ok" });
          ready = true;
          break;
        }
      } catch { /* Wait for the child to bind its port. */ }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(ready, `Production server did not become healthy:\n${output}`);
    for (const route of ["/api", "/api/"]) {
      const status = await get(route);
      assert.equal(status.status, 200, route);
      assert.match(status.headers.get("content-type"), /text\/plain/);
      assert.equal(await status.text(), "Health Knowledge Hub API is running!");
    }
    const home = await get("/");
    assert.equal(home.status, 200);
    const html = await home.text();
    assert.match(html, /id="root"/);
    for (const route of ["/medications", "/questionnaires", "/drug-interactions"]) {
      const res = await get(route);
      assert.equal(res.status, 200, route);
      assert.equal(await res.text(), html, route);
      assert.match(res.headers.get("cache-control"), /no-cache/);
    }
    const assetPath = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
    assert.ok(assetPath, "The built HTML must reference a root-based JavaScript asset");
    const asset = await get(assetPath);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get("content-type"), /javascript/);
    assert.match(asset.headers.get("cache-control"), /immutable/);
    const javascript = await asset.text();
    assert.ok(javascript.includes("https://reference.medscape.com/drug-interactionchecker"),
      "The Render website must include the Medscape checker link");
    assert.doesNotMatch(javascript, /drugs\.com|drugs-com/i,
      "The Render website must not retain the replaced interaction provider");
    for (const category of ["Contraindicated", "Serious", "Monitor Closely", "Minor"]) {
      assert.ok(javascript.includes(category), `Missing Medscape category: ${category}`);
    }
    for (const tool of ["PHQ-9", "GAD-7", "PHQ-4", "AUDIT-C", "PCL-5", "PHQ-15",
      "Insomnia Severity Index", "Oswestry Disability Index", "Neck Disability Index", "Morbid obesity"]) {
      assert.ok(javascript.includes(tool), `The Render bundle must include the questionnaire/BMI update: ${tool}`);
    }
    for (const route of ["/api/not-a-route", "/assets/not-a-file.js", "/not-a-file.css"]) {
      const res = await get(route);
      assert.equal(res.status, 404, route);
      assert.notEqual(await res.text(), html, route);
    }
    assert.equal(child.exitCode, null, output);
    assert.doesNotMatch(output, /EADDRINUSE/);
  } finally {
    child.kill("SIGTERM");
    const force = setTimeout(() => child.kill("SIGKILL"), 3000);
    await exited;
    clearTimeout(force);
  }
});
