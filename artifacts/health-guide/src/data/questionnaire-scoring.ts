import {
  questionnaireResources as r,
  type QuestionnaireDefinition, type QuestionnaireId, type QuestionnaireResource,
} from './questionnaires';
import { scoreAdditionalQuestionnaire } from './additional-questionnaire-scoring';

export type Answers = Record<string, number>;
export interface QuestionnaireAction { title: string; body: string; resources: QuestionnaireResource[] }
export interface QuestionnaireResult {
  score: number;
  maxScore: number;
  label: string;
  summary: string;
  scoreMeaning: string;
  actions: QuestionnaireAction[];
  resources: QuestionnaireResource[];
  selfHarm: boolean;
  urgentMedical: boolean;
  subscores?: { label: string; score: number; maxScore: number }[];
}

export function missingQuestions(def: QuestionnaireDefinition, answers: Answers): string[] {
  if (def.id === 'auditc' && answers['auditc-1'] === 0) return [];
  return def.questions.filter(q => !q.choices.some(c => c.value === answers[q.id])).map(q => q.id);
}

/** Alerting is independent of completion and score; this is not a suicide-risk assessment. */
export function urgentFlags(id: QuestionnaireId, answers: Answers) {
  return {
    selfHarm: id === 'phq9' && [1, 2, 3].includes(answers['phq-9']),
    urgentMedical: id === 'exercise' && answers['ex-now'] === 1,
  };
}

const advice: Record<string, QuestionnaireAction> = {
  'well-sleep': { title: 'Support your sleep routine', body: 'Try a fairly consistent bedtime and wake time and a wind-down routine. Most adults need at least 7 hours; needs vary with age and health. Persistent poor sleep or fatigue deserves a clinician’s attention.', resources: [r.sleep] },
  'well-food': { title: 'Choose an accessible meal improvement', body: 'When possible, add a vegetable, fruit, beans, or whole-grain option to a meal. Follow any prescribed diet or allergy restrictions. If getting enough food is difficult, explore meal programs and food pantries rather than treating this as a personal failure.', resources: [r.nutrition, r.food] },
  'well-water': { title: 'Plan fluids around your needs', body: 'Keep an appropriate drink accessible and consider replacing a sugary drink with water when suitable. There is no universal glass target here. If you have a prescribed fluid limit, follow it and ask your care team about your needs.', resources: [r.water] },
  'well-move': { title: 'Find an achievable movement option', body: 'If activity is appropriate for you, consider a short, comfortable walk, wheeling, chair-based movement, or another enjoyable option adapted to your abilities. Increase gradually, not to a fixed step target, and follow your clinician’s restrictions.', resources: [r.activity] },
  'well-stress': { title: 'Make room for a restorative pause', body: 'Try a short break, time with someone supportive, or a guided relaxation exercise if it feels helpful. Stop a practice if it increases distress. Persistent stress, exhaustion, or difficulty functioning is a reason to seek professional support; meditation is not a substitute for care.', resources: [r.relaxation, r.meditation, r.doctor] },
  'ex-now': { title: 'Clarify symptoms before changing activity', body: 'Do not use this quiz to decide that symptoms are harmless. If you are unsure about a current symptom, seek prompt medical advice before new activity; severe symptoms or immediate danger require emergency help.', resources: [r.doctor] },
  'ex-guidance': { title: 'Discuss suitable activity with your care team', body: 'Ask about appropriate activity types and intensity for your health, medicines, pregnancy, or recovery. Do not change medicines, prescribed limits, or treatment based on this quiz.', resources: [r.doctor, r.activity] },
  'ex-limits': { title: 'Clarify your existing activity instructions', body: 'Contact the clinician who set your activity limits and ask what you can do now and when to review the plan. A quiz score does not override those instructions.', resources: [r.doctor] },
  'ex-illness': { title: 'Adapt your plans while unwell or recovering', body: 'Consider postponing a new or more demanding program until you understand what is appropriate during your illness or recovery. Ask your clinician about persistent or concerning symptoms.', resources: [r.doctor] },
  'ex-plan': { title: 'Choose a plan suited to your abilities', body: 'A qualified exercise professional or clinician can help adapt movement to your goals, comfort, balance, and limitations. Use the official PAR-Q+ pathway for formal pre-participation screening; this reflection is not a replacement.', resources: [r.parqOnline, r.activity, r.doctor] },
  'life-family': { title: 'Share what you know about family history', body: 'If known, note which relative had heart disease or a stroke and their age when it happened. Bring this to preventive-care conversations. If you do not know your history, tell your clinician; unknown history does not mean you have a disease.', resources: [r.family, r.doctor] },
  'life-tobacco': { title: 'Explore tobacco or vaping support', body: 'If you use tobacco or vape and want to stop, consider a supported quit plan. Ask a clinician about suitable options and use free Smokefree.gov resources. An uncertain answer is a prompt to clarify exposure, not a diagnosis.', resources: [r.tobacco, r.doctor] },
  'life-checks': { title: 'Ask which preventive checks are appropriate', body: 'Review any existing results and ask a clinician which blood-pressure, cholesterol, or blood-sugar checks are appropriate for your age and history. Do not assume an abnormal result or change treatment because of this score.', resources: [r.prevention, r.doctor] },
  'life-sleep': { title: 'Discuss persistent sleep symptoms', body: 'Share loud snoring, gasping during sleep, or persistent daytime sleepiness with a healthcare professional. Several causes are possible, and a sleep disorder needs evaluation rather than diagnosis from this questionnaire.', resources: [r.apnea, r.sleep, r.doctor] },
  'life-desk': { title: 'Review comfort and workstation setup', body: 'Try comfortable screen and keyboard positions, supportive seating, and changes of position that suit your abilities. There is no single correct posture for everyone. Persistent pain, weakness, or numbness deserves professional assessment.', resources: [r.ergonomics, r.doctor] },
  'life-move': { title: 'Consider manageable movement breaks', body: 'If appropriate for your health, vary your position or add small amounts of movement during the day. Follow activity limits and choose accessible options; if you are unsure about starting, speak with your clinician.', resources: [r.activity, r.doctor] },
};

