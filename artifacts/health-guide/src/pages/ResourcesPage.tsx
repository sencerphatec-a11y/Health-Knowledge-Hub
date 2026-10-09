import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { supportResources, resourceChecked } from '../data/support-resources';
import { localResources, localCommunityChecked } from '../data/local-community';
import { Out } from './shared';
import './CommunityHelp.css';

export default function ResourcesPage() {
  const [q, setQ] = useState('');
  const local = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? localResources.filter((r) => `${r.title} ${r.category} ${r.serviceArea} ${r.summary}`.toLowerCase().includes(t)) : localResources;
  }, [q]);
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / resources</div><h1 className="serif">Where to turn for help.</h1><p>Official and nonprofit services for older adults, patients, and families, from nationwide programs to West Des Moines and central Iowa organizations. Links open the organization’s own site in a new tab and leave Health Guide.</p></div>
    <div className="ch-band" style={{ marginTop: 10 }}><h2>Nationwide resources</h2><span className="ch-tag nat">Nationwide</span></div>
    <p className="ch-lead">National programs and organizations. Links checked {resourceChecked}.</p>
    <div className="res-list">
      {supportResources.map((r) => <article className="res-card" key={r.id} data-testid={`card-resource-${r.id}`}>
        <div className="res-main"><div className="eyebrow">{r.organization}</div><h3 className="serif" style={{ fontSize: 34, fontWeight: 400, margin: '10px 0' }}>{r.title}</h3><p>{r.summary}</p>
          <ul>{r.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          <p className="res-limit"><strong>Good to know:</strong> {r.limitations}</p></div>
        <div className="res-links"><h3>Go to the source</h3>
          {r.contact && <Out href={r.contact.url} className="outlink-btn solid">{r.contact.label}</Out>}
          {r.links.map((l, i) => <Out key={l.url} href={l.url} className={`outlink-btn${!r.contact && i === 0 ? ' solid' : ''}`}>{l.label}</Out>)}
        </div>
      </article>)}
    </div>
    <div className="ch-band"><h2>Local and regional resources</h2><span className="ch-tag">Local / regional</span></div>
    <p className="ch-lead">West Des Moines, school-district, metro, central Iowa, and statewide organizations. Each service area is labeled because boundaries differ. Links checked {localCommunityChecked}.</p>
    <div className="library-controls"><label className="library-search"><Search size={15} aria-hidden="true" /><span className="sr-only">Search local and regional resources</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, category, or area" /></label></div>
    <p className="result-count" aria-live="polite">Showing {local.length} of {localResources.length}</p>
    {local.length === 0 ? <div className="empty-state"><h2>No matches.</h2><p>Try a different word.</p><button type="button" className="button-primary" onClick={() => setQ('')}>Clear search</button></div> :
      <div className="ch-cards">{local.map((r) => <article className="ch-card" key={r.id} data-testid={`card-local-${r.id}`}>
        <div><span className="ch-tag">{r.category}</span></div>
        <h3>{r.title}</h3>
        <p className="ch-area">Service area: {r.serviceArea}</p>
        <p>{r.summary}</p>
        <p className="ch-note"><strong>Good to know:</strong> {r.notes}</p>
        <div className="res-links row">{r.links.map((l, i) => <Out key={l.url} href={l.url} className={`outlink-btn${i === 0 ? ' solid' : ''}`}>{l.label}</Out>)}</div>
      </article>)}</div>}
    <div className="disclaimer" style={{ margin: '28px 0 50px' }}><strong>Independent listing.</strong> Health Guide does not submit requests, determine eligibility, or guarantee assistance. <ArrowUpRight size={12} style={{ verticalAlign: '-2px' }} /> Contact each organization for current services.</div>
  </main>;
}
