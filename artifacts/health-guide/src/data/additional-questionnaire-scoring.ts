import { questionnaireResources as r, type QuestionnaireDefinition } from './questionnaires';
import { additionalQuestionnaireSources as s } from './additional-questionnaires';
import type { Answers, QuestionnaireAction, QuestionnaireResult } from './questionnaire-scoring';

/** Inputs have already been validated by scoreQuestionnaire. */
export function scoreAdditionalQuestionnaire(
  def: QuestionnaireDefinition, answers: Answers, total: number,
): Omit<QuestionnaireResult, 'resources' | 'scoreMeaning' | 'selfHarm' | 'urgentMedical'> | undefined {
  if (def.id === 'phq4') {
    const anxiety = answers['phq4-1'] + answers['phq4-2'];
    const depression = answers['phq4-3'] + answers['phq4-4'];
    const band = total < 3 ? 'None/minimal' : total < 6 ? 'Mild' : total < 9 ? 'Moderate' : 'Severe';
    const actions: QuestionnaireAction[] = [
      {
        title: anxiety >= 3 || depression >= 3 ? 'Arrange a fuller assessment' : 'Seek support if symptoms concern you',
        body: `Anxiety subtotal: ${anxiety}/6. Depression subtotal: ${depression}/6. A subtotal of 3 or more is a prompt for further evaluation, such as GAD-7 or PHQ-9 and a clinical interview. This is not a diagnosis; lower scores do not rule out a need for care.`,
        resources: [r.doctor, r.anxiety, r.depression],
      },
      { title: 'Safety is not measured by this score', body: 'PHQ-4 has no self-harm item and cannot establish that you are safe. If you need urgent emotional support, call or text 988 in the U.S.; for immediate danger, call 911.', resources: [r.crisis, r.relaxation] },
    ];
    return { score: total, maxScore: 12, label: `${band} reported psychological distress`,
      summary: 'This brief screen combines anxiety and depression symptoms over two weeks. The total describes distress, not a diagnosis or suicide-risk determination.',
      subscores: [{ label: 'Anxiety (GAD-2)', score: anxiety, maxScore: 6 }, { label: 'Depression (PHQ-2)', score: depression, maxScore: 6 }], actions };
  }
  if (def.id === 'auditc') {
    return { score: total, maxScore: 12,
      label: total >= 4 ? 'Further alcohol assessment recommended' : total >= 3 ? 'Follow-up may be appropriate' : 'Below cited screening thresholds',
      summary: `Your AUDIT-C total is ${total}/12. The cited NIH/NIDA record uses ≥3 for women and ≥4 for men; ${total >= 4 ? 'your total reaches both listed thresholds' : total === 3 ? 'your total reaches the lower of those two thresholds' : 'your total is below both listed thresholds'}. Thresholds and versions vary across settings. This is not a diagnosis or a guarantee that alcohol use is safe.`,
      actions: [
        { title: total >= 3 ? 'Discuss drinking and its effects with a clinician' : 'Consider your circumstances, not only the total', body: 'Tell a clinician about alcohol amounts, timing, medicines, health conditions, and any effects on safety or daily life. Treatment can help when drinking causes problems. Any concern is a reason to seek help, regardless of score.', resources: [s.alcoholHelp, r.doctor] },
        { title: 'Check drink sizes and situations where alcohol is unsafe', body: 'A large or strong serving may contain several standard drinks. Do not drink when pregnant, driving, or taking a medicine that interacts with alcohol. Ask a clinician about your individual circumstances; this score does not set a safe drinking limit.', resources: [s.alcohol] },
        { title: 'Do not manage possible withdrawal alone', body: 'If you may be physically dependent on alcohol, seek medical guidance before suddenly stopping or reducing. Withdrawal can be dangerous. Seizures, confusion, hallucinations, or severe illness need emergency care; in the U.S., call 911.', resources: [s.alcoholHelp, r.doctor] },
      ] };
  }
  if (def.id === 'pcl5') {
    return { score: total, maxScore: 80,
      label: total >= 31 ? 'Professional trauma assessment recommended' : 'Reported trauma-related symptom total',
      summary: `Your PCL-5 symptom total is ${total}/80. ${total >= 31 ? 'It reaches the lower end of the commonly used 31–33 range for further assessment.' : 'It is below the commonly used 31–33 assessment range, but PTSD and a need for support are not ruled out.'} This is not a PTSD diagnosis, a provisional DSM-5 diagnosis, or a mild/moderate/severe tier. A qualified professional must interpret it in context.`,
      actions: [
        { title: 'Review symptoms with a qualified professional', body: 'A clinician can assess whether an experience meets trauma criteria, symptom duration, daily functioning, and other possible causes. Seek help for distressing or persistent symptoms at any score. Do not use this checklist to label yourself or someone else with PTSD.', resources: [s.ptsd, r.doctor] },
        { title: 'Pause if reflecting feels overwhelming', body: 'You can stop the checklist, notice your surroundings, or reach out to someone supportive. You do not need to recount the event here. In the U.S., call or text 988 for urgent emotional support; call 911 if you cannot stay safe or are in immediate danger.', resources: [r.crisis, r.relaxation] },
      ] };
  }
  if (def.id === 'phq15') {
    const band = total < 5 ? 'Minimal' : total < 10 ? 'Low' : total < 15 ? 'Medium' : 'High';
    const pain = ['phq15-1', 'phq15-2', 'phq15-3', 'phq15-5'].some(id => answers[id] > 0);
    const sleepFatigue = answers['phq15-14'] > 0 || answers['phq15-15'] > 0;
    const actions: QuestionnaireAction[] = [
      { title: total >= 10 ? 'Arrange an assessment of your physical symptoms' : 'Follow up on symptoms that concern you', body: 'Share which symptoms bother you, how long they last, their severity, and their effect on daily life. Physical symptoms deserve assessment; this total cannot establish a cause or distinguish medical conditions from mental-health factors. Seek care for concerning symptoms even with a low score.', resources: [r.doctor, s.physical] },
      { title: 'Do not wait for a questionnaire in an emergency', body: 'New or severe chest pain, severe breathing trouble, or fainting need urgent medical help. In an emergency, call 911. This four-week symptom total cannot triage what is happening right now.', resources: [r.doctor] },
    ];
    if (pain) actions.push({ title: 'Discuss pain and its effects on daily activities', body: 'Ask about assessment and appropriate pain-management options. The all-tools list includes authorized ODI and NDI access links for back and neck disability; no score here provides activity clearance or identifies a cause of pain.', resources: [r.doctor, r.ergonomics] });
    if (sleepFatigue) actions.push({ title: 'Review sleep and persistent fatigue', body: 'Try a consistent sleep routine if practical, and ask a clinician about persistent fatigue, sleep problems, snoring, or waking unrefreshed. Sleep concerns have several possible causes; this score does not diagnose insomnia or sleep apnea.', resources: [r.sleep, r.apnea, r.doctor] });
    return { score: total, maxScore: 30, label: `${band} reported physical symptom burden`,
      summary: 'This score describes how much physical symptoms have bothered you over four weeks. It does not diagnose a somatic symptom disorder, indicate that symptoms are imaginary, or rule out serious illness.', actions };
  }
  return undefined;
}
