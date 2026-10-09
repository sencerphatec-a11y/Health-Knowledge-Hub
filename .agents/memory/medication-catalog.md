---
name: Medication catalog scope
description: Coverage and source-use decisions for the full U.S. medication catalog.
---

The catalog covers current DailyMed human finished-product medication labels, including vaccines, allergy products, plasma-derived medicines, compounded medicines, and cell therapies. Exclude animal drugs, devices, and raw manufacturing ingredients.

**Why:** The user chose all current U.S. drug-label products for a consumer health website. Restricting coverage to the two common prescription/OTC document types would omit relevant human therapies.

**How to apply:** Keep source-type coverage broad for finished human medicines. Describe results as product-label records, not unique ingredients or an exhaustive list of FDA-approved drugs. Label inclusion and manufacturer-stated uses are not independent evidence of approval or effectiveness.

Use a bounded five-minute cache of successful DailyMed catalog responses; never serve upstream failures as empty results.

**Why:** Unified paging needs counts across multiple source categories. Re-fetching every count on every page unnecessarily loads the public service; a short cache limits that while retaining timely source updates.

**How to apply:** Cache only successful validated responses and deduplicate concurrent requests. Revisit the freshness window if the product gains safety-alert or real-time update requirements.
