---
name: Provider directory accuracy
description: Location and credibility boundaries for the built-in CMS physician search.
---

CMS NPI searches may match a secondary practice location while returning an unrelated primary practice address. Address-array ordering is not reliable: a live response placed the mailing address first despite the API documentation describing the primary practice address as first.

**Why:** A real West Des Moines ZIP search matched a secondary practice in West Des Moines, but the same physician's primary practice and mailing address were in Eldridge. Displaying the first address would have sent the visitor to the wrong city.

**How to apply:** Check address purpose and compare every practice location against the submitted city/state or ZIP. Display only matching practice locations and their own phone numbers. Never substitute mailing addresses or unrelated primary locations.

An active NPI record is a directory listing, not proof of licensure, credentialing, an open office, insurance acceptance, or appointment availability.

**Why:** CMS expressly says NPI issuance does not validate licensing or credentials, and practice details can remain old even in an active record.

**How to apply:** Preserve source links and registry update dates; tell visitors to confirm details with the office. Do not introduce verified-provider badges, quality rankings, live availability claims, or booking promises based solely on NPI data.
