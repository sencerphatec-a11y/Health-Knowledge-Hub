import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { questionnaireDefinitions, type QuestionnaireId } from './questionnaires';
import { missingQuestions, scoreQuestionnaire, urgentFlags, type Answers } from './questionnaire-scoring';

const definition = (id: QuestionnaireId) => questionnaireDefinitions.find(d => d.id === id)!;
const uniform = (id: QuestionnaireId, value: number): Answers =>
  Object.fromEntries(definition(id).questions.map(q => [q.id, value]));
const withTotal = (id: 'phq9' | 'gad7' | 'wellbeing', total: number): Answers => {
  const answers: Answers = {};
  for (const q of definition(id).questions) {
    answers[q.id] = Math.min(total, id === 'wellbeing' ? 4 : 3);
    total -= answers[q.id];
  }
  assert.equal(total, 0);
  return answers;
};

test('required questions have no implied defaults or partial scores', () => {
  for (const d of questionnaireDefinitions) {
    assert.equal(missingQuestions(d, {}).length, d.questions.length);
    assert.throws(() => scoreQuestionnaire(d, {}), /every required question/);
    for (const invalid of [-1, 99, NaN, Infinity, '0' as unknown as number]) {
      const answers = { ...uniform(d.id, 0), [d.questions[0].id]: invalid };
      assert.deepEqual(missingQuestions(d, answers), [d.questions[0].id]);
      assert.throws(() => scoreQuestionnaire(d, answers));
    }
  }
});

test('PHQ-9 scores every total and preserves all clinical severity boundaries', () => {
  const d = definition('phq9');
  assert.equal(d.questions.length, 9);
  for (let total = 0; total <= 27; total++) {
    const result = scoreQuestionnaire(d, withTotal('phq9', total));
    const label = total < 5 ? 'Minimal' : total < 10 ? 'Mild' : total < 15 ? 'Moderate' : total < 20 ? 'Moderately severe' : 'Severe';
    assert.equal(result.score, total);
    assert.equal(result.maxScore, 27);
    assert.equal(result.label, `${label} reported depressive symptoms`);
    assert.match(result.summary, /not a diagnosis|clinical interview/);
  }
});

test('GAD-7 scores every total and preserves all anxiety severity boundaries', () => {
  const d = definition('gad7');
  assert.equal(d.questions.length, 7);
  for (let total = 0; total <= 21; total++) {
    const result = scoreQuestionnaire(d, withTotal('gad7', total));
    const label = total < 5 ? 'Minimal' : total < 10 ? 'Mild' : total < 15 ? 'Moderate' : 'Severe';
    assert.equal(result.score, total);
    assert.equal(result.maxScore, 21);
    assert.equal(result.label, `${label} reported anxiety symptoms`);
  }
});

test('standardized symptom response scores and recall period remain intact', () => {
  for (const id of ['phq9', 'gad7'] as const) {
    const d = definition(id);
    assert.match(d.timeframe, /last (2|two) weeks/);
    for (const q of d.questions) assert.deepEqual(q.choices, [
      { value: 0, label: 'Not at all', points: 0 },
      { value: 1, label: 'Several days', points: 1 },
      { value: 2, label: 'More than half the days', points: 2 },
      { value: 3, label: 'Nearly every day', points: 3 },
    ]);
    assert.ok(d.attribution && d.resources.some(r => /scoring and reproduction/.test(r.label)));
  }
  assert.equal(definition('phq9').questions[8].prompt, 'Thoughts that you would be better off dead or of hurting yourself in some way');
});

