import { defineConfig } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

// Optional Replit/NixOS setup; ordinary Linux/macOS installs need no override.
const nixEnvironment = new URL('../../.cache/medication-browser-nix/env.json', import.meta.url);
if (existsSync(nixEnvironment)) {
  const environment: Record<string, string> = JSON.parse(readFileSync(nixEnvironment, 'utf8'));
  for (const [key, value] of Object.entries(environment)) {
    // Use a coherent loader/graphics stack, rather than mixing these libraries
    // with the workspace's globally configured (possibly newer) Mesa build.
    process.env[key] = value;
  }
}

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined);

const engines = ['chromium', 'firefox', 'webkit'] as const;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1, // Serialize tests; each engine also has its own controls and API cache.
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: engines.map((browserName, index) => ({
    name: browserName,
    use: {
      browserName,
      baseURL: `http://127.0.0.1:${4177 + index}`,
      // Never pass a Chromium executable to the Firefox or WebKit launcher.
      ...(browserName === 'chromium' ? { launchOptions: { executablePath } } : {}),
    },
  })),
  webServer: engines.map((_, index) => ({
    command: 'node tests/server.mjs',
    url: `http://127.0.0.1:${4177 + index}/__ready`,
    env: { PORT: String(4177 + index), BASE_PATH: '/', NODE_ENV: 'test' },
    reuseExistingServer: false,
    timeout: 60_000,
  })),
});
