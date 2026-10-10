type Choice = { value: number; label: string };
export function QuestionField({ name, testBase, prompt, note, choices, value, error, index, onChange }: {
  name: string; testBase: string; prompt: string; note?: string; choices: Choice[]; value?: number; error?: boolean; index: number; onChange: (v: number) => void;
}) {
  const errId = `${name}-err`;
  return <fieldset className={`qn-q${error ? ' has-error' : ''}`} aria-describedby={error ? errId : undefined} aria-invalid={error || undefined} data-testid={`question-${testBase}`}>
    <legend><span className="qn-num">{index}</span>{prompt}</legend>
    {note && <p className="qn-small">{note}</p>}
    <div className="qn-choices">
      {choices.map((c, i) => <label key={c.value} className={`qn-choice${value === c.value ? ' on' : ''}`}>
        <input type="radio" name={name} id={i === 0 ? name : undefined} data-first={i === 0 ? '1' : undefined} checked={value === c.value} onChange={() => onChange(c.value)} data-testid={`answer-${testBase}-${c.value}`} />
        <span>{c.label}</span>
      </label>)}
    </div>
    {error && <p className="qn-error" id={errId} data-testid={`error-${testBase}`}>Please choose an answer for this question.</p>}
  </fieldset>;
}
