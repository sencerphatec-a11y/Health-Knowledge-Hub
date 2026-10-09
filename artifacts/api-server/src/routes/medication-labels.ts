import { Router, type IRouter, type Response as ExpressResponse } from "express";
import {
  GetMedicationLabelParams,
  GetMedicationLabelResponse,
  GetMedicationLabelsQueryParams,
  GetMedicationLabelsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const DAILYMED_API = "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls";
const DAILYMED_LABEL = "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=";
const PAGE_SIZE_PER_TYPE = 20;
const HUMAN_LABEL_TYPES = {
  "34391-3": "prescription",
  "34390-5": "otc",
  "75031-5": "compounded",
  "53404-0": "vaccine",
  "60683-0": "plasma-derivative",
  "60684-8": "cellular-therapy",
  "53408-1": "licensed-cell-product",
  "53405-7": "allergenic",
  "60682-2": "standardized-allergenic",
} as const;

type LabelType = (typeof HUMAN_LABEL_TYPES)[keyof typeof HUMAN_LABEL_TYPES];

interface DailyMedEntry {
  setid?: string;
  title?: string;
  published_date?: string;
}

interface DailyMedPage {
  data?: DailyMedEntry[];
  metadata?: {
    total_elements?: string | number;
    total_pages?: string | number;
    db_published_date?: string;
  };
}

// A short successful-response cache keeps catalog paging from repeating all
// category-count requests. Failed requests are never served as catalog data.
const pageCache = new Map<string, { expiresAt: number; value: DailyMedPage }>();
const pendingPages = new Map<string, Promise<DailyMedPage>>();

class DailyMedError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function fetchDailyMed(url: URL): Promise<Response> {
  try {
    return await fetch(url, {
      headers: { Accept: "application/json, application/xml" },
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new DailyMedError(502, "DailyMed could not be reached. Please try again.");
  }
}

function readPositiveInteger(value: string | number | undefined): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new DailyMedError(502, "DailyMed returned incomplete catalog information.");
  }
  return parsed;
}

async function readDailyMedPage(url: URL): Promise<DailyMedPage> {
  const key = url.toString();
  const cached = pageCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const pending = pendingPages.get(key);
  if (pending) return pending;
  const request = loadDailyMedPage(url).then((value) => {
    if (pageCache.size >= 200) pageCache.delete(pageCache.keys().next().value!);
    pageCache.set(key, { expiresAt: Date.now() + 5 * 60_000, value });
    return value;
  }).finally(() => pendingPages.delete(key));
  pendingPages.set(key, request);
  return request;
}

async function loadDailyMedPage(url: URL): Promise<DailyMedPage> {
  const response = await fetchDailyMed(url);
  if (!response.ok) {
    throw new DailyMedError(502, "DailyMed did not return medication catalog data.");
  }

  let page: DailyMedPage;
  try {
    page = (await response.json()) as DailyMedPage;
  } catch {
    throw new DailyMedError(502, "DailyMed returned an unreadable catalog response.");
  }

  if (!Array.isArray(page.data) || !page.metadata) {
    throw new DailyMedError(502, "DailyMed returned an incomplete catalog response.");
  }
  return page;
}

function listUrl(
  doctype: keyof typeof HUMAN_LABEL_TYPES,
  query: string | undefined,
  page: number,
): URL {
  const url = new URL(`${DAILYMED_API}.json`);
  url.searchParams.set("doctype", doctype);
  url.searchParams.set("pagesize", String(PAGE_SIZE_PER_TYPE));
  url.searchParams.set("page", String(page));
  if (query) url.searchParams.set("drug_name", query);
  return url;
}

function errorResponse(res: ExpressResponse, error: unknown) {
  if (error instanceof DailyMedError) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(502).json({
    message: "Medication information could not be loaded. Please try again.",
  });
}

router.get("/medication-labels", async (req, res) => {
  let query: string | undefined;
  let page: number;
  try {
    const params = GetMedicationLabelsQueryParams.parse(req.query);
    query = params.query?.trim() || undefined;
    page = params.page;
    if (page > 100_000) {
      return res.status(400).json({ message: "Page is outside the supported range." });
    }
  } catch {
    return res.status(400).json({ message: "Enter a medication name and a valid page number." });
  }

  try {
    const categories = await Promise.all(
      (Object.keys(HUMAN_LABEL_TYPES) as (keyof typeof HUMAN_LABEL_TYPES)[]).map(async (doctype) => {
        const firstPage = await readDailyMedPage(listUrl(doctype, query, 1));
        return { doctype, firstPage, count: readPositiveInteger(firstPage.metadata?.total_elements) };
      }),
    );
    const totalItems = categories.reduce(
      (total, category) => total + category.count,
      0,
    );
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE_PER_TYPE));
    page = Math.min(page, totalPages);
    let offset = (page - 1) * PAGE_SIZE_PER_TYPE;
    let remaining = PAGE_SIZE_PER_TYPE;
    const items = [];
    for (const category of categories) {
      if (remaining === 0) break;
      if (offset >= category.count) {
        offset -= category.count;
        continue;
      }
      const take = Math.min(remaining, category.count - offset);
      let collected = 0;
      let sourcePage = Math.floor(offset / PAGE_SIZE_PER_TYPE) + 1;
      let sourceOffset = offset % PAGE_SIZE_PER_TYPE;
      while (collected < take) {
        const result = sourcePage === 1
          ? category.firstPage
          : await readDailyMedPage(listUrl(category.doctype, query, sourcePage));
        const slice = result.data!.slice(sourceOffset, sourceOffset + take - collected);
        if (slice.length === 0) {
          throw new DailyMedError(502, "DailyMed's catalog changed while paging. Please refresh and try again.");
        }
        for (const entry of slice) {
          if (!entry.setid || !entry.title || !entry.published_date) {
            throw new DailyMedError(502, "DailyMed returned an incomplete label record.");
          }
          items.push({
            setId: entry.setid,
            title: entry.title,
            publishedDate: entry.published_date,
            labelType: HUMAN_LABEL_TYPES[category.doctype],
            sourceUrl: `${DAILYMED_LABEL}${entry.setid}`,
          });
        }
        collected += slice.length;
        sourcePage += 1;
        sourceOffset = 0;
      }
      remaining -= take;
      offset = 0;
    }
    const catalogUpdatedAt = categories.find((category) =>
      category.firstPage.metadata?.db_published_date,
    )?.firstPage.metadata?.db_published_date;
    if (!catalogUpdatedAt) {
      throw new DailyMedError(502, "DailyMed did not include its catalog update date.");
    }

    return res.json(GetMedicationLabelsResponse.parse({
      items,
      query: query ?? null,
      page,
      pageSize: PAGE_SIZE_PER_TYPE,
      totalItems,
      totalPages,
      catalogUpdatedAt,
    }));
  } catch (error) {
    return errorResponse(res, error);
  }
});

