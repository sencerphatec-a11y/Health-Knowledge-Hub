const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createRequire } = require("node:module");
const { readFileSync, readdirSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const healthRequire = createRequire(path.join(root, "artifacts/health-guide/package.json"));
const tailwindRequire = createRequire(healthRequire.resolve("tailwindcss-pulsecare"));
const braces = tailwindRequire("braces");
const micromatch = tailwindRequire("micromatch");
const glob = tailwindRequire("fast-glob");

test("no listed vulnerable versions remain in any manifest or lockfile", () => {
  const excluded = new Set([
    "node_modules", ".git", "vendor", ".venv", "venv", "target",
    "dist", "build", ".next", ".cache",
  ]);
  const vulnerable = [
    ["fast-uri", "3.1.7"], ["proxy-addr", "2.0.7"],
    ["brace-expansion", "5.0.9"], ["postcss-selector-parser", "6.1.4"],
    ["postcss-selector-parser", "6.0.10"], ["source-map-js", "1.2.1"],
    ["braces", "3.0.3"],
  ];
  let manifests = 0;
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !excluded.has(entry.name)) {
        walk(path.join(dir, entry.name));
      } else if (entry.isFile() && /^(package\.json|pnpm-lock\.yaml|package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|bun\.lock)$/.test(entry.name)) {
        const filename = path.join(dir, entry.name);
        const content = readFileSync(filename, "utf8");
        if (entry.name === "package.json") manifests++;
        for (const [name, version] of vulnerable) {
          const escapedName = name.replaceAll("-", "\\-");
          const escapedVersion = version.replaceAll(".", "\\.");
          const pin = new RegExp(
            `(?:^|[\\s"'\\/])${escapedName}(?:@|:\\s*["']?|["']\\s*:\\s*["'](?:[~^])?)${escapedVersion}(?=[\\s"'(:/,}]|$)`,
            "m",
          );
          assert.ok(!pin.test(content), `${filename} still pins ${name}@${version}`);
        }
      }
    }
  }
  walk(root);
  assert.ok(manifests >= 9, "must include nested workspace manifests");
});

test("replacement preserves normal brace expansion and compilation", () => {
  assert.deepEqual(braces.expand("src/*.{ts,tsx}"), ["src/*.ts", "src/*.tsx"]);
  assert.deepEqual(braces.expand("{01..03}"), ["01", "02", "03"]);
  assert.deepEqual(braces.expand("{a,{b,c}}"), ["a", "b", "c"]);
  assert.deepEqual(braces("src/*.{ts,tsx}"), ["src/*.(ts|tsx)"]);
  assert.deepEqual(micromatch.braceExpand("*.{js,ts}"), ["*.js", "*.ts"]);
  assert.deepEqual(micromatch(["a.ts", "a.tsx", "a.css"], "*.{ts,tsx}"), ["a.ts", "a.tsx"]);
});

test("deep brace and parenthesis inputs are rejected before stack exhaustion", () => {
  for (const [open, close] of [["{", "}"], ["(", ")"]]) {
    const pattern = open.repeat(2000) + "a,b" + close.repeat(2000);
    for (const operation of [braces, braces.parse, braces.compile, braces.expand, braces.stringify]) {
      assert.throws(() => operation(pattern), /exceeds max depth/);
    }
  }
  assert.throws(() => braces.expand("{".repeat(2000) + "a" + "}".repeat(2000), { maxDepth: Infinity }), /exceeds max depth/);
});

test("recursive AST walkers also guard caller-supplied ASTs", () => {
  const ast = { type: "root", nodes: [] };
  let node = ast;
  for (let i = 0; i < 2000; i++) {
    const child = { type: "brace", nodes: [], parent: node };
    node.nodes.push(child);
    node = child;
  }
  node.nodes.push({ type: "text", value: "x" });
  for (const operation of [braces.compile, braces.expand, braces.stringify]) {
    assert.throws(() => operation(ast), /exceeds max depth/);
  }
});

test("Tailwind and preview glob consumers still discover source files", async () => {
  const files = await glob("artifacts/{health-guide,mockup-sandbox}/src/**/*.{ts,tsx}", { cwd: root });
  assert.ok(files.some((file) => file.startsWith("artifacts/health-guide/src/")));
  assert.ok(files.some((file) => file.startsWith("artifacts/mockup-sandbox/src/")));
  const watcherRequire = createRequire(tailwindRequire.resolve("chokidar"));
  assert.equal(watcherRequire("braces"), braces);
});
