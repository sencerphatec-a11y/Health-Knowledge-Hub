import { Out } from '../pages/shared';
import type { AssistanceProgram } from '../data/assistance-resources';

export default function AssistanceProgramCard({ program }: { program: AssistanceProgram }) {
  return <article className="ap-card" data-testid={`card-program-${program.id}`}>
    <div className="ap-type">{program.type}</div>
    <h3>{program.name}</h3>
    <p>{program.summary}</p>
    <dl className="ap-facts">
      <div><dt>Who it may serve</dt><dd>{program.eligibility}</dd></div>
      <div><dt>Cost and coverage</dt><dd>{program.cost}</dd></div>
    </dl>
    <div className="ap-steps"><h4>Possible next steps</h4><ol>{program.nextSteps.map((s) => <li key={s}>{s}</li>)}</ol></div>
    <div className="ap-links"><h4>Official and source links</h4><div>{program.links.map((l) => <Out key={l.url + l.label} href={l.url}>{l.label}</Out>)}</div></div>
  </article>;
}
