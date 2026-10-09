import records from './condition-summaries.json';
import type { LibraryEntry, Source } from '../data';

const legacySourceIds = new Set(['med-hbp', 'med-asthma', 'med-t2d']);

export const conditionSources: Source[] = records.records
  .filter((record) => !legacySourceIds.has(record.sourceId))
  .map((record) => ({
    id: record.sourceId,
    title: record.sourceTitle,
    organization: 'MedlinePlus · U.S. National Library of Medicine',
    url: record.sourceUrl,
    description: `Original MedlinePlus health-topic information for ${record.title.toLowerCase()}.`,
  }));

export const conditionEntries: LibraryEntry[] = records.records.map((record) => ({
  id: record.id,
  kind: 'Condition',
  title: record.title,
  category: record.category,
  summary: record.summary,
  checked: 'October 2026',
  sourceIds: [record.sourceId],
  sections: [
    {
      heading: 'Source and scope',
      paragraphs: [
        `The information below is the MedlinePlus health-topic summary from the U.S. National Library of Medicine, provided as general education. Source snapshot: ${records.sourceExportDate}. The original topic is linked under Sources and further reading.`,
        'This is not a personal diagnosis or treatment plan. Symptoms can have different causes; a clinician can assess your situation. Seek immediate help for potentially life-threatening symptoms.',
      ],
    },
    ...record.sections,
  ],
}));
