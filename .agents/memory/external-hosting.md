---
name: External hosting scope
description: The user's Render hosting context and how to distinguish it from Replit publishing.
---

The user also runs this website on Render and pushes updates through GitHub. A Render deployment request is separate from a Replit publishing request.

**Why:** The user explicitly reported a Render startup failure and asked for code changes they could push to Render.

**How to apply:** For Render issues, provide the verified repository changes and any required Render settings. Do not substitute a Replit republish recommendation or claim a local fix has already reached Render.

Integrate standalone server examples into the existing application rather than turning an imported shared library into another listening server.

**Why:** The user explicitly chose the safe integration after being shown that replacing shared definitions with the example server would break the deployment.

**How to apply:** Preserve the working website and API when adapting hosting or status-message snippets; explain incompatible replacements before applying them.
