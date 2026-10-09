import { SearchDoctorsResponse } from "@workspace/api-zod";

type Criteria = { city?: string; state?: string; zip?: string };
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const cityKey = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").toUpperCase();

// CMS can match a secondary location while returning a distant primary address.
// Never display a mailing address, or an unrelated primary location, as local.
export function normalizePhysicians(results: unknown[], criteria: Criteria) {
  const items: ReturnType<typeof SearchDoctorsResponse.parse>["items"] = [];
  const seen = new Set<string>();
  for (const entry of results) {
    const row = object(entry);
    const basic = object(row.basic);
    const npi = String(row.number ?? "");
    if (!/^\d{10}$/.test(npi) || seen.has(npi) || row.enumeration_type !== "NPI-1" || basic.status !== "A") continue;
    const taxonomies = Array.isArray(row.taxonomies) ? row.taxonomies.map(object) : [];
    // NUCC's 20-prefix comprises allopathic and osteopathic physician taxonomies.
    const physicianTaxonomies = taxonomies.filter(t => /^20[A-Z0-9]{7}X$/.test(text(t.code)));
    if (!physicianTaxonomies.length) continue;
    const locations: (typeof items)[number]["locations"] = [];
    const locationKeys = new Set<string>();
    const addresses = [
      ...(Array.isArray(row.addresses) ? row.addresses : []),
      ...(Array.isArray(row.practiceLocations) ? row.practiceLocations : []),
    ];
    for (const value of addresses) {
      const a = object(value);
      if (a.address_purpose !== "LOCATION" || a.country_code !== "US") continue;
      const city = text(a.city);
      const state = text(a.state).toUpperCase();
      const postal = text(a.postal_code).replace(/\D/g, "");
      const address = [text(a.address_1), text(a.address_2)].filter(Boolean).join(", ");
      if (!address || !city || !state || !/^\d{5}(?:\d{4})?$/.test(postal)) continue;
      if (criteria.zip && postal.slice(0, 5) !== criteria.zip) continue;
      if (criteria.state && state !== criteria.state) continue;
      if (criteria.city && cityKey(city) !== cityKey(criteria.city)) continue;
      const key = `${address.toUpperCase()}|${cityKey(city)}|${state}|${postal}`;
      if (locationKeys.has(key)) continue;
      locationKeys.add(key);
      locations.push({
        address, city, state,
        postalCode: postal.length === 9 ? `${postal.slice(0, 5)}-${postal.slice(5)}` : postal,
        phone: text(a.telephone_number) || null,
      });
    }
    const name = [text(basic.first_name), text(basic.middle_name), text(basic.last_name), text(basic.name_suffix)].filter(Boolean).join(" ");
    if (!locations.length || !name) continue;
    seen.add(npi);
    items.push({
      npi, name, credential: text(basic.credential) || null,
      specialties: [...new Set(physicianTaxonomies.map(t => text(t.desc)).filter(Boolean))],
      locations, sourceUrl: `https://npiregistry.cms.hhs.gov/provider-view/${npi}`,
      lastUpdated: /^\d{4}-\d{2}-\d{2}$/.test(text(basic.last_updated)) ? text(basic.last_updated) : null,
    });
  }
  return items;
}

export function validDirectoryPayload(payload: unknown): payload is { result_count: number; results?: unknown[] } {
  const data = object(payload);
  if (!Number.isInteger(data.result_count) || Number(data.result_count) < 0 || Number(data.result_count) > 200) return false;
  if (data.result_count === 0) return data.results === undefined || Array.isArray(data.results) && data.results.length === 0;
  return Array.isArray(data.results) && data.results.length === data.result_count &&
    data.results.every(value => {
      const row = object(value);
      return /^\d{10}$/.test(String(row.number ?? "")) && Array.isArray(row.addresses) && Array.isArray(row.taxonomies) && typeof object(row.basic).status === "string";
    });
}
