import { Link } from 'wouter';
import { Out } from '../../pages/shared';
import type { QuestionnaireResult } from '../../data/questionnaire-scoring';

const L = ({ href, children }: { href: string; children: React.ReactNode }) =>
  href.startsWith('/') ? <Link href={href} className="text-link">{children}</Link> : <Out href={href}>{children}</Out>;

export function ResultView({ result, methodology, attribution, onEdit, onClear, onChooser }: {
  result: QuestionnaireResult; methodology: string; attribution?: string; onEdit: () => void; onClear: () => void; onChooser: () => void;
}) {
  return <section className="qn-result" aria-labelledby="qn-result-h" data-testid="result-questionnaire" tabIndex={-1} id="qn-result">
    <div className="eyebrow">Your reflection summary</div>
    <h2 id="qn-result-h" className="serif" data-testid="text-result-label">{result.label}</h2>
    <p className="qn-score" data-testid="text-result-score">Score {result.score} of {result.maxScore}</p>
    {result.subscores && <div className="qn-subtotals" aria-label="Symptom subtotals">
      {result.subscores.map((s) => <p key={s.label} data-testid={`subscore-${s.label.startsWith('Anxiety') ? 'anxiety' : 'depression'}`}><strong>{s.label}:</strong> {s.score} of {s.maxScore}</p>)}
    </div>}
    <p data-testid="text-result-summary">{result.summary}</p>
    <p>{result.scoreMeaning}</p>
    <h3>How this is scored</h3>
    <p className="qn-small" data-testid="text-methodology">{methodology}</p>
    {attribution && <p className="qn-small">{attribution}</p>}
    <h3>Suggested next steps</h3>
    <div className="qn-actions">{result.actions.map((a, i) => <div key={i} className="qn-action" data-testid={`result-action-${i}`}>
      <h4>{a.title}</h4><p>{a.body}</p>
      {a.resources.length > 0 && <div className="qn-links">{a.resources.map((r) => <L key={r.href + r.label} href={r.href}>{r.label}</L>)}</div>}
    </div>)}</div>
    <h3>Learn more</h3>
    <div className="qn-links" data-testid="list-result-resources">{result.resources.map((r) => <L key={r.href + r.label} href={r.href}>{r.label}</L>)}</div>
    <div className="qn-row qn-gap">
      <button type="button" className="button-primary" onClick={onEdit} data-testid="button-edit-answers">Edit answers</button>
      <button type="button" className="outlink-btn" onClick={onClear} data-testid="button-clear-answers">Clear and start over</button>
      <button type="button" className="outlink-btn" onClick={onChooser} data-testid="button-back-to-tools">Choose another tool</button>
    </div>
  </section>;
}
