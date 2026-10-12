import { entries, getSource, searchableGuides } from '../data';
import type { SearchableGuide } from '../data';

function guideMatchesQuery(guide: SearchableGuide, normalizedQuery: string) {
  const searchableText = [guide.title, guide.category, guide.summary, ...guide.keywords]
    .join(' ').toLowerCase();
  return !normalizedQuery || searchableText.includes(normalizedQuery);
}

export function searchSite(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const libraryResults = entries.filter((entry) => {
    const sourcesForEntry = entry.sourceIds.map((sourceId) => {
      const source = getSource(sourceId);
      return source ? `${source.title} ${source.organization}` : '';
    }).join(' ');
    const searchableText = [
      entry.title,
      entry.category,
      entry.summary,
      ...entry.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.points || [])]),
      sourcesForEntry,
    ].join(' ').toLowerCase();
    return !normalizedQuery || searchableText.includes(normalizedQuery);
  });
  const guideResults = searchableGuides.filter((guide) => guideMatchesQuery(guide, normalizedQuery));
  return { libraryResults, guideResults, count: libraryResults.length + guideResults.length };
}
