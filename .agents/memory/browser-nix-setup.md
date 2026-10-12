---
name: Cross-browser Nix setup
description: Why downloaded Playwright browsers need coherent library and graphics settings in this workspace.
---

Use a coherent dependency and graphics stack for downloaded Playwright browsers on Replit/NixOS, rather than combining libraries from arbitrary installed versions or accepting ambient graphics defaults.

**Why:** This workspace supplies a newer global Mesa vendor configuration than the libraries compatible with the browser downloads. WebKit could launch successfully with explicit graphics settings but failed inside the suite when defaults preserved the ambient vendor configuration. Mixing glibc versions also crashed the launcher before it could run tests.

**How to apply:** Use the documented browser setup before cross-engine checks. When a browser starts but cannot create pages, inspect graphics initialization and ambient vendor settings before changing application code. Keep setup adjustments confined to tests.

Playwright's Ubuntu host dependency probe can report libraries as missing even when the Nix loader can resolve them.

**Why:** Its dynamic-load check consults the system ldconfig cache, not the Nix library paths.

**How to apply:** A documented bypass of this static probe is acceptable only with a configured Nix library stack; actual browser launches and assertions must still run and fail normally. Never skip an engine as a substitute for working browser setup.

Run the medication browser suite exclusively, not simultaneously as a workflow and a completion check.

**Why:** Its isolated servers deliberately refuse to reuse occupied ports. An existing workflow can therefore prevent the completion check from starting even when the application is healthy.

**How to apply:** Check whether a browser-test workflow is already running before completion validation. Let it finish or stop the conflicting run before invoking the configured check; do not weaken server isolation to work around the conflict.
