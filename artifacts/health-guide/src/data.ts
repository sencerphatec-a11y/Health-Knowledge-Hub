export type Kind = 'Article' | 'Condition' | 'Medication';

export interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
  description: string;
}

export interface LibraryEntry {
  id: string;
  kind: Kind;
  title: string;
  category: string;
  summary: string;
  checked: string;
  sourceIds: string[];
  sections: { heading: string; paragraphs: string[]; points?: string[] }[];
}

export const sources: Source[] = [
  { id: 'med-hbp', title: 'High Blood Pressure', organization: 'MedlinePlus', url: 'https://medlineplus.gov/highbloodpressure.html', description: 'Overview of high blood pressure, measurement, and care.' },
  { id: 'med-asthma', title: 'Asthma', organization: 'MedlinePlus', url: 'https://medlineplus.gov/asthma.html', description: 'Information about asthma symptoms, causes, and management.' },
  { id: 'med-t2d', title: 'Type 2 Diabetes', organization: 'MedlinePlus', url: 'https://medlineplus.gov/diabetestype2.html', description: 'Plain-language reference on type 2 diabetes.' },
  { id: 'med-ibu', title: 'Ibuprofen', organization: 'MedlinePlus', url: 'https://medlineplus.gov/druginfo/meds/a682159.html', description: 'Drug information and safety considerations for ibuprofen.' },
  { id: 'med-aceta', title: 'Acetaminophen', organization: 'MedlinePlus', url: 'https://medlineplus.gov/druginfo/meds/a681004.html', description: 'Drug information and important acetaminophen safety guidance.' },
  { id: 'med-met', title: 'Metformin', organization: 'MedlinePlus', url: 'https://medlineplus.gov/druginfo/meds/a696005.html', description: 'Drug information for people prescribed metformin.' },
  { id: 'cdc-antibiotic', title: 'Antibiotic Prescribing and Use', organization: 'Centers for Disease Control and Prevention (CDC)', url: 'https://www.cdc.gov/antibiotic-use/', description: 'CDC information on appropriate antibiotic use.' },
  { id: 'fda-label', title: 'The Over-the-Counter Drug Facts Label', organization: 'U.S. Food and Drug Administration (FDA)', url: 'https://www.fda.gov/drugs/understanding-over-counter-medicines/over-counter-drug-facts-label', description: 'How to find and understand key information on OTC medicine labels.' },
];