export function scoreQuestionnaire(def: QuestionnaireDefinition, answers: Answers, functioning?: number): QuestionnaireResult {
  if (missingQuestions(def, answers).length) throw new Error('Answer every required question with a valid option before viewing results.');
  if (functioning !== undefined && (!Number.isInteger(functioning) || functioning < 0 || functioning > 3)) {
    throw new Error('Choose a valid functioning response or leave the optional question unanswered.');
  }
  const points = def.questions.map((q, i) => def.id === 'auditc' && answers['auditc-1'] === 0 && i > 0 ? 0 : q.choices.find(c => c.value === answers[q.id])!.points);
  const total = points.reduce((sum, value) => sum + value, 0);
  const flags = urgentFlags(def.id, answers);
  const common = { resources: def.resources, scoreMeaning: def.scoringExplanation, ...flags };
  const additional = scoreAdditionalQuestionnaire(def, answers, total);
  if (additional) return { ...common, ...additional };

  if (def.id === 'wellbeing') {
    const score = total * 5;
    const actions = def.questions.filter((_, i) => points[i] <= 2).map(q => advice[q.id]);
    if (!actions.length) actions.push({ title: 'Keep the habits that work for you', body: 'Choose routines you can sustain and adapt them when your circumstances or medical needs change. This score does not certify good health or replace preventive care.', resources: [r.sleep, r.activity, r.nutrition] });
    return { ...common, score, maxScore: 100, label: score < 40 ? 'Many habits to support' : score < 75 ? 'Some habits to support' : 'Consistent habits', summary: 'This is a snapshot of the consistency you reported, not a health grade, a disease-risk estimate, or a judgment of your circumstances.', actions };
  }

  if (def.id === 'phq9' || def.id === 'gad7') {
    const phq = def.id === 'phq9';
    const band = total < 5 ? 'Minimal' : total < 10 ? 'Mild' : total < 15 ? 'Moderate' : phq && total < 20 ? 'Moderately severe' : 'Severe';
    const actions: QuestionnaireAction[] = [];
    if (flags.selfHarm) actions.push({
      title: 'Reach out for support now, regardless of your total',
      body: 'Your response about thoughts of death or self-harm deserves prompt support. In the U.S., call or text 988. If you are in immediate danger or cannot stay safe, call 911 or go to an emergency department. Consider reaching out to a trusted person and contacting a healthcare professional promptly. This tool cannot assess suicide risk.',
      resources: [r.crisis, r.doctor],
    });
    actions.push(total >= 10
      ? { title: total >= 15 ? 'Prioritize a professional assessment' : 'Arrange a professional assessment', body: 'Your reported symptoms are a reason to contact a primary-care or mental-health professional. Share the answers, how long symptoms have lasted, and how they affect daily life. A clinician can assess causes and discuss appropriate support; the score alone does not determine a diagnosis or treatment.', resources: [r.doctor, phq ? r.depression : r.anxiety] }
      : { title: 'Notice symptoms and seek help when needed', body: 'A lower score does not rule out a condition or a need for help. If symptoms persist, worsen, concern you, or interfere with daily life, contact a healthcare professional. Support is appropriate at any score.', resources: [r.doctor, phq ? r.depression : r.anxiety] });
    if (phq && functioning !== undefined && functioning >= 2) actions.push({ title: 'Discuss the impact on daily life', body: 'You reported that daily tasks are very or extremely difficult. Prioritize discussing this with a healthcare professional even if your total score is lower. The functioning response is useful context but does not change the PHQ-9 total.', resources: [r.doctor] });
    actions.push({ title: 'Use supportive practices alongside care', body: 'If helpful, try a manageable sleep routine, connection with a trusted person, or a guided relaxation exercise. Stop if a practice increases distress. These are supportive options—not replacements for professional care or crisis support.', resources: [r.sleep, r.relaxation, r.meditation] });
    return { ...common, score: total, maxScore: phq ? 27 : 21, label: `${band} reported ${phq ? 'depressive' : 'anxiety'} symptoms`, summary: flags.selfHarm ? 'Support is recommended now because of your self-harm response, regardless of this symptom-severity band. A clinical interview is needed to assess safety.' : 'This is a symptom-severity band, not a diagnosis or a safety determination. A clinician needs to consider your history, circumstances, and daily functioning.', actions };
  }

  const actions = def.questions.filter((_, i) => points[i] > 0).map(q => advice[q.id]);
  if (def.id === 'exercise') {
    if (flags.urgentMedical) return {
      ...common, resources: [], score: total, maxScore: 5, label: 'Urgent symptoms reported',
      summary: 'Stop this questionnaire and seek urgent medical help now. In the U.S., call 911 for new or severe chest pain, severe trouble breathing, or fainting. Do not start exercise or wait for a quiz result.',
      actions: [{ title: 'Get urgent medical help now', body: 'This tool cannot determine the cause or severity of your current symptoms. Do not exercise while waiting for help; follow emergency-service instructions.', resources: [] }],
    };
    if (!actions.length) actions.push({ title: 'Use the official readiness pathway', body: 'No review areas were reported in this short reflection, but it does not establish that activity or a weight-loss program is safe. Use the official PAR-Q+ pathway. If movement is appropriate for you, start gradually and follow any existing professional guidance.', resources: [r.parqOnline, r.activity] });
    return { ...common, score: total, maxScore: 5, label: total === 0 ? 'No review areas reported' : 'Review before changing activity', summary: 'This counts reported questions or uncertainties to review—not exercise safety. Follow clinician-set restrictions and use the official PAR-Q+ pathway for formal screening.', actions };
  }
  if (!actions.length) actions.push({ title: 'Continue appropriate prevention conversations', body: 'No review areas were reported in this limited quiz. It cannot rule out medical conditions or guarantee low risk. Continue preventive care suited to your age and history and seek advice for new symptoms.', resources: [r.heart, r.doctor] });
  return { ...common, score: total, maxScore: 6, label: total === 0 ? 'No review areas reported' : total < 3 ? 'Choose a discussion area' : 'Several areas to review', summary: 'This counts topics for follow-up, including information you are unsure about. It is not a disease-risk category or a prediction of cardiovascular disease, sleep apnea, or injury.', actions };
}
