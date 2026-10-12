import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const cacheDir = await mkdtemp(join(tmpdir(), 'health-guide-search-'));
const server = await createServer({
  configFile: false,
  root: new URL('..', import.meta.url).pathname,
  cacheDir,
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true },
});
after(async () => {
  await server.close();
  await rm(cacheDir, { recursive: true, force: true });
});
const { searchSite } = await server.ssrLoadModule('/src/data/site-search.ts');
const { entries, getSource } = await server.ssrLoadModule('/src/data.ts');

// The previous global-search behavior remains the baseline for library entries.
function previousLibrarySearch(query) {
  const normalized = query.trim().toLowerCase();
  return entries.filter((entry) => {
    const sources = entry.sourceIds.map((id) => {
      const source = getSource(id);
      return source ? `${source.title} ${source.organization}` : '';
    }).join(' ');
    return !normalized || [
      entry.title, entry.category, entry.summary,
      ...entry.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.points || [])]),
      sources,
    ].join(' ').toLowerCase().includes(normalized);
  });
}

test('interaction queries return one educational guide with its standalone route', () => {
  for (const query of ['Medscape', 'drug interactions', 'medication interactions', '  MEDSCAPE  ', 'drug interaction checker']) {
    const result = searchSite(query);
    assert.equal(result.guideResults.length, 1, query);
    const guide = result.guideResults[0];
    assert.equal(guide.href, '/drug-interactions');
    assert.match(guide.category, /Educational guide.*External checker/);
    assert.match(guide.summary, /not a personalized interaction result or safety check/);
    assert.equal(result.count, result.libraryResults.length + 1);
  }
});

test('article, condition, medication, and source matches preserve existing results and order', () => {
  for (const query of ['', 'blood pressure', 'asthma', 'ibuprofen', 'MedlinePlus', 'DailyMed', 'Medscape', 'drug interactions']) {
    assert.deepEqual(searchSite(query).libraryResults, previousLibrarySearch(query), query);
  }
  for (const kind of ['Article', 'Condition', 'Medication']) {
    const entry = entries.find((item) => item.kind === kind);
    assert.ok(entry, kind);
    assert.ok(searchSite(entry.title).libraryResults.some((item) => item.id === entry.id), kind);
  }
});

test('empty queries include the guide once, while unrelated queries keep the empty state', () => {
  assert.equal(searchSite('').count, entries.length + 1);
  assert.equal(searchSite('   ').guideResults.length, 1);
  assert.deepEqual(searchSite('zz-no-health-guide-match-zz'), { libraryResults: [], guideResults: [], count: 0 });
});
