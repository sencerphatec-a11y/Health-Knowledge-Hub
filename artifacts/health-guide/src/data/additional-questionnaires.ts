import type { QuestionnaireChoice, QuestionnaireDefinition, QuestionnaireResource } from './questionnaires';

export const additionalQuestionnaireSources = {
  phq4: { label: 'McGill University: PHQ-4 questions and scoring', href: 'https://www.mcgill.ca/schoolofmedicine-learneraffairs/pgme/wellness-support/self-screening-tools/anxiety-and-depression-phq-4' },
  phq15: { label: 'University at Buffalo: original PHQ-15 form (PDF)', href: 'https://ubwp.buffalo.edu/rdc-tmdinternational/wp-content/uploads/sites/58/2017/01/PHQ-15_2013-05-12.pdf' },
  phq15Scoring: { label: 'PHQ-15 scoring instructions (Cigna PDF)', href: 'https://static.cigna.com/assets/chcp/pdf/resourceLibrary/behavioral/phq15Scoring.pdf' },
  phqManual: { label: 'PHQ/GAD manual: scoring and reproduction permissions (PDF)', href: 'https://manual.jointcommission.org/pub/BHCInstruments/RomInstr00054/instructions_PHQ.pdf' },
  auditc: { label: 'NIH/NIDA: original AUDIT-C and interpretation', href: 'https://cde.nlm.nih.gov/formView?tinyId=myWNfJaZwe' },
  alcohol: { label: 'NIAAA: understand standard drinks', href: 'https://www.niaaa.nih.gov/alcohols-effects-health/overview-alcohol-consumption/what-standard-drink' },
  alcoholHelp: { label: 'NIAAA: alcohol treatment navigator', href: 'https://alcoholtreatment.niaaa.nih.gov/' },
  pcl5: { label: 'VA National Center for PTSD: PCL-5 use and scoring', href: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp' },
  pcl5Form: { label: 'VA: original PCL-5 standard form (PDF)', href: 'https://www.ptsd.va.gov/PTSD/professional/assessment/documents/PCL5_Standard_form.pdf' },
  ptsd: { label: 'VA: PTSD information and getting help', href: 'https://www.ptsd.va.gov/understand/index.asp' },
  physical: { label: 'MedlinePlus: symptoms and health information', href: 'https://medlineplus.gov/' },
} satisfies Record<string, QuestionnaireResource>;

const scoredChoices = (labels: string[]): QuestionnaireChoice[] =>
  labels.map((label, value) => ({ label, value, points: value }));

/** A factory avoids a runtime import cycle with the existing definitions and resources. */
export function additionalQuestionnaires(
  r: Record<string, QuestionnaireResource>,
  frequency: QuestionnaireChoice[],
  attribution: string,
): QuestionnaireDefinition[] {
  const s = additionalQuestionnaireSources;
  const bothered = scoredChoices(['Not bothered at all', 'Bothered a little', 'Bothered a lot']);
  const trauma = scoredChoices(['Not at all', 'A little bit', 'Moderately', 'Quite a bit', 'Extremely']);
  return [
    {
      id: 'phq4', category: 'Mental health & behavioral screeners', title: 'Quick anxiety & depression check: PHQ-4',
      description: 'Four questions combining the GAD-2 and PHQ-2, with separate anxiety and depression subtotals.',
      badge: 'Standardized symptom screener',
      timeframe: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
      scope: 'An ultra-brief distress screen, not a diagnosis or a suicide-risk assessment. It has no self-harm question; a low score does not establish safety.',
      scoringExplanation: 'Add four responses (0–3 each): total 0–12. 0–2: None/minimal; 3–5: Mild; 6–8: Moderate; 9–12: Severe reported psychological distress. Anxiety (items 1–2) and depression (items 3–4) each total 0–6; either subtotal ≥3 warrants further evaluation. The PHQ/GAD manual permits reproduction.',
      attribution,
      questions: [
        { id: 'phq4-1', prompt: 'Feeling nervous, anxious or on edge', choices: frequency },
        { id: 'phq4-2', prompt: 'Not being able to stop or control worrying', choices: frequency },
        { id: 'phq4-3', prompt: 'Little interest or pleasure in doing things', choices: frequency },
        { id: 'phq4-4', prompt: 'Feeling down, depressed, or hopeless', choices: frequency },
      ],
      resources: [s.phq4, s.phqManual, r.anxiety, r.depression, r.doctor, r.crisis],
    },
    {
      id: 'auditc', category: 'Mental health & behavioral screeners', title: 'Alcohol use check: AUDIT-C',
      description: 'The three-question Alcohol Use Disorders Identification Test–Concise, with an alcohol-use score.',
      badge: 'Standardized alcohol screener',
      timeframe: 'Think about your alcohol use over the past year.',
      scope: 'This is the original six-or-more-drinks version in the NIH/NIDA record, not a tailored VA version. Screening thresholds differ by population and setting; this tool does not diagnose an alcohol use disorder or determine safe drinking.',
      scoringExplanation: 'Each of three answers is scored 0–4; sum 0–12. The cited NIH/NIDA record lists positive-screen thresholds ≥3 for women and ≥4 for men. This site shows both rather than requesting sex or assigning a universal risk tier. A score of 3 prompts discussion; ≥4 reaches both listed thresholds. Other settings may use different versions/cutoffs. If question 1 is Never, questions 2–3 are skipped and scored 0.',
      attribution: 'AUDIT-C is a three-item version of the WHO AUDIT. The NIH/NIDA Common Data Elements record identifies AUDIT-C as available in the public domain. Health Guide’s recommendations are not part of the instrument.',
      questions: [
        { id: 'auditc-1', prompt: 'How often do you have a drink containing alcohol?', choices: scoredChoices(['Never', 'Monthly or less', '2 to 4 times a month', '2 to 3 times a week', '4 or more times a week']) },
        { id: 'auditc-2', prompt: 'How many standard drinks containing alcohol do you have on a typical day?', choices: scoredChoices(['1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more']), note: 'In the U.S., one standard drink contains about 14 grams of pure alcohol: roughly 12 oz of 5% beer, 5 oz of 12% wine, or 1.5 oz of 40% spirits. Larger or stronger servings can be more than one drink.' },
        { id: 'auditc-3', prompt: 'How often do you have six or more drinks on one occasion?', choices: scoredChoices(['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily']) },
      ],
      resources: [s.auditc, s.alcohol, s.alcoholHelp, r.doctor],
    },
    {
      id: 'pcl5', category: 'Mental health & behavioral screeners', title: 'Trauma-related symptoms: PCL-5',
      description: 'The 20-item PTSD Checklist for DSM-5, with a symptom total to discuss with a qualified professional.',
      badge: 'Standardized symptom checklist',
      timeframe: 'In the past month, how much were you bothered by the following problems?',
      scope: 'Content note: these questions concern traumatic experiences and may be distressing. Keep your worst stressful experience in mind privately; you do not need to type or describe it. You can stop at any time. The VA intends PCL-5 interpretation for qualified professionals. This site does not assess trauma exposure (DSM-5 Criterion A), diagnose PTSD, or provide a provisional DSM-5 diagnosis.',
      scoringExplanation: 'Add 20 responses (0–4 each): total 0–80. The VA describes 31–33 as a commonly used range for further assessment, varying by population and purpose. This site uses ≥31 only as a prompt to discuss symptoms, not a diagnosis or validated severity tier. Below 31 does not rule out PTSD or a need for care. A clinician must assess exposure, duration, functioning, and alternative causes.',
      attribution: 'PCL-5: Weathers, Litz, Keane, Palmieri, Marx, and Schnurr (2013); standard form dated August 2023. The VA National Center for PTSD states that PCL-5 is in the public domain. Original symptom questions and response scores are retained; no event narrative is collected.',
      questions: [
        'Repeated, disturbing, and unwanted memories of the stressful experience?',
        'Repeated, disturbing dreams of the stressful experience?',
        'Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?',
        'Feeling very upset when something reminded you of the stressful experience?',
        'Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?',
        'Avoiding memories, thoughts, or feelings related to the stressful experience?',
        'Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?',
        'Trouble remembering important parts of the stressful experience?',
        'Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?',
        'Blaming yourself or someone else for the stressful experience or what happened after it?',
        'Having strong negative feelings such as fear, horror, anger, guilt, or shame?',
        'Loss of interest in activities that you used to enjoy?',
        'Feeling distant or cut off from other people?',
        'Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?',
        'Irritable behavior, angry outbursts, or acting aggressively?',
        'Taking too many risks or doing things that could cause you harm?',
        'Being “superalert” or watchful or on guard?',
        'Feeling jumpy or easily startled?',
        'Having difficulty concentrating?',
        'Trouble falling or staying asleep?',
      ].map((prompt, i) => ({ id: `pcl5-${i + 1}`, prompt, choices: trauma })),
      resources: [s.pcl5, s.pcl5Form, s.ptsd, r.doctor, r.crisis],
    },
    {
      id: 'phq15', category: 'General health & physical symptoms', title: 'Physical symptom burden: PHQ-15',
      description: 'Fifteen questions about how much physical symptoms have bothered you—not a test of whether symptoms are “all in your head.”',
      badge: 'Standardized symptom questionnaire',
      timeframe: 'During the last 4 weeks, how much have you been bothered by any of the following problems?',
      scope: 'This measures reported physical symptom burden, not a diagnosis or the cause of symptoms. Low scores do not rule out serious illness. New or severe chest pain, severe breathing trouble, or fainting need urgent help now, not a questionnaire result.',
      scoringExplanation: 'Add 15 responses (0–2 each): total 0–30. 0–4: Minimal; 5–9: Low; 10–14: Medium; 15–30: High physical symptom burden. Non-applicable period/sexual-intercourse symptoms contribute 0 (“Not bothered at all”); the total is not prorated. A clinician must assess physical causes and functioning, regardless of score.',
      attribution,
      questions: [
        'Stomach pain',
        'Back pain',
        'Pain in your arms, legs, or joints (knees, hips, etc.)',
        'Menstrual cramps or other problems with your periods',
        'Headaches',
        'Chest pain',
        'Dizziness',
        'Fainting spells',
        'Feeling your heart pound or race',
        'Shortness of breath',
        'Pain or problems during sexual intercourse',
        'Constipation, loose bowels, or diarrhea',
        'Nausea, gas, or indigestion',
        'Feeling tired or having low energy',
        'Trouble sleeping',
      ].map((prompt, i) => ({
        id: `phq15-${i + 1}`, prompt, choices: bothered,
        ...([3, 10].includes(i) ? { note: 'If this symptom does not apply to you, select “Not bothered at all” (0).' } : {}),
        ...([5, 7, 9].includes(i) ? { note: 'If this symptom is new or severe right now, seek urgent medical help. In an emergency, call 911; do not wait for this score.' } : {}),
      })),
      resources: [s.phq15, s.phq15Scoring, s.phqManual, s.physical, r.doctor],
    },
  ];
}

export const licensedQuestionnaireResources = [
  {
    id: 'isi', title: 'Insomnia Severity Index (ISI)', category: 'Sleep & insomnia',
    description: 'A seven-item assessment of trouble falling or staying asleep, satisfaction with sleep, distress, and daytime impact. Ask a clinician whether it is appropriate for you.',
    href: 'https://eprovide.mapi-trust.org/instruments/insomnia-severity-index',
  },
  {
    id: 'odi', title: 'Oswestry Disability Index (ODI)', category: 'Back pain & mobility',
    description: 'A back-pain disability questionnaire covering pain and its effects on daily activities. A clinician or physical therapist can use an authorized version to guide assessment.',
    href: 'https://eprovide.mapi-trust.org/instruments/oswestry-disability-index',
  },
  {
    id: 'ndi', title: 'Neck Disability Index (NDI)', category: 'Neck pain & mobility',
    description: 'A neck-pain disability questionnaire covering symptoms and their effects on daily activities. Discuss an authorized assessment with a clinician or physical therapist.',
    href: 'https://eprovide.mapi-trust.org/instruments/neck-disability-index',
  },
];
