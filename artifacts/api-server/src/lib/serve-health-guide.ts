import express, { type Express } from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function serveHealthGuide(app: Express): void {
  // Bundled entry point lives in artifacts/api-server/dist/index.mjs.
  const publicDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../health-guide/dist/public",
  );
  const indexFile = path.join(publicDir, "index.html");
  if (!existsSync(indexFile)) {
    throw new Error("Health Guide build is missing. Run pnpm run build:render before starting.");
  }

  app.use("/assets", express.static(path.join(publicDir, "assets"), {
    immutable: true,
    maxAge: "1y",
  }));
  app.use(express.static(publicDir, {
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
    },
  }));

  // Refreshing a client-side route must return the app, not an Express 404.
  // Missing assets and API requests must never receive the HTML fallback.
  app.get("/{*path}", (req, res, next) => {
    if (req.path === "/assets" || req.path.startsWith("/assets/") ||
        path.extname(req.path) || !req.accepts("html")) {
      next();
      return;
    }
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(indexFile);
  });
}
