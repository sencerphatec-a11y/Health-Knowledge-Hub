import { Router, type IRouter } from "express";
import { SearchDoctorsQueryParams, SearchDoctorsResponse } from "@workspace/api-zod";
import { normalizePhysicians, validDirectoryPayload } from "../lib/provider-directory";

const router: IRouter = Router();
const PAGE_SIZE = 200;
const STATES = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI".split(" "));
const SPECIALTIES = {
  all: "", "family-medicine": "Family Medicine", "internal-medicine": "Internal Medicine",
  pediatrics: "Pediatrics", "ob-gyn": "Obstetrics & Gynecology",
  cardiology: "Cardiovascular Disease", dermatology: "Dermatology",
  psychiatry: "Psychiatry", "general-practice": "General Practice",
} as const;
const cache = new Map<string, { expires: number; value: ReturnType<typeof SearchDoctorsResponse.parse> }>();
const pending = new Map<string, Promise<ReturnType<typeof SearchDoctorsResponse.parse>>>();

router.get("/doctors", async (req, res): Promise<void> => {
  const input = { ...req.query };
  if (["city", "state", "zip", "specialty", "page"].some(key => input[key] !== undefined && typeof input[key] !== "string")) {
    res.status(400).json({ message: "Each search field must have a single value." });
    return;
  }
  for (const key of ["city", "state", "zip"]) {
    if (typeof input[key] === "string") {
      input[key] = input[key].trim();
      if (key === "state") input[key] = input[key].toUpperCase();
      if (!input[key]) delete input[key];
    }
  }
  const parsed = SearchDoctorsQueryParams.safeParse(input);
  if (!parsed.success) {
    res.status(400).json({ message: "Enter a five-digit ZIP code or city and two-letter state, and choose a valid specialty and page (1–6)." });
    return;
  }
  const { city, state, zip, specialty, page } = parsed.data;
  if ((!zip && !(city && state)) || (state && !STATES.has(state)) || (city && !/^[\p{L}\p{N} .,'’()/\-]+$/u.test(city))) {
    res.status(400).json({ message: "Search by a five-digit ZIP code, or enter both a city and a valid U.S. state. Wildcard city searches are not supported." });
    return;
  }
  const params = new URLSearchParams({
    version: "2.1", enumeration_type: "NPI-1", address_purpose: "LOCATION",
    country_code: "US", limit: String(PAGE_SIZE), skip: String((page - 1) * PAGE_SIZE),
  });
  if (zip) params.set("postal_code", zip);
  if (city) params.set("city", city);
  if (state) params.set("state", state);
  if (SPECIALTIES[specialty]) params.set("taxonomy_description", SPECIALTIES[specialty]);
  const url = `https://npiregistry.cms.hhs.gov/api/?${params}`;
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    res.json(cached.value);
    return;
  }
  if (pending.size >= 8 && !pending.has(url)) {
    res.status(503).json({ message: "The search service is busy. Please try again shortly." });
    return;
  }
  try {
    let request = pending.get(url);
    if (!request) {
      request = (async () => {
        const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error("CMS HTTP failure");
        const raw: unknown = await response.json();
        if (!validDirectoryPayload(raw)) throw new Error("Invalid CMS response");
        const value = SearchDoctorsResponse.parse({
          items: normalizePhysicians(raw.results ?? [], { city, state, zip }),
          page, hasMore: raw.result_count === PAGE_SIZE && page < 6,
          limitReached: raw.result_count === PAGE_SIZE && page === 6,
          directoryRecordsOnPage: raw.result_count,
          retrievedAt: new Date().toISOString(), sourceUrl: url,
        });
        if (cache.size >= 100) cache.delete(cache.keys().next().value!);
        cache.set(url, { expires: Date.now() + 300000, value });
        return value;
      })().finally(() => pending.delete(url));
      pending.set(url, request);
    }
    res.json(await request);
  } catch {
    // Never disguise upstream failure as zero doctors or substitute sample data.
    res.status(502).json({ message: "The CMS provider directory is unavailable right now. Please retry, or use the official NPI Registry link." });
  }
});

export default router;
