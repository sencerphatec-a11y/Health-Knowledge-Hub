---
name: PulseCare prototype scope
description: Integration and safety boundaries for the user's supplied healthcare portal code.
---

The user removed the PulseCare tab from Health Guide navigation. Do not reintroduce it unless requested. The retained supplied portal remains an educational prototype; booking, payment, refill, patient-record, and telehealth examples are not connected services.

**Why:** The user explicitly requested removal of the PulseCare tab after its earlier integration.

**How to apply:** Keep it out of desktop and mobile navigation and footer links. Tab removal does not authorize deleting the supplied prototype assets.

**Why:** The supplied code contained hardcoded patient/provider data and alerts falsely confirming transactions. It also identified every pill as one medicine, cleared unknown drug interactions, and labeled a partial questionnaire as validated screening.

**How to apply:** Keep prototype status explicit both in the surrounding page and inside the standalone portal. Do not restore false success messages, pill identification, interaction clearance, or clinical scoring without appropriate real capabilities. Any move to real patient data or services requires deliberate scope, privacy/security work, and service integration.

Keep the supplied portal isolated from the main application's styles and scripts, without granting it same-origin, camera, or microphone access.

**Why:** This preserves the supplied design without letting the independent portal interfere with Health Guide or imply actual telehealth.

**How to apply:** Maintain the isolation boundary unless replacing the standalone implementation with a deliberately integrated, reviewed module.