function extractElement(xml: string, start: number, name: string): string | null {
  const token = new RegExp(`<\\/?${name}\\b[^>]*>`, "gi");
  token.lastIndex = start;
  let depth = 0;
  let elementStart = -1;

  for (let match = token.exec(xml); match; match = token.exec(xml)) {
    const isClosing = match[0].startsWith("</");
    const isSelfClosing = /\/\s*>$/.test(match[0]);
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) {
      if (depth === 0) elementStart = match.index;
      depth += 1;
    }
    if (depth === 0 && elementStart >= 0) return xml.slice(elementStart, token.lastIndex);
  }
  return null;
}

function decodeXmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    lsquo: "‘",
    rsquo: "’",
    ldquo: "“",
    rdquo: "”",
    copy: "©",
    reg: "®",
    trade: "™",
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_entity, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_entity, decimal: string) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    )
    .replace(/&([a-z]+);/gi, (entity, name: string) =>
      namedEntities[name.toLowerCase()] ?? entity,
    );
}

function sectionText(xml: string): string | null {
  const indicationCode = /<code\b[^>]*\bcode=["']34067-9["'][^>]*>/i.exec(xml);
  if (!indicationCode) return null;

  const sectionStart = xml.lastIndexOf("<section", indicationCode.index);
  if (sectionStart < 0) return null;
  const section = extractElement(xml, sectionStart, "section");
  if (!section) return null;

  // SPL highlights repeat abbreviated uses in an excerpt. Keep the full label
  // text and nested indication sections instead of duplicating that summary.
  const fullSection = section.replace(/<excerpt\b[^>]*>[\s\S]*?<\/excerpt>/gi, "");
  if (!/<text\b/i.test(fullSection)) return null;
  // Include all nested indication subsections, not only the first text block.
  const plainText = fullSection
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, "")
    .replace(/\s+/g, " ")
    .replace(/<(?:br|\/?paragraph|\/?list|\/?item|\/?tr|\/?table|\/?title|\/?caption)\b[^>]*\/?>/gi, "\n")
    .replace(/<\/?(?:td|th)\b[^>]*>/gi, " | ")
    .replace(/<[^>]+>/g, "")
    .split(/\r?\n/)
    .map((line) => decodeXmlEntities(line).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  return plainText || null;
}

function formatEffectiveDate(xml: string): string | null {
  const match = /<effectiveTime\b[^>]*\bvalue=["'](\d{8})["'][^>]*\/?>/i.exec(xml);
  if (!match) return null;
  return `${match[1].slice(0, 4)}-${match[1].slice(4, 6)}-${match[1].slice(6, 8)}`;
}

router.get("/medication-labels/:setId", async (req, res) => {
  let setId: string;
  try {
    ({ setId } = GetMedicationLabelParams.parse(req.params));
  } catch {
    return res.status(404).json({ message: "This medication label could not be found." });
  }

  try {
    const xmlUrl = new URL(`${DAILYMED_API}/${setId}.xml`);
    const metadataUrl = new URL(`${DAILYMED_API}.json`);
    metadataUrl.searchParams.set("setid", setId);
    metadataUrl.searchParams.set("pagesize", "1");

    const xmlResponse = await fetchDailyMed(xmlUrl);
    if (xmlResponse.status === 404) {
      return res.status(404).json({ message: "This medication label is not in the current DailyMed catalog." });
    }
    if (!xmlResponse.ok) {
      throw new DailyMedError(502, "DailyMed did not return this medication label.");
    }

    const [xml, metadataPage] = await Promise.all([
      xmlResponse.text(),
      readDailyMedPage(metadataUrl),
    ]);
    const typeCode = /<code\b[^>]*\bcode=["']([^"']+)["'][^>]*>/i.exec(xml)?.[1] as
      | keyof typeof HUMAN_LABEL_TYPES
      | undefined;
    const labelType: LabelType | undefined = typeCode ? HUMAN_LABEL_TYPES[typeCode] : undefined;
    const metadata = metadataPage.data?.[0];
    if (!labelType || !metadata?.title || !metadata.published_date) {
      return res.status(404).json({ message: "This human medication label could not be found." });
    }

    return res.json(GetMedicationLabelResponse.parse({
      setId,
      title: metadata.title,
      publishedDate: metadata.published_date,
      labelType,
      sourceUrl: `${DAILYMED_LABEL}${setId}`,
      labelEffectiveDate: formatEffectiveDate(xml),
      usesText: sectionText(xml),
    }));
  } catch (error) {
    return errorResponse(res, error);
  }
});

export default router;
