# Deploy Health Guide on Render

Use a **Node Web Service**, not a static site. One Express server serves the
built website and its `/api` endpoints on Render's assigned port.

## Existing Render service

Push these changes to the GitHub branch connected to Render. In your service's
**Settings → Build & Deploy**, set:

| Setting | Value |
| --- | --- |
| Root Directory | Leave blank (repository root) |
| Build Command | `pnpm install --frozen-lockfile --prod=false && pnpm run build:render` |
| Start Command | `pnpm run start:render` |
| Health Check Path | `/api/healthz` |

Save the settings, then deploy the latest commit. Do **not** use
`npx tsx lib/api-zod/src/index.ts`: that is a shared schema library, not a server.
`pnpm install` alone does not build the website or backend.

Render supplies `PORT`; do not replace it with a fixed port. The build script
sets the frontend base path to `/`, and the start script enables website serving
and production mode for the server. No Replit preview proxy is needed on Render.
Build tools are installed even if production mode is configured in Render.

## New Blueprint deployment

The repository includes `render.yaml` with the same commands. Import it as a
Render Blueprint if creating a new service. Adding it to an existing manually
configured service does not automatically replace that service's settings.

## Verification before pushing

```sh
pnpm run build:render
pnpm run test:render
```

The smoke test starts the production server on a temporary port, checks the
website, client-side route reloads, assets, and API health, then stops the server.
It does not send personal information or modify a database.