export const entries: LibraryEntry[] = [
  {
    id: 'blood-pressure-readings', kind: 'Article', title: 'How blood pressure readings are understood', category: 'Heart health',
    summary: 'A blood pressure reading is a pair of measurements taken at a particular moment. Understanding what it may mean depends on how it was measured and the person’s overall health.',
    checked: 'October 2026', sourceIds: ['med-hbp'],
    sections: [
      { heading: 'Two numbers, one measurement', paragraphs: ['The upper number reflects pressure when the heart beats; the lower number reflects pressure between beats. Both numbers matter, and one reading is only a snapshot.'] },
      { heading: 'Why the setting matters', paragraphs: ['Cuff fit, body position, recent activity, stress, and other factors can influence a reading. A health professional may repeat measurements or consider readings taken over time before interpreting them.'] },
      { heading: 'What to do with a result', paragraphs: ['Ask the clinician who took the measurement what it means for you. Do not use one number from this guide to diagnose yourself or change treatment.'] },
    ],
  },
  {
    id: 'antibiotics-and-viruses', kind: 'Article', title: 'Antibiotics do not treat viruses', category: 'Everyday health',
    summary: 'Antibiotics are medicines for certain bacterial infections, not viral illnesses such as colds or flu. Using them as prescribed helps reduce avoidable harm.',
    checked: 'October 2026', sourceIds: ['cdc-antibiotic'],
    sections: [
      { heading: 'Different causes need different care', paragraphs: ['Bacteria and viruses are different kinds of germs. Antibiotics do not work against viruses, though a clinician may recommend other ways to manage symptoms or assess complications.'] },
      { heading: 'Use antibiotics as prescribed', paragraphs: ['If an antibiotic is prescribed, follow the directions from your prescriber and pharmacist. Do not share medicines or save them for a later illness.'] },
      { heading: 'When you have questions', paragraphs: ['A clinician can help determine whether an antibiotic is appropriate. Ask a pharmacist or prescriber about side effects, missed instructions, or concerns.'] },
    ],
  },
  {
    id: 'read-drug-facts', kind: 'Article', title: 'How to read the OTC Drug Facts label', category: 'Medication literacy',
    summary: 'The Drug Facts panel is a consistent place to check what an over-the-counter medicine is for, its warnings, and directions supplied by the manufacturer.',
    checked: 'October 2026', sourceIds: ['fda-label'],
    sections: [
      { heading: 'Start with the purpose', paragraphs: ['The label identifies active ingredients and the symptoms or uses the product is intended for. Compare active ingredients when considering more than one product.'] },
      { heading: 'Read warnings and directions', paragraphs: ['Warnings can explain when to avoid a product or seek advice. Directions describe the labeled use; never exceed label instructions. The package label is specific to that product.'] },
      { heading: 'Get help with uncertainty', paragraphs: ['Ask a pharmacist or clinician to help interpret a label, especially if you use other medicines or have health conditions. This guide is not a substitute for product labeling.'] },
    ],
  },
  {
    id: 'high-blood-pressure', kind: 'Condition', title: 'High blood pressure', category: 'Heart health',
    summary: 'High blood pressure often has no obvious symptoms. It is identified through properly taken measurements and clinical interpretation, not by how someone feels.',
    checked: 'October 2026', sourceIds: ['med-hbp'],
    sections: [
      { heading: 'What it means', paragraphs: ['Blood pressure describes the force of blood against artery walls. A pattern of readings above a healthy range can place extra strain on the heart and blood vessels over time.'] },
      { heading: 'Often quiet, still worth checking', paragraphs: ['Many people do not notice symptoms. A properly sized cuff and correct measurement technique matter; a clinician considers repeated readings and individual circumstances.'] },
      { heading: 'Understanding next steps', paragraphs: ['If you have a reading that concerns you, discuss it with a health professional. Evaluation and care are personal; do not diagnose or adjust treatment based on this page alone.'] },
    ],
  },
  {
    id: 'asthma', kind: 'Condition', title: 'Asthma', category: 'Breathing',
    summary: 'Asthma involves inflammation and narrowing of the airways. It can cause wheezing, coughing, chest tightness, or shortness of breath, and experiences vary.',
    checked: 'October 2026', sourceIds: ['med-asthma'],
    sections: [
      { heading: 'What happens in the airways', paragraphs: ['With asthma, airway inflammation and tightening can make it harder for air to move. Symptoms may come and go and can be triggered by different things.'] },
      { heading: 'Symptoms and evaluation', paragraphs: ['Common symptoms include wheeze, cough, chest tightness, and breathlessness. A clinician uses a person’s history and appropriate tests to evaluate symptoms.'] },
      { heading: 'A personal care plan', paragraphs: ['Treatment and an action plan should be discussed with a clinician. Seek urgent help for severe breathing difficulty or rapidly worsening symptoms.'] },
    ],
  },
  {
    id: 'type-2-diabetes', kind: 'Condition', title: 'Type 2 diabetes', category: 'Metabolic health',
    summary: 'Type 2 diabetes is a chronic condition involving elevated blood glucose. Evaluation and treatment are individualized with a health professional.',
    checked: 'October 2026', sourceIds: ['med-t2d'],
    sections: [
      { heading: 'A condition involving blood glucose', paragraphs: ['The body may not use insulin effectively and may not make enough insulin to keep blood glucose in a healthy range. Each person’s experience can differ.'] },
      { heading: 'Testing and interpretation', paragraphs: ['A clinician uses appropriate tests and health history to evaluate blood glucose. Symptoms alone cannot confirm or rule out diabetes.'] },
      { heading: 'Care is individual', paragraphs: ['Ongoing care may involve several approaches chosen with a care team. Discuss questions and treatment decisions with your clinician; this summary is not a treatment plan.'] },
    ],
  },
  {
    id: 'ibuprofen', kind: 'Medication', title: 'Ibuprofen', category: 'Pain & fever',
    summary: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used for pain and fever. Whether it is suitable depends on the person and the specific product label.',
    checked: 'October 2026', sourceIds: ['med-ibu'],
    sections: [
      { heading: 'What it is used for', paragraphs: ['Ibuprofen is an NSAID that may be used for pain, fever, and inflammation. Products and labeled uses can differ.'] },
      { heading: 'Safety depends on the person', paragraphs: ['NSAIDs may not be appropriate for everyone and can have important risks, including interactions or effects on the stomach, kidneys, heart, or other conditions. Check the product label.'] },
      { heading: 'Before using a medicine', paragraphs: ['Ask a pharmacist or clinician if you are unsure whether ibuprofen is right for you, particularly if you take other medicines or have a health condition. Follow the product label and professional advice.'] },
    ],
  },
  {
    id: 'acetaminophen', kind: 'Medication', title: 'Acetaminophen', category: 'Pain & fever',
    summary: 'Acetaminophen is used for pain and fever. Taking too much, or combining multiple products that contain it, can harm the liver.',
    checked: 'October 2026', sourceIds: ['med-aceta', 'fda-label'],
    sections: [
      { heading: 'Check every active ingredient', paragraphs: ['Acetaminophen can be included in different prescription and over-the-counter products. Read Drug Facts and other product labels to identify active ingredients.'] },
      { heading: 'Avoid accidental duplication', paragraphs: ['Taking too much acetaminophen can cause serious liver harm. Using more than one product that contains it may unintentionally increase total exposure.'] },
      { heading: 'Ask before combining products', paragraphs: ['A pharmacist or clinician can help you review products and personal risks. Follow the specific package label and professional instructions.'] },
    ],
  },
  {
    id: 'metformin', kind: 'Medication', title: 'Metformin', category: 'Prescription medicines',
    summary: 'Metformin is a prescription medicine commonly used for type 2 diabetes. Follow the prescriber’s directions and ask a pharmacist or clinician about questions.',
    checked: 'October 2026', sourceIds: ['med-met'],
    sections: [
      { heading: 'About metformin', paragraphs: ['Metformin is commonly prescribed as part of care for type 2 diabetes. The reasons for using it and the treatment plan depend on an individual’s health.'] },
      { heading: 'Taking a prescription medicine', paragraphs: ['Use it only as directed by the prescriber and the pharmacy label. Do not change or stop a prescribed medicine without discussing it with the care team.'] },
      { heading: 'Questions and concerns', paragraphs: ['A pharmacist or clinician can explain directions, possible side effects, and how the medicine fits your care. Seek professional advice rather than relying on a general guide.'] },
    ],
  },
];

export const getSource = (id: string) => sources.find((source) => source.id === id);
export const getEntry = (id: string) => entries.find((entry) => entry.id === id);
