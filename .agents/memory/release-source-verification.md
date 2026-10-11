---
name: Release source verification
description: Why earlier preview checks are not enough after Git synchronization changes the source.
---

Treat checks of a fresh production build and startup, performed after synchronization, as release evidence. An already-running preview is not proof that the latest source can start successfully.

**Why:** Previously restored shared-library exports were replaced again in a synchronized version. The preview continued serving an earlier working bundle, while publishing built the changed source and started two competing server listeners. Earlier successful checks did not cover that later source state.

**How to apply:** After Git synchronization or subsequent external edits, verify the current source with type checks, a fresh production build, and the configured startup health endpoint before recommending another publishing attempt. Do not assume a correction remains present just because it was made earlier.
