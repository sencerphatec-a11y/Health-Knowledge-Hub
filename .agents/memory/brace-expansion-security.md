---
name: Brace expansion security
description: Why a guarded braces replacement is preferable to a broad Tailwind migration.
---

Keep a depth-guarded, API-compatible brace expansion implementation until upstream provides an equivalent fix.

**Why:** Upstream braces lacked a patched release for stack exhaustion in recursive AST walkers. Its users here are build tooling and filesystem discovery, not public selector-processing endpoints. Replacing the entire legacy Tailwind pipeline would create unnecessary styling risk; a small compatible fork preserves existing compilation and glob behavior.

**How to apply:** When updating glob or Tailwind dependencies, check whether upstream has fixed both string-input nesting and caller-supplied AST recursion before removing the replacement. Test ordinary glob expansion, compilation, filesystem discovery, and malicious nesting. A clean advisory scan alone does not prove a differently named fork has fixed the underlying behavior.
