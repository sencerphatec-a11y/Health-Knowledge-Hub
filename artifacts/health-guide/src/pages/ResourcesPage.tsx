import { ArrowUpRight } from 'lucide-react';
import { supportResources, resourceChecked } from '../data/support-resources';
import { Out } from './shared';

export default function ResourcesPage() {
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / resources</div><h1 className="serif">Where to turn for help.</h1><p>Official and nonprofit services for older adults, patients, and families. Links open the organization’s own site in a new tab and leave Health Guide. Links checked {resourceChecked}.</p></div>
    <div className="res-list">
      {supportResources.map((r) => <article className="res-card" key={r.id} data-testid={`card-resource-${r.id}`}>
        <div className="res-main"><div className="eyebrow">{r.organization}</div><h2 className="serif">{r.title}</h2><p>{r.summary}</p>
          <ul>{r.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          <p className="res-limit"><strong>Good to know:</strong> {r.limitations}</p></div>
        <div className="res-links"><h3>Go to the source</h3>
          {r.contact && <Out href={r.contact.url} className="outlink-btn solid">{r.contact.label}</Out>}
          {r.links.map((l, i) => <Out key={l.url} href={l.url} className={`outlink-btn${!r.contact && i === 0 ? ' solid' : ''}`}>{l.label}</Out>)}
        </div>
      </article>)}
    </div>
    <div className="disclaimer" style={{ margin: '28px 0 50px' }}><strong>Independent listing.</strong> Health Guide does not submit requests, determine eligibility, or guarantee assistance. <ArrowUpRight size={12} style={{ verticalAlign: '-2px' }} /> Contact each organization for current services.</div>
  </main>;
}
