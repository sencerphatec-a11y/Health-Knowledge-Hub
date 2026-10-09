import snapshot from './recent-articles.json';
import type { LibraryEntry, Source } from '../data';

export const articleSelectionChecked = snapshot.checked;
export const articleSelectionNote = snapshot.selection;
export const recentArticleCount = snapshot.records.length;

export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T12:00:00Z`));
}

export const recentArticleSources: Source[] = snapshot.records.map(record => ({
  id: `source-${record.id}`,
  title: record.title,
  organization: record.publisher,
  url: record.url,
  description: `${record.articleType}. Published ${formatArticleDate(record.published)} according to the publisher. Original reporting and evidence remain at the linked source.`,
}));

export const recentArticleEntries: LibraryEntry[] = snapshot.records.map(record => ({
  id: record.id,
  kind: 'Article',
  title: record.title,
  category: record.category,
  summary: record.summary,
  published: record.published,
  publishedAt: record.publishedAt || undefined,
  publisher: record.publisher,
  originalUrl: record.url,
  articleType: record.articleType,
  checked: snapshot.checked,
  sourceIds: [`source-${record.id}`],
  sections: [
    {
      heading: 'About this read',
      paragraphs: [
        `This is a short Health Guide brief of a ${record.articleType.toLowerCase()} article from ${record.publisher}, published ${formatArticleDate(record.published)}. Follow the original-source link for the complete article, its authors, evidence, and any later corrections.`,
        'This selection is intended to help readers find relevant health information, not to rank articles by popularity or to establish medical recommendations.',
      ],
    },
    {
      heading: 'Read in context',
      paragraphs: [
        record.articleType === 'Research news'
          ? 'A research report may describe an early experiment, a small trial, or an association rather than an established treatment. Check the study population, limitations, and whether results apply to people before drawing conclusions.'
          : 'News reports, expert explainers, personal experiences, and policy proposals are different kinds of evidence. A proposed benefit or state-specific rule is not necessarily available nationwide. Check the full article and current official guidance for details.',
        'Do not change a medicine or treatment plan based on a headline. Discuss personal health decisions with a qualified clinician.',
      ],
    },
    ...(record.category === 'Mental health' || record.title.toLowerCase().includes('suicide') ? [{
      heading: 'Crisis support in the United States',
      paragraphs: ['If you or someone you know needs help with a mental-health or suicide crisis, call or text 988. For an immediate life-threatening emergency, call 911.'],
    }] : []),
  ],
}));
