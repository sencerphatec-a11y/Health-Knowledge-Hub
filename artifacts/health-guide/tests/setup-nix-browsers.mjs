import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { firefox, webkit } from '@playwright/test';

const testsDir = dirname(fileURLToPath(import.meta.url));
const cache = resolve(testsDir, '../../../.cache/medication-browser-nix');
// Build a coherent set of Nix libraries; mixing glibc from different versions
// into Ubuntu downloads can crash before the browser even starts.
const libraryRoot = execFileSync('nix-build', [
  join(testsDir, 'browser-libraries.nix'), '--no-out-link',
], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const libraryPath = join(libraryRoot, 'lib');
mkdirSync(cache, { recursive: true });
rmSync(join(cache, 'env.json'), { force: true });

execFileSync('pnpm', ['exec', 'playwright', 'install', 'firefox', 'webkit'], {
  cwd: resolve(testsDir, '..'), stdio: 'inherit',
  env: {
    ...process.env, LD_LIBRARY_PATH: libraryPath,
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: '1',
  },
});
// WebKit's downloaded wrapper replaces LD_LIBRARY_PATH. Its sys/lib directory
// is the supported extra-library location for those downloaded binaries.
const webkitDir = dirname(webkit.executablePath());
for (const engine of ['minibrowser-wpe', 'minibrowser-gtk']) {
  const sysDir = join(webkitDir, engine, 'sys');
  mkdirSync(sysDir, { recursive: true });
  rmSync(join(sysDir, 'lib'), { recursive: true, force: true });
  symlinkSync(libraryPath, join(sysDir, 'lib'));
}
writeFileSync(join(cache, 'env.json'), JSON.stringify({
  LD_LIBRARY_PATH: libraryPath,
  __EGL_VENDOR_LIBRARY_FILENAMES: join(libraryRoot, 'share/glvnd/egl_vendor.d/50_mesa.json'),
  LIBGL_ALWAYS_SOFTWARE: '1',
  EGL_PLATFORM: 'surfaceless',
  // Playwright's dlopen probe reads Ubuntu's ldconfig cache, which cannot see
  // Nix libraries. Actual launches and every test still run and fail normally.
  PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: '1',
}, null, 2));
console.log(`Nix browser libraries ready for ${firefox.executablePath()} and ${webkitDir}.`);
