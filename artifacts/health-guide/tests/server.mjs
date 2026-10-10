import { createServer } from 'vite';
import fixtures from '../../api-server/scripts/medication-browser-fixtures.cjs';

// Same frontend config and API route as the app; only the upstream is replaced.
const vite = await createServer({
  configFile: new URL('../vite.config.ts', import.meta.url).pathname,
  server: { middlewareMode: true, hmr: false, ws: false },
});
fixtures.app.use(vite.middlewares);
const server = fixtures.app.listen(Number(process.env.PORT || 4177), '127.0.0.1');
async function stop() {
  await vite.close();
  fixtures.cleanup();
  server.close(() => process.exit(0));
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