test('every positive PHQ self-harm response alerts before completion and at any total', () => {
  for (const value of [1, 2, 3]) {
    assert.equal(urgentFlags('phq9', { 'phq-9': value }).selfHarm, true);
    assert.throws(() => scoreQuestionnaire(definition('phq9'), { 'phq-9': value }));
    const result = scoreQuestionnaire(definition('phq9'), { ...uniform('phq9', 0), 'phq-9': value });
    assert.equal(result.score, value);
    assert.equal(result.selfHarm, true);
    assert.match(result.summary, /regardless/);
    assert.match(result.actions[0].body, /988/);
    assert.match(result.actions[0].body, /911/);
    assert.match(result.actions[0].body, /cannot assess suicide risk/);
  }
  assert.equal(urgentFlags('phq9', { 'phq-9': 0 }).selfHarm, false);
  assert.match(scoreQuestionnaire(definition('phq9'), uniform('phq9', 0)).actions[0].body, /does not rule out/);
  assert.equal(urgentFlags('gad7', { 'phq-9': 3 }).selfHarm, false);
});

test('optional functioning informs feedback without altering PHQ-9 scoring', () => {
  const d = definition('phq9');
  const base = scoreQuestionnaire(d, uniform('phq9', 0));
  const difficult = scoreQuestionnaire(d, uniform('phq9', 0), 3);
  assert.equal(difficult.score, base.score);
  assert.ok(difficult.actions.some(a => /impact on daily life/.test(a.title)));
  for (const invalid of [-1, 4, 1.5, NaN]) assert.throws(() => scoreQuestionnaire(d, uniform('phq9', 0), invalid));
});

test('custom wellbeing score is transparent, bounded, and drives habit-specific advice', () => {
  const d = definition('wellbeing');
  for (let total = 0; total <= 20; total++) {
    const result = scoreQuestionnaire(d, withTotal('wellbeing', total));
    assert.equal(result.score, total * 5);
    assert.equal(result.maxScore, 100);
    assert.equal(result.label, total * 5 < 40 ? 'Many habits to support' : total * 5 < 75 ? 'Some habits to support' : 'Consistent habits');
  }
  const result = scoreQuestionnaire(d, { ...uniform('wellbeing', 4), 'well-water': 0 });
  assert.equal(result.score, 80);
  assert.equal(result.actions.length, 1);
  assert.match(result.actions[0].body, /prescribed fluid limit/);
  assert.match(scoreQuestionnaire(d, uniform('wellbeing', 4)).summary, /not a health grade/);
});

test('current severe symptoms alert immediately and override routine exercise advice', () => {
  assert.equal(urgentFlags('exercise', { 'ex-now': 1 }).urgentMedical, true);
  const result = scoreQuestionnaire(definition('exercise'), { ...uniform('exercise', 0), 'ex-now': 1 });
  assert.equal(result.urgentMedical, true);
  assert.equal(result.label, 'Urgent symptoms reported');
  assert.match(result.summary, /911/);
  assert.equal(result.actions.length, 1);
  assert.deepEqual(result.resources, []);
});

test('readiness review cannot clear exercise, including all-No and uncertain responses', () => {
  const d = definition('exercise');
  const no = scoreQuestionnaire(d, uniform('exercise', 0));
  assert.equal(no.score, 0);
  assert.match(no.actions[0].body, /does not establish.*safe/);
  assert.ok(no.resources.some(r => r.href === 'https://eparmedx.com/?page_id=75'));
  const uncertain = scoreQuestionnaire(d, uniform('exercise', 2));
  assert.equal(uncertain.score, 5);
  assert.equal(uncertain.urgentMedical, false);
  assert.match(uncertain.summary, /not exercise safety/);
  assert.match(d.scope, /not PAR-Q/);
});

test('lifestyle areas include uncertainty without disease probability or clinical risk tiers', () => {
  const d = definition('lifestyle');
  for (const value of [0, 1, 2]) {
    const result = scoreQuestionnaire(d, uniform('lifestyle', value));
    assert.equal(result.score, value === 0 ? 0 : 6);
    assert.equal(result.maxScore, 6);
    assert.match(result.summary, /not a disease-risk category/);
    assert.doesNotMatch(result.label, /Low Risk|Moderate Risk|High Risk/);
  }
  const family = scoreQuestionnaire(d, { ...uniform('lifestyle', 0), 'life-family': 2 });
  assert.equal(family.score, 1);
  assert.equal(family.label, 'Choose a discussion area');
  assert.match(family.actions[0].body, /unknown history does not mean.*disease/);
});
