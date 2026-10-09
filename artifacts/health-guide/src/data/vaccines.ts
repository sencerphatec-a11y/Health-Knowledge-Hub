import facts from './vaccine-facts.json';

export const vaccineFacts = facts.records;
export const vaccineSourceChecked = facts.checked;
export const vaccineIndexUrl = facts.sourceIndex;
export const scheduleStatus = 'CDC identifies its July 2, 2025 schedules as current under a March 16, 2026 court order. The adult schedule includes an April 27, 2026 RSV amendment. This source status was checked October 9, 2026. Always check the official CDC page for subsequent changes.';
export const scheduleDisclaimer = 'Educational summaries, not a personalized vaccination plan or a substitute for the complete schedules. Product choice, previous doses, minimum intervals, pregnancy, immunity, health conditions, and exposure risk can change recommendations. Read the linked CDC notes and discuss your record with a vaccination provider.';

export const scheduleGroups = [
  {
    id: 'children', label: 'Birth–6 years', title: 'Infants & young children',
    description: 'Typical routine timing from the CDC child schedule. Catch-up and risk-specific recommendations require the complete notes.',
    sourceUrl: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html',
    rows: [
      { vaccine: 'Hepatitis B', timing: 'Birth, 1–2 months, 6–18 months', notes: 'Routine 3-dose series; birth dose and timing may depend on weight and maternal infection status.' },
      { vaccine: 'Rotavirus', timing: '2 and 4 months; also 6 months for a 3-dose product', notes: 'Product-dependent 2- or 3-dose series. Strict maximum ages apply; see CDC notes.' },
      { vaccine: 'DTaP', timing: '2, 4, 6 months; 15–18 months; 4–6 years', notes: 'Protects against diphtheria, tetanus, and pertussis.' },
      { vaccine: 'Hib', timing: '2, 4 months; sometimes 6 months; booster 12–15 months', notes: 'Number of doses depends on the vaccine product.' },
      { vaccine: 'Pneumococcal conjugate', timing: '2, 4, 6 and 12–15 months', notes: 'Additional recommendations apply to certain medical conditions.' },
      { vaccine: 'Polio (IPV)', timing: '2, 4, 6–18 months and 4–6 years', notes: 'Minimum age and spacing requirements apply to the final dose.' },
      { vaccine: 'MMR', timing: '12–15 months and 4–6 years', notes: 'Earlier or additional doses may be needed for travel or outbreaks.' },
      { vaccine: 'Varicella (chickenpox)', timing: '12–15 months and 4–6 years', notes: 'Recommendations depend on evidence of immunity and medical history.' },
      { vaccine: 'Hepatitis A', timing: 'Start at 12–23 months; second dose at least 6 months later', notes: 'Catch-up vaccination is available for older children.' },
      { vaccine: 'Influenza (flu)', timing: 'Every year beginning at 6 months', notes: 'Some children aged 6 months–8 years need 2 doses at least 4 weeks apart.' },
      { vaccine: 'COVID-19', timing: 'See current CDC COVID-19 guidance', notes: 'Product, age, immune status, prior doses, and changing seasonal guidance affect recommendations.' },
      { vaccine: 'RSV preventive antibody', timing: 'Seasonal protection for eligible infants; selected high-risk children 8–19 months', notes: 'An antibody is not a vaccine. Eligibility depends on maternal RSV vaccination, age, season, and medical risk.' },
    ],
    links: [
      { label: 'Parent-friendly schedule', url: 'https://www.cdc.gov/vaccines/imz-schedules/child-easyread.html' },
      { label: 'Complete child & adolescent schedule (PDF)', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/downloads/child/0-18yrs-child-combined-schedule.pdf' },
      { label: 'Child schedule notes', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html' },
    ],
  },
  {
    id: 'adolescents', label: '7–18 years', title: 'Children & teens',
    description: 'Continue annual vaccines and review childhood records. Additional vaccines may be recommended for medical, travel, or exposure risks.',
    sourceUrl: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html',
    rows: [
      { vaccine: 'Tdap', timing: '11–12 years', notes: 'Catch-up recommendations differ for children missing childhood doses.' },
      { vaccine: 'HPV', timing: 'Routine at 11–12 years; may start at age 9', notes: '2 or 3 doses depending on starting age and immune status; spacing matters.' },
      { vaccine: 'Meningococcal ACWY', timing: '11–12 years; booster at 16 years', notes: 'Different timing applies for certain medical conditions or earlier doses.' },
      { vaccine: 'Meningococcal B', timing: 'Ages 16–23; preferred 16–18 when chosen', notes: 'Shared clinical decision-making for healthy teens; different recommendations apply for increased risk.' },
      { vaccine: 'Influenza (flu)', timing: 'Every year', notes: 'Two doses may be needed for some children through age 8.' },
      { vaccine: 'COVID-19', timing: 'See current CDC COVID-19 guidance', notes: 'Use current product-specific guidance rather than older fact-sheet seasonal schedules.' },
      { vaccine: 'Childhood catch-up vaccines', timing: 'Review missed HepA, HepB, MMR, varicella, polio and other doses', notes: 'Use the full catch-up table with your vaccination provider; this summary does not assign doses.' },
      { vaccine: 'Dengue / mpox / other risk-specific vaccines', timing: 'Only when eligibility and risk criteria are met', notes: 'Dengue has specific age, prior-infection, and endemic-area requirements. See complete notes for each vaccine.' },
    ],
    links: [
      { label: 'Parent-friendly teen schedule', url: 'https://www.cdc.gov/vaccines/imz-schedules/adolescent-easyread.html' },
      { label: 'Catch-up schedule', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html' },
      { label: 'Child schedule notes', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html' },
    ],
  },
  {
    id: 'adults', label: '19+ years', title: 'Adults & older adults',
    description: 'Age is only part of the recommendation. Bring your vaccination record and discuss immunity, pregnancy, medical conditions, work, travel, and exposure risks.',
    sourceUrl: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-age.html',
    rows: [
      { vaccine: 'Influenza (flu)', timing: 'Every year', notes: 'Certain products are preferred for adults 65 and older; ask your provider.' },
      { vaccine: 'COVID-19', timing: 'See current CDC COVID-19 guidance', notes: 'Doses vary with age, immune status, prior vaccination, and current formulation.' },
      { vaccine: 'Tdap / Td', timing: 'At least 1 Tdap dose if not previously received; Td or Tdap every 10 years', notes: 'Additional guidance applies to wound care, incomplete series, and each pregnancy.' },
      { vaccine: 'Shingles (recombinant zoster)', timing: '2-dose series at age 50+; also certain immunocompromised adults age 19+', notes: 'Dose interval depends on the clinical situation.' },
      { vaccine: 'Pneumococcal', timing: 'Age 50+; selected younger adults with risk factors', notes: 'Product and sequence depend on previous pneumococcal doses and medical history; read CDC notes.' },
      { vaccine: 'RSV', timing: 'Age 75+; ages 50–74 with increased risk of severe RSV', notes: 'Not an annual vaccine. Do not repeat a prior RSV vaccine dose unless current guidance changes; see CDC notes.' },
      { vaccine: 'Hepatitis B', timing: 'Routine ages 19–59; age 60+ based on risk or request', notes: '2, 3, or 4 doses depending on product and medical circumstances.' },
      { vaccine: 'HPV', timing: 'Catch-up through age 26; ages 27–45 by shared clinical decision-making', notes: '2 or 3 doses depending on age when the series began and immune status.' },
      { vaccine: 'MMR', timing: 'When evidence of immunity is absent; generally 1 or 2 doses', notes: 'Birth year, occupation, travel and outbreaks affect recommendations. Live vaccine precautions apply.' },
      { vaccine: 'Varicella', timing: '2 doses when evidence of immunity is absent', notes: 'Pregnancy and immunocompromising conditions can affect whether this live vaccine is appropriate.' },
      { vaccine: 'Hepatitis A', timing: 'Based on risk, indication, or request', notes: 'Series depends on vaccine product; discuss travel, liver disease, and other risk factors.' },
      { vaccine: 'Meningococcal ACWY / B', timing: 'For specific risks, settings, or shared decisions', notes: 'Dose number and boosters depend on indication and product.' },
      { vaccine: 'Hib', timing: 'For selected medical indications', notes: 'Asplenia and stem-cell transplantation are examples; not routine for every adult.' },
      { vaccine: 'Mpox', timing: '2-dose series for eligible people at risk', notes: 'Discuss risk, exposure, and product-specific guidance.' },
      { vaccine: 'Polio (IPV)', timing: 'Complete the primary series if unvaccinated or incompletely vaccinated', notes: 'Additional guidance applies to adults with increased exposure risk.' },
    ],
    links: [
      { label: 'Easy-to-read adult schedule', url: 'https://www.cdc.gov/vaccines/imz-schedules/adult-easyread.html' },
      { label: 'Complete adult schedule (PDF)', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/downloads/adult/adult-combined-schedule.pdf' },
      { label: 'Adult schedule notes', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html' },
      { label: 'Recommendations by medical condition', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-medical-condition.html' },
    ],
  },
  {
    id: 'pregnancy', label: 'Pregnancy', title: 'Vaccination during pregnancy',
    description: 'Discuss timing with your obstetric or vaccination provider. Some vaccines protect both you and your baby, while some live vaccines are not given during pregnancy.',
    sourceUrl: 'https://www.cdc.gov/vaccines-pregnancy/index.html',
    rows: [
      { vaccine: 'Tdap', timing: 'During each pregnancy, preferably early in weeks 27–36', notes: 'Helps protect the newborn from pertussis.' },
      { vaccine: 'Influenza (flu)', timing: 'During flu season; inactivated or recombinant vaccine', notes: 'The live nasal-spray vaccine is not used during pregnancy.' },
      { vaccine: 'Maternal RSV vaccine', timing: 'Weeks 32–36 during the designated RSV season, when eligible', notes: 'Only the designated maternal vaccine is used. Timing and prior maternal RSV vaccination affect the infant-protection plan.' },
      { vaccine: 'COVID-19 and other indicated vaccines', timing: 'Review current guidance and individual risks with your provider', notes: 'Check current recommendations rather than relying on older seasonal vaccine statements.' },
      { vaccine: 'MMR and varicella', timing: 'Not given during pregnancy', notes: 'Discuss immunity and vaccination before pregnancy or after delivery.' },
    ],
    links: [
      { label: 'CDC pregnancy vaccine guidance', url: 'https://www.cdc.gov/vaccines-pregnancy/index.html' },
      { label: 'RSV vaccination guidance', url: 'https://www.cdc.gov/rsv/vaccines/index.html' },
      { label: 'Current COVID-19 vaccine guidance', url: 'https://www.cdc.gov/covid/hcp/vaccine-considerations/index.html' },
    ],
  },
];

export const vaccineLearningLinks = [
  { label: 'All current CDC vaccine fact sheets', url: vaccineIndexUrl },
  { label: 'Download all CDC VIS documents (ZIP)', url: 'https://www.cdc.gov/vaccines/hcp/current-vis/downloads/vis.zip' },
  { label: 'FDA vaccines licensed for use in the United States', url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/vaccines-licensed-use-united-states' },
  { label: 'CDC vaccine basics', url: 'https://www.cdc.gov/vaccines/basics/index.html' },
  { label: 'Vaccine safety questions and concerns', url: 'https://www.cdc.gov/vaccine-safety/about/index.html' },
  { label: 'Travel vaccine guidance by destination', url: 'https://wwwnc.cdc.gov/travel' },
  { label: 'Catch-up schedule', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html' },
  { label: 'Child contraindications and precautions', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-appendix.html' },
  { label: 'Adult contraindications and precautions', url: 'https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-appendix.html' },
  { label: 'Report an adverse event to VAERS', url: 'https://vaers.hhs.gov/' },
];
