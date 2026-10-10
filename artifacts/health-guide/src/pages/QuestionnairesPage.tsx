import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { Out } from './shared';
import { questionnaireDefinitions } from '../data/questionnaires';
import { missingQuestions, scoreQuestionnaire, urgentFlags, type Answers } from '../data/questionnaire-scoring';
import { CrisisSupport, Limits, MedicalAlert, Privacy } from '../components/questionnaires/SafetyPanels';
import { QuestionField } from '../components/questionnaires/Question';
import { ResultView } from '../components/questionnaires/Result';
import './QuestionnairesPage.css';

const funcChoices = [
  { value: 0, label: 'Not difficult at all' }, { value: 1, label: 'Somewhat difficult' },
  { value: 2, label: 'Very difficult' }, { value: 3, label: 'Extremely difficult' },
];

export default function QuestionnairesPage() {
  const [toolId, setToolId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [functioning, setFunctioning] = useState<number | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const def = questionnaireDefinitions.find((d) => d.id === toolId);

  const reset = () => { setAnswers({}); setFunctioning(undefined); setSubmitted(false); setShowErrors(false); };
  const choose = (id: string | null) => { reset(); setToolId(id); };
  useEffect(() => { if (toolId) headRef.current?.focus(); }, [toolId]);

  const missing = useMemo(() => def ? missingQuestions(def, answers) : [], [def, answers]);
  const flags = useMemo(() => def ? urgentFlags(def.id, answers) : { selfHarm: false, urgentMedical: false }, [def, answers]);
  useEffect(() => {
    const alertId = flags.selfHarm ? 'alert-self-harm' : flags.urgentMedical ? 'alert-urgent-medical' : null;
    if (alertId) document.querySelector<HTMLElement>(`[data-testid="${alertId}"]`)?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [flags.selfHarm, flags.urgentMedical]);
  const result = useMemo(() => def && submitted && missing.length === 0 ? scoreQuestionnaire(def, answers, functioning) : null, [def, submitted, missing, answers, functioning]);

  const setAnswer = (qid: string, v: number) => { setAnswers((a) => ({ ...a, [qid]: v })); setSubmitted(false); };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (missing.length) {
      setShowErrors(true); setSubmitted(false);
      const first = missing[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>(`input[name="${def!.id}-${first}"][data-first]`)?.focus());
      return;
    }
    setSubmitted(true);
    requestAnimationFrame(() => document.getElementById('qn-result')?.focus());
  };

  return <main className="shell qn-page">
    <div className="page-heading animate-arrive">
      <div className="eyebrow">Reading room / Reflection tools</div>
      <h1 className="serif">Questionnaires, for reflection.</h1>
      <p>Short, private check-ins you can use to notice how you are doing and decide what to read or ask about next. They are not diagnostic. Interactive tools are intended for adults 18 and older; younger readers should talk with a trusted adult or clinician. Urgent support is available at any age.</p>
    </div>
    <CrisisSupport selfHarm={flags.selfHarm} />
    {flags.urgentMedical && <MedicalAlert />}
    <Limits exercise={!def || def.id === 'exercise'} />
    <Privacy />

    {!def && <section aria-labelledby="qn-choose" className="qn-chooser">
      <h2 id="qn-choose" className="serif">Choose a tool</h2>
      <div className="qn-cards">
        {questionnaireDefinitions.map((d) => <button key={d.id} type="button" className="qn-card" onClick={() => choose(d.id)} data-testid={`select-tool-${d.id}`}>
          <span className="card-meta"><span>{d.category}</span><span>{d.badge}</span></span>
          <strong className="serif">{d.title}</strong>
          <span className="qn-small">{d.description}</span>
          <span className="qn-small">{d.timeframe}</span>
        </button>)}
      </div>
    </section>}

    {def && <>
      <div className="qn-toolhead">
        <button type="button" className="text-link qn-linkbtn" onClick={() => choose(null)} data-testid="button-back-to-tools-top">Back to all tools</button>
        <h2 className="serif" tabIndex={-1} ref={headRef}>{def.title}</h2>
        <p>{def.description}</p>
        <p className="qn-small"><strong>{def.timeframe}</strong> · {def.scope}</p>
        <details className="qn-details"><summary>Methodology and sources</summary>
          <p className="qn-small">{def.scoringExplanation}</p>
          {def.attribution && <p className="qn-small">{def.attribution}</p>}
          <div className="qn-links">{def.resources.map((r) => r.href.startsWith('/')
            ? <Link key={r.href} href={r.href} className="text-link">{r.label}</Link>
            : <Out key={r.href} href={r.href} className="inline-out">{r.label}</Out>)}</div>
        </details>
        {(def.id === 'wellbeing' || def.id === 'lifestyle' || def.id === 'exercise') && <p className="qn-small">This is a custom educational reflection, not a validated or formal risk calculator. It does not estimate disease probability.</p>}
      </div>

      {result ? <ResultView result={result} methodology={def.scoringExplanation} attribution={def.attribution}
        onEdit={() => { setSubmitted(false); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input')?.focus()); }}
        onClear={() => { reset(); window.scrollTo({ top: 0 }); }} onChooser={() => choose(null)} />
      : <form ref={formRef} onSubmit={submit} noValidate className="qn-form" data-testid="form-questionnaire" aria-label={def.title}>
        {showErrors && missing.length > 0 && <p className="qn-error" role="alert" data-testid="error-summary">{missing.length} {missing.length === 1 ? 'question needs' : 'questions need'} an answer.</p>}
        {def.questions.map((q, i) => <QuestionField key={`${def.id}-${q.id}`} name={`${def.id}-${q.id}`} testBase={q.id} index={i + 1} prompt={q.prompt} note={q.note}
          choices={q.choices} value={answers[q.id]} error={showErrors && missing.includes(q.id)} onChange={(v) => setAnswer(q.id, v)} />)}
        {def.functionalQuestion && <div className="qn-optional">
          <p className="qn-small"><strong>Optional, not scored.</strong> You can skip this.</p>
          <QuestionField name={`${def.id}-functioning`} testBase="functioning" index={def.questions.length + 1} prompt={def.functionalQuestion} choices={funcChoices} value={functioning} onChange={(v) => { setFunctioning(v); setSubmitted(false); }} />
        </div>}
        <div className="qn-row qn-gap">
          <button type="submit" className="button-primary" data-testid="button-submit-questionnaire">Show results</button>
          <button type="button" className="outlink-btn" onClick={reset} data-testid="button-clear-answers">Clear answers</button>
        </div>
      </form>}
    </>}
  </main>;
}
