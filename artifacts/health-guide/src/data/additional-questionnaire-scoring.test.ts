import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { questionnaireDefinitions, type QuestionnaireId } from './questionnaires';
import { additionalQuestionnaireSources, licensedQuestionnaireResources } from './additional-questionnaires';
import { missingQuestions, scoreQuestionnaire, type Answers } from './questionnaire-scoring';

const definition = (id: QuestionnaireId) => questionnaireDefinitions.find(d => d.id === id)!;
const withTotal = (id: QuestionnaireId, total: number): Answers => {
  const answers: Answers = {};
  for (const q of definition(id).questions) {
    const max = Math.max(...q.choices.map(c => c.points));
    answers[q.id] = Math.min(total, max);
    total -= answers[q.id];
  }
  assert.equal(total, 0);
  return answers;
};

test('PHQ-4 scores all totals, correct distress tiers and independent subtotals', () => {
  const d = definition('phq4');
  assert.equal(d.questions.length, 4);
  for (let total = 0; total <= 12; total++) {
    const result = scoreQuestionnaire(d, withTotal('phq4', total));
    assert.equal(result.score, total);
    assert.equal(result.maxScore, 12);
    assert.equal(result.label, `${total < 3 ? 'None/minimal' : total < 6 ? 'Mild' : total < 9 ? 'Moderate' : 'Severe'} reported psychological distress`);
    assert.equal(result.subscores!.reduce((sum, s) => sum + s.score, 0), total);
    assert.match(result.summary, /not a diagnosis/);
    assert.equal(result.selfHarm, false);
  }
  const result = scoreQuestionnaire(d, { 'phq4-1': 0, 'phq4-2': 0, 'phq4-3': 3, 'phq4-4': 0 });
  assert.deepEqual(result.subscores, [
    { label: 'Anxiety (GAD-2)', score: 0, maxScore: 6 },
    { label: 'Depression (PHQ-2)', score: 3, maxScore: 6 },
  ]);
  assert.equal(result.actions[0].title, 'Arrange a fuller assessment');
});

test('AUDIT-C scores all totals, exposes population-specific thresholds and does not diagnose', () => {
  const d = definition('auditc');
  assert.equal(d.questions.length, 3);
  for (let total = 0; total <= 12; total++) {
    const result = scoreQuestionnaire(d, withTotal('auditc', total));
    assert.equal(result.score, total);
    assert.equal(result.maxScore, 12);
    assert.equal(result.label, total >= 4 ? 'Further alcohol assessment recommended' : total === 3 ? 'Follow-up may be appropriate' : 'Below cited screening thresholds');
    assert.match(result.summary, /≥3 for women and ≥4 for men/);
    assert.match(result.summary, /not a diagnosis/);
    assert.ok(result.actions.some(a => /withdrawal/i.test(a.title)));
  }
  assert.match(d.questions[2].prompt, /six or more/);
  assert.match(d.timeframe, /past year/);
  assert.ok(d.resources.some(r => r.href === additionalQuestionnaireSources.auditc.href));
});

test('AUDIT-C Never skips only its remaining two questions and cannot inherit stale points', () => {
  const d = definition('auditc');
  assert.deepEqual(missingQuestions(d, { 'auditc-1': 0 }), []);
  assert.equal(scoreQuestionnaire(d, { 'auditc-1': 0 }).score, 0);
  assert.equal(scoreQuestionnaire(d, { 'auditc-1': 0, 'auditc-2': 4, 'auditc-3': 4 }).score, 0);
  assert.deepEqual(missingQuestions(d, { 'auditc-1': 1 }), ['auditc-2', 'auditc-3']);
  assert.throws(() => scoreQuestionnaire(d, { 'auditc-1': 1 }));
});

test('PCL-5 preserves all 20 zero-based response items and month recall period', () => {
  const d = definition('pcl5');
  assert.equal(d.questions.length, 20);
  assert.match(d.timeframe, /past month/);
  for (const q of d.questions) {
    assert.deepEqual(q.choices.map(c => [c.label, c.value, c.points]), [
      ['Not at all', 0, 0], ['A little bit', 1, 1], ['Moderately', 2, 2], ['Quite a bit', 3, 3], ['Extremely', 4, 4],
    ]);
  }
  for (let total = 0; total <= 80; total++) {
    const result = scoreQuestionnaire(d, withTotal('pcl5', total));
    assert.equal(result.score, total);
    assert.equal(result.maxScore, 80);
    assert.equal(result.label, total >= 31 ? 'Professional trauma assessment recommended' : 'Reported trauma-related symptom total');
    assert.match(result.summary, /not a PTSD diagnosis/);
    assert.match(result.summary, /31–33/);
    assert.doesNotMatch(result.label, /Minimal|Mild|Moderate|Severe|probable PTSD/i);
  }
  assert.match(d.scope, /Criterion A/);
  assert.match(d.scope, /do not need to type or describe/);
  assert.ok(d.resources.some(r => r.href === additionalQuestionnaireSources.pcl5Form.href));
});

test('PHQ-15 scores all totals without equating physical symptoms with a psychiatric cause', () => {
  const d = definition('phq15');
  assert.equal(d.questions.length, 15);
  assert.match(d.timeframe, /last 4 weeks/);
  for (const q of d.questions) assert.deepEqual(q.choices.map(c => [c.label, c.points]), [
    ['Not bothered at all', 0], ['Bothered a little', 1], ['Bothered a lot', 2],
  ]);
  for (let total = 0; total <= 30; total++) {
    const result = scoreQuestionnaire(d, withTotal('phq15', total));
    assert.equal(result.score, total);
    assert.equal(result.maxScore, 30);
    assert.equal(result.label, `${total < 5 ? 'Minimal' : total < 10 ? 'Low' : total < 15 ? 'Medium' : 'High'} reported physical symptom burden`);
    assert.match(result.summary, /does not diagnose/);
    assert.ok(result.actions.some(a => /911/.test(a.body)));
    assert.equal(result.urgentMedical, false, 'Historical symptom answers do not establish a current emergency');
  }
  const answers = withTotal('phq15', 0);
  answers['phq15-14'] = 2;
  assert.ok(scoreQuestionnaire(d, answers).actions.some(a => /sleep/.test(a.title)));
});

test('new scored tools reject incomplete and invalid answers without defaults', () => {
  for (const id of ['phq4', 'auditc', 'pcl5', 'phq15'] as const) {
    const d = definition(id);
    assert.throws(() => scoreQuestionnaire(d, {}));
    const valid = Object.fromEntries(d.questions.map(q => [q.id, 1]));
    for (const q of d.questions) for (const value of [-1, 10, NaN, Infinity, 0.5]) {
      assert.throws(() => scoreQuestionnaire(d, { ...valid, [q.id]: value }));
    }
    assert.ok(d.attribution);
    assert.ok(d.resources.every(r => r.href.startsWith('/') || r.href.startsWith('https://')));
  }
});

test('all requested licensed instruments are official links, never copied scoring definitions', () => {
  assert.deepEqual(licensedQuestionnaireResources.map(r => r.id), ['isi', 'odi', 'ndi']);
  for (const r of licensedQuestionnaireResources) {
    assert.match(r.href, /^https:\/\/eprovide\.mapi-trust\.org\/instruments\//);
    assert.ok(!questionnaireDefinitions.some(d => (d.id as string) === r.id));
  }
});
