export type QuestionnaireId = 'wellbeing' | 'phq9' | 'gad7' | 'exercise' | 'lifestyle';
export interface QuestionnaireResource { label: string; href: string }
export interface QuestionnaireChoice { value: number; label: string; points: number }
export interface QuestionnaireQuestion {
  id: string;
  prompt: string;
  choices: QuestionnaireChoice[];
  note?: string;
}
export interface QuestionnaireDefinition {
  id: QuestionnaireId;
  category: string;
  title: string;
  description: string;
  timeframe: string;
  badge: string;
  scope: string;
  scoringExplanation: string;
  questions: QuestionnaireQuestion[];
  resources: QuestionnaireResource[];
  attribution?: string;
  functionalQuestion?: string;
}

export const questionnaireResources = {
  sleep: { label: 'CDC: sleep needs and healthy sleep habits', href: 'https://www.cdc.gov/sleep/about/index.html' },
  water: { label: 'CDC: water and healthier drinks', href: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html' },
  nutrition: { label: 'NHLBI: heart-healthy foods', href: 'https://www.nhlbi.nih.gov/health/heart-healthy-living/healthy-foods' },
  activity: { label: 'NIDDK: starting physical activity', href: 'https://www.niddk.nih.gov/health-information/weight-management/tips-get-active/tips-starting-physical-activity' },
  relaxation: { label: 'NCCIH: relaxation techniques and their limits', href: 'https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know' },
  meditation: { label: 'VA: free guided mindfulness recordings', href: 'https://www.veteranshealthlibrary.va.gov/Encyclopedia/142,85190_VA' },
  heart: { label: 'NHLBI: heart-healthy living', href: 'https://www.nhlbi.nih.gov/health/heart-healthy-living' },
  family: { label: 'NHLBI: understanding heart-disease risk factors', href: 'https://www.nhlbi.nih.gov/health/heart-healthy-living/risks' },
  prevention: { label: 'NHLBI: blood-pressure and cholesterol checks', href: 'https://www.nhlbi.nih.gov/health/heart-healthy-living/blood-pressure' },
  apnea: { label: 'NHLBI: sleep apnea and when to seek evaluation', href: 'https://www.nhlbi.nih.gov/health/sleep-apnea' },
  ergonomics: { label: 'OSHA: computer workstation ergonomics', href: 'https://www.osha.gov/etools/computer-workstations' },
  tobacco: { label: 'Smokefree.gov: quitting smoking and vaping support', href: 'https://smokefree.gov/' },
  depression: { label: 'MedlinePlus: depression information', href: 'https://medlineplus.gov/depression.html' },
  anxiety: { label: 'MedlinePlus: anxiety information', href: 'https://medlineplus.gov/anxiety.html' },
  phq: { label: 'Original PHQ-9 questionnaire (APA PDF)', href: 'https://www.apa.org/depression-guideline/patient-health-questionnaire.pdf' },
  gad: { label: 'Original GAD-7 questionnaire and scoring (ADAA PDF)', href: 'https://adaa.org/sites/default/files/2026-01/GAD-7_Anxiety-updated_0.pdf' },
  scoring: { label: 'PHQ / GAD scoring and reproduction instructions (PDF)', href: 'https://www.providerservices.iehp.org/content/dam/provider-services-rd/en/documents/providers/provider-resources/facility-site-review1/medical-record-review/adult-preventive/2025/20250128%20-%20PHQ%20_GAD%20Instructions.pdf' },
  parq: { label: 'Official PAR-Q+: current forms and use restrictions', href: 'https://eparmedx.com/print-versions-of-par-q/' },
  parqOnline: { label: 'Complete the official PAR-Q+ online', href: 'https://eparmedx.com/?page_id=75' },
  crisis: { label: '988 Lifeline: crisis support and chat', href: 'https://988lifeline.org/' },
  doctor: { label: 'Health Guide: Find a Doctor', href: '/find-a-doctor' },
  food: { label: 'Health Guide: meal programs and food pantries', href: '/find-food' },
  conditions: { label: 'Health Guide: condition library', href: '/conditions' },
} satisfies Record<string, QuestionnaireResource>;

const frequency: QuestionnaireChoice[] = [
  { value: 0, label: 'Not at all', points: 0 },
  { value: 1, label: 'Several days', points: 1 },
  { value: 2, label: 'More than half the days', points: 2 },
  { value: 3, label: 'Nearly every day', points: 3 },
];
const days: QuestionnaireChoice[] = [
  { value: 0, label: '0 days', points: 0 },
  { value: 1, label: '1–2 days', points: 1 },
  { value: 2, label: '3–4 days', points: 2 },
  { value: 3, label: '5–6 days', points: 3 },
  { value: 4, label: 'Every day', points: 4 },
];
const reviewChoices: QuestionnaireChoice[] = [
  { value: 0, label: 'No', points: 0 },
  { value: 1, label: 'Yes', points: 1 },
  { value: 2, label: 'Not sure', points: 1 },
];
const q = (id: string, prompt: string, choices: QuestionnaireChoice[], note?: string): QuestionnaireQuestion => ({ id, prompt, choices, ...(note ? { note } : {}) });
const attribution = 'Developed by Drs. Robert L. Spitzer, Janet B. W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. The PHQ/GAD instruction manual permits reproduction, translation, display and distribution without permission. Standard questions and response scores are retained; Health Guide’s explanatory recommendations are not part of the original instrument.';

export const questionnaireDefinitions: QuestionnaireDefinition[] = [
  {
    id: 'wellbeing', category: 'General health & wellbeing', title: 'Daily habits & wellbeing',
    description: 'Reflect on sleep, nutrition, fluids, movement and how manageable your stress feels.',
    timeframe: 'Over the past 7 days, on how many days did you do each of the following?',
    badge: 'Custom habit reflection',
    scope: 'An original, unvalidated educational quiz—not a measure of health, medical risk, or personal worth. Disability, medical restrictions, and access to food or safe spaces can affect these answers.',
    scoringExplanation: 'Each area earns 0–4 points based on days reported. Add the five values (0–20), then multiply by 5 for a habits-and-coping score out of 100. 0–39: Many habits to support; 40–74: Some habits to support; 75–100: Consistent habits. These are custom educational bands, not clinical thresholds.',
    questions: [
      q('well-sleep', 'Follow a fairly regular sleep schedule that left you reasonably rested?', days),
      q('well-food', 'Include vegetables, fruit, whole grains, or beans in your meals?', days, 'Consider your dietary needs and what food is accessible to you.'),
      q('well-water', 'Drink fluids regularly according to your needs and any clinician-set limits?', days, 'This quiz does not set a fixed number of glasses. Follow prescribed fluid restrictions.'),
      q('well-move', 'Do comfortable movement or physical activity suited to your abilities?', days, 'Follow your clinician’s restrictions; this is not an exercise-clearance question.'),
      q('well-stress', 'Feel that your stress level was manageable?', days, 'Stress and coping are personal. Persistent distress deserves support regardless of this quiz score.'),
    ],
    resources: [questionnaireResources.sleep, questionnaireResources.nutrition, questionnaireResources.water, questionnaireResources.activity, questionnaireResources.relaxation, questionnaireResources.meditation],
  },
  {
    id: 'phq9', category: 'Mental health & stress', title: 'Depression symptoms: PHQ-9',
    description: 'A standardized nine-question depressive-symptom screener, with support guidance.',
    timeframe: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    badge: 'Standardized symptom screener',
    scope: 'This score describes reported symptoms; it does not diagnose depression, burnout, or suicide risk. A clinician must assess context, functioning, and safety. Support is available regardless of score.',
    scoringExplanation: 'Add the nine responses, each 0–3, for a total of 0–27. 0–4: Minimal; 5–9: Mild; 10–14: Moderate; 15–19: Moderately severe; 20–27: Severe reported depressive symptoms. The optional functioning response is not added. Any nonzero response to question 9 prompts support guidance regardless of the total.',
    attribution,
    functionalQuestion: 'If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?',
    questions: [
      q('phq-1', 'Little interest or pleasure in doing things', frequency),
      q('phq-2', 'Feeling down, depressed, or hopeless', frequency),
      q('phq-3', 'Trouble falling or staying asleep, or sleeping too much', frequency),
      q('phq-4', 'Feeling tired or having little energy', frequency),
      q('phq-5', 'Poor appetite or overeating', frequency),
      q('phq-6', 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down', frequency),
      q('phq-7', 'Trouble concentrating on things, such as reading the newspaper or watching television', frequency),
      q('phq-8', 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual', frequency),
      q('phq-9', 'Thoughts that you would be better off dead or of hurting yourself in some way', frequency),
    ],
    resources: [questionnaireResources.phq, questionnaireResources.scoring, questionnaireResources.depression, questionnaireResources.doctor, questionnaireResources.crisis],
  },
  {
    id: 'gad7', category: 'Mental health & stress', title: 'Anxiety symptoms: GAD-7',
    description: 'A standardized seven-question anxiety-symptom screener—not a burnout test.',
    timeframe: 'Over the last two weeks, how often have you been bothered by the following problems?',
    badge: 'Standardized symptom screener',
    scope: 'This screen does not diagnose an anxiety disorder or measure burnout. Symptoms, history, circumstances, and daily functioning need professional assessment. A lower score does not rule out a need for help.',
    scoringExplanation: 'Add seven responses, each 0–3, for a total of 0–21. 0–4: Minimal; 5–9: Mild; 10–14: Moderate; 15–21: Severe reported anxiety symptoms. Scores of 10 or more are a reason to seek further evaluation, not a diagnosis.',
    attribution,
    questions: [
      q('gad-1', 'Feeling nervous, anxious, or on edge', frequency),
      q('gad-2', 'Not being able to stop or control worrying', frequency),
      q('gad-3', 'Worrying too much about different things', frequency),
      q('gad-4', 'Trouble relaxing', frequency),
      q('gad-5', "Being so restless that it's hard to sit still", frequency),
      q('gad-6', 'Becoming easily annoyed or irritable', frequency),
      q('gad-7', 'Feeling afraid as if something awful might happen', frequency),
    ],
    resources: [questionnaireResources.gad, questionnaireResources.scoring, questionnaireResources.anxiety, questionnaireResources.relaxation, questionnaireResources.meditation, questionnaireResources.doctor],
  },
  {
    id: 'exercise', category: 'Physical activity readiness', title: 'Exercise readiness & official PAR-Q+',
    description: 'An original readiness reflection, plus links to the official pre-participation pathway.',
    timeframe: 'Consider your current health, abilities, guidance, and plans before changing physical activity.',
    badge: 'Custom reflection + official PAR-Q+ links',
    scope: 'This original check is not PAR-Q or PAR-Q+, is not validated, and cannot determine whether exercise or a weight-loss program is safe. Official PAR-Q+ cannot be incorporated into an electronic survey without written permission; use its official website instead.',
    scoringExplanation: 'Each Yes or Not sure identifies one review area; No identifies zero. The total is 0–5 review areas, not a medical risk score. Zero does not provide clearance. Current urgent symptoms override routine advice.',
    questions: [
      q('ex-now', 'Right now, are you having new or severe chest pain, severe trouble breathing, or fainting?', reviewChoices, 'Do not wait to finish a quiz if you need urgent medical help.'),
      q('ex-guidance', 'Do you need medical guidance about a condition, medicine, pregnancy, or recent recovery before changing activity?', reviewChoices),
      q('ex-limits', 'Are any current clinician-set limits on your physical activity unclear to you?', reviewChoices),
      q('ex-illness', 'Are you unwell or recovering in a way that may change what activity is appropriate today?', reviewChoices),
      q('ex-plan', 'Would you like help choosing movement that fits your abilities, pain, balance, or planned exercise intensity?', reviewChoices),
    ],
    resources: [questionnaireResources.parq, questionnaireResources.parqOnline, questionnaireResources.activity, questionnaireResources.doctor],
  },
  {
    id: 'lifestyle', category: 'Lifestyle & prevention', title: 'Lifestyle & prevention review',
    description: 'Identify discussion areas around family history, tobacco, routine checks, sleep, ergonomics, and movement.',
    timeframe: 'Think about your current routines and what you know about your personal and family health history.',
    badge: 'Custom prevention reflection',
    scope: 'An original, unvalidated review—not a cardiovascular, sleep-disorder, or injury risk calculator. It cannot predict disease probability. Unknown information is a reason to ask questions, not evidence that you have a condition.',
    scoringExplanation: 'Each Yes or Not sure adds one review area; No adds zero. Total 0–6: 0 = No review areas reported; 1–2 = Choose a discussion area; 3–6 = Several areas to review. These are organizational categories, not Low/Moderate/High clinical-risk tiers.',
    questions: [
      q('life-family', 'Do you have a parent, sibling, or child with heart disease or stroke?', reviewChoices),
      q('life-tobacco', 'Do you currently smoke, vape, or use tobacco?', reviewChoices),
      q('life-checks', 'Have you been told your blood pressure, cholesterol, or blood sugar needs attention—or are you unsure whether checks are due?', reviewChoices),
      q('life-sleep', 'Do loud snoring, waking up gasping, or persistent daytime sleepiness affect you?', reviewChoices),
      q('life-desk', 'Do prolonged sitting or your workspace often leave you stiff or uncomfortable?', reviewChoices),
      q('life-move', 'Do you usually go most of the day without comfortable movement or breaks from sitting?', reviewChoices, 'Consider your abilities and any clinician-set restrictions, rather than comparing yourself with others.'),
    ],
    resources: [questionnaireResources.heart, questionnaireResources.family, questionnaireResources.prevention, questionnaireResources.apnea, questionnaireResources.ergonomics, questionnaireResources.tobacco, questionnaireResources.activity],
  },
];
