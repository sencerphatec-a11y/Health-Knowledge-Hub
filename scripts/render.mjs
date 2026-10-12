import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const command = process.argv[2];

async function run(program, args, extraEnv = {}) {
  const child = spawn(program, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  const stop = (signal) => child.kill(signal);
  const onTerm = () => stop("SIGTERM");
  const onInt = () => stop("SIGINT");
  process.on("SIGTERM", onTerm);
  process.on("SIGINT", onInt);
  try {
    await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) => {
        if (code === 0) resolve();
        else reject(new Error(`${program} exited with ${signal ?? code}`));
      });
    });
  } finally {
    process.off("SIGTERM", onTerm);
    process.off("SIGINT", onInt);
  }
}

try {
  if (command === "build") {
    await run("pnpm", ["run", "typecheck"]);
    await run("pnpm", ["--filter", "@workspace/health-guide", "run", "build"], {
      NODE_ENV: "production",
      PORT: process.env.PORT || "10000",
      BASE_PATH: "/",
    });
    await run("pnpm", ["--filter", "@workspace/api-server", "run", "build"], {
      NODE_ENV: "production",
    });
  } else if (command === "start") {
    // Render supplies PORT. The backend validates it and listens on 0.0.0.0.
    await run(process.execPath, [
      "--enable-source-maps",
      "artifacts/api-server/dist/index.mjs",
    ], { NODE_ENV: "production", SERVE_HEALTH_GUIDE: "true" });
  } else {
    throw new Error("Usage: node scripts/render.mjs build|start");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
