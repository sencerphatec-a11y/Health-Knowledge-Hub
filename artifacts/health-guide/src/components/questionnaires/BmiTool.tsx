import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { Out } from '../../pages/shared';
import { bmiSources, calculateBmi, emptyBmiInput, type BmiInput, type BmiResult } from '../../data/bmi';
import './BmiTool.css';

type Errors = Partial<Record<keyof BmiInput, string>>;

const ranges = [
  { cat: 'Underweight', range: 'Below 18.5' },
  { cat: 'Normal weight', range: '18.5 to below 25 (CDC: healthy weight)' },
  { cat: 'Overweight', range: '25 to below 30' },
  { cat: 'Obese', range: '30 to below 40 (class 1: 30 to below 35; class 2: 35 to below 40)' },
  { cat: 'Morbid obesity', range: '40 or higher (class 3, also called severe obesity; preferred wording)' },
];

const fieldOrder: (keyof BmiInput)[] = ['age', 'pregnant', 'units', 'feet', 'inches', 'weightLb', 'heightCm', 'weightKg'];

export function BmiTool({ onChooser }: { onChooser: () => void }) {
  const [input, setInput] = useState<BmiInput>({ ...emptyBmiInput });
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<BmiResult | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { headRef.current?.focus(); }, []);

  const set = (key: keyof BmiInput, value: string) => {
    setInput((s) => ({ ...s, [key]: value }));
    setResult(null);
    setErrors((e) => { if (!e[key]) return e; const n = { ...e }; delete n[key]; return n; });
  };
  const setUnits = (units: BmiInput['units']) => {
    setInput((s) => ({ ...s, units, heightCm: '', weightKg: '', feet: '', inches: '', weightLb: '' }));
    setResult(null);
    setErrors((e) => { const n = { ...e }; delete n.heightCm; delete n.weightKg; delete n.feet; delete n.inches; delete n.weightLb; delete n.units; return n; });
  };
  const reset = () => { setInput({ ...emptyBmiInput }); setErrors({}); setResult(null); };
  const choose = () => { reset(); onChooser(); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const calc = calculateBmi(input);
    setErrors(calc.errors);
    if (!calc.result) {
      setResult(null);
      const first = fieldOrder.find((k) => calc.errors[k]);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="bmi-${first}"]`)?.focus());
      return;
    }
    setResult(calc.result);
    requestAnimationFrame(() => document.getElementById('bmi-result')?.focus());
  };

  const edit = () => { setResult(null); requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[name="bmi-age"]')?.focus()); };

  const errList = fieldOrder.filter((k) => errors[k]);
  const desc = (k: keyof BmiInput, hint?: boolean) => [hint ? `bmi-${k}-hint` : '', errors[k] ? `bmi-${k}-err` : ''].filter(Boolean).join(' ') || undefined;
  const Err = ({ k }: { k: keyof BmiInput }) => errors[k] ? <p id={`bmi-${k}-err`} className="bmi-field-err">{errors[k]}</p> : null;

  const num = (k: keyof BmiInput, label: string, unit: string, inputMode: 'numeric' | 'decimal', hint?: string) =>
    <div className={`bmi-field${errors[k] ? ' has-error' : ''}`}>
      <label htmlFor={`bmi-${k}`}>{label}</label>
      {hint && <span id={`bmi-${k}-hint`} className="qn-small bmi-hint">{hint}</span>}
      <div className="bmi-input-wrap">
        <input id={`bmi-${k}`} name={`bmi-${k}`} type="text" inputMode={inputMode} autoComplete="off" value={input[k]}
          onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} aria-describedby={desc(k, !!hint)} data-testid={`input-bmi-${k}`} />
        <span className="bmi-unit" aria-hidden="true">{unit}</span>
      </div>
      <Err k={k} />
    </div>;

  return <div className="bmi">
    <div className="qn-toolhead">
      <button type="button" className="text-link qn-linkbtn" onClick={choose} data-testid="button-back-bmi">Back to all tools</button>
      <h2 className="serif" tabIndex={-1} ref={headRef}>Adult BMI screening</h2>
      <p>Body mass index compares weight to height. It is a quick screening number for adults 20 and older, not a diagnosis. It cannot tell fat from muscle or bone, does not describe where weight is carried, and is not interpreted here during pregnancy. A clinician can put it in context with your history, measurements, and goals.</p>
      <p className="qn-small"><strong>Adults 20+</strong> · Your answers stay on this page in memory only; nothing is saved or sent.</p>
      <details className="qn-details"><summary>Methodology and sources</summary>
        <p className="qn-small">BMI = weight in kilograms divided by height in meters squared. U.S. units are converted first (1 in = 2.54 cm, 1 lb = 0.45359237 kg). Categories follow CDC adult ranges and are assigned from the unrounded value.</p>
        <div className="qn-links">
          <Out href={bmiSources.categories} className="inline-out">CDC adult BMI categories</Out>
          <Out href={bmiSources.adults} className="inline-out">CDC adult BMI calculator</Out>
          <Out href={bmiSources.children} className="inline-out">CDC child and teen BMI calculator (ages 2–19)</Out>
        </div>
      </details>
    </div>

    {result ? <section className="qn-result bmi-result" aria-labelledby="bmi-result-h" tabIndex={-1} id="bmi-result" data-testid="result-bmi">
      <div className="eyebrow">Your screening result</div>
      <div className="bmi-readout">
        <span className="bmi-value serif" data-testid="text-bmi-value">{result.bmi.toFixed(2)}</span>
        <div>
          <span className="bmi-label">BMI category</span>
          <h2 id="bmi-result-h" className="serif" data-testid="text-bmi-category">{result.category}</h2>
        </div>
      </div>
      <p className="qn-small">Shown to two decimals. The category is assigned from the unrounded value, so a result displayed near a boundary may fall on either side of it.</p>
      <p>{result.explanation}</p>
      <h3>A next step to consider</h3>
      <p className="qn-action">{result.nextStep}</p>
      <h3>Adult BMI ranges (CDC)</h3>
      <ul className="bmi-ranges">{ranges.map((r) => <li key={r.cat} className={r.cat === result.category ? 'on' : ''} aria-current={r.cat === result.category ? 'true' : undefined}>
        <strong>{r.cat}</strong><span>{r.range}</span></li>)}</ul>
      <h3>What this number cannot tell you</h3>
      <p>BMI is a screening tool, not a diagnosis. It does not distinguish fat from muscle; higher muscle mass and age-related muscle changes can affect its interpretation. It does not measure fat distribution, and health relationships may vary across populations. It is not interpreted here during pregnancy. Clinician context matters.</p>
      <h3>Learn more</h3>
      <div className="qn-links">
        <Out href={bmiSources.categories}>CDC adult BMI categories</Out>
        <Out href={bmiSources.adults}>CDC adult BMI calculator</Out>
        <Link href="/find-a-doctor" className="text-link">Find a Doctor</Link>
      </div>
      <div className="qn-row qn-gap">
        <button type="button" className="button-primary" onClick={edit} data-testid="button-edit-bmi">Edit answers</button>
        <button type="button" className="outlink-btn" onClick={() => { reset(); window.scrollTo({ top: 0 }); requestAnimationFrame(() => headRef.current?.focus()); }} data-testid="button-clear-bmi">Clear and start over</button>
        <button type="button" className="outlink-btn" onClick={choose} data-testid="button-choose-bmi-tool">Choose another tool</button>
      </div>
    </section>

    : <form ref={formRef} onSubmit={submit} noValidate className="qn-form bmi-form" aria-label="Adult BMI screening">
      {errList.length > 0 && <div className="bmi-summary" role="alert" data-testid="error-bmi-summary">
        <p className="qn-error">{errList.length} {errList.length === 1 ? 'answer needs' : 'answers need'} attention:</p>
        <ul>{errList.map((k) => <li key={k}><a href={`#bmi-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`bmi-${k}`)?.focus(); }}>{errors[k]}</a></li>)}</ul>
      </div>}

      <fieldset className="qn-q">
        <legend><span className="qn-num">1</span>About you</legend>
        {num('age', 'Age in years', 'yrs', 'numeric', 'Whole number, 20 or older.')}
        {errors.age && <p className="qn-small">For ages 2–19, use the <Out href={bmiSources.children} className="inline-out">CDC child and teen BMI calculator</Out> or talk with a clinician.</p>}
        <div className={`bmi-field${errors.pregnant ? ' has-error' : ''}`}>
          <label htmlFor="bmi-pregnant">Are you currently pregnant?</label>
          <select id="bmi-pregnant" name="bmi-pregnant" value={input.pregnant} onChange={(e) => set('pregnant', e.target.value)}
            aria-invalid={!!errors.pregnant} aria-describedby={desc('pregnant')} data-testid="select-bmi-pregnant">
            <option value="">Choose an answer</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="unsure">Not sure</option>
          </select>
          <Err k="pregnant" />
          {(input.pregnant === 'yes' || input.pregnant === 'unsure') && !errors.pregnant && <p className="qn-small">This tool does not interpret current BMI during pregnancy. Your care team can advise on an appropriate assessment and healthy weight gain.</p>}
        </div>
      </fieldset>

      <fieldset className="qn-q">
        <legend><span className="qn-num">2</span>Height and weight</legend>
        <div className={`bmi-field${errors.units ? ' has-error' : ''}`}>
          <label htmlFor="bmi-units">Units</label>
          <span id="bmi-units-hint" className="qn-small bmi-hint">Switching units clears height and weight.</span>
          <select id="bmi-units" name="bmi-units" value={input.units} onChange={(e) => setUnits(e.target.value as BmiInput['units'])}
            aria-describedby={desc('units', true)} data-testid="select-bmi-units">
            <option value="us">U.S. (feet, inches, pounds)</option>
            <option value="metric">Metric (centimeters, kilograms)</option>
          </select>
          <Err k="units" />
        </div>
        {input.units === 'us' ? <>
          <div className="bmi-pair">
            {num('feet', 'Height, feet', 'ft', 'numeric')}
            {num('inches', 'Additional inches', 'in', 'decimal')}
          </div>
          {num('weightLb', 'Weight in pounds', 'lb', 'decimal')}
        </> : <div className="bmi-pair">
          {num('heightCm', 'Height in centimeters', 'cm', 'decimal')}
          {num('weightKg', 'Weight in kilograms', 'kg', 'decimal')}
        </div>}
      </fieldset>

      <div className="qn-row qn-gap">
        <button type="submit" className="button-primary" data-testid="button-calculate-bmi">Calculate BMI</button>
        <button type="button" className="outlink-btn" onClick={reset} data-testid="button-clear-bmi">Clear answers</button>
      </div>
    </form>}
  </div>;
}
