import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { givingOpportunities, localCommunityChecked } from '../data/local-community';
import { Out } from './shared';
import './CommunityHelp.css';

const FILTERS = ['All', 'Donate', 'Volunteer', 'Donate & volunteer'] as const;

export default function GiveBackPage() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<string>('All');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return givingOpportunities.filter((g) => (kind === 'All' || g.kind === kind) && (!t || `${g.title} ${g.organization} ${g.summary} ${g.serviceArea}`.toLowerCase().includes(t)));
  }, [q, kind]);
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / give back</div><h1 className="serif">Ways to help West Des Moines neighbors.</h1><p>Money, items, and time can all help. Each opportunity below belongs to an official organization; you give or sign up on its own site. Links checked {localCommunityChecked}.</p></div>
    <div className="notice-strong" role="note"><strong>Health Guide takes no donations and no sign-ups.</strong> Never send payment to Health Guide. There is no form here and we run no campaigns of our own.</div>
    <section aria-labelledby="ch-safe"><h2 id="ch-safe" className="serif" style={{ fontSize: 34, margin: '0 0 14px' }}>Three ways to help, and how to do it safely</h2>
      <div className="ch-tips">
        <div><h3>Money</h3><p>Use the organization’s official giving page. Ask about receipts and tax questions; no tax benefit is guaranteed here.</p></div>
        <div><h3>Items</h3><p>Check current needs first and coordinate before delivering. Unneeded or unaccepted items can create extra work.</p></div>
        <div><h3>Time</h3><p>Confirm roles, age minimums, screening, and schedules with the organization. Placement is not guaranteed.</p></div>
        <div><h3>Stay careful</h3><p>Start from the official links on this page, not from unsolicited messages. Regional roles are not all based in West Des Moines.</p></div>
      </div></section>
    <div className="ch-band"><h2>Nine opportunities</h2></div>
    <div className="library-controls">
      <label className="library-search"><Search size={15} aria-hidden="true" /><span className="sr-only">Search opportunities</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by organization or topic" /></label>
    </div>
    <div className="ch-tabs" role="group" aria-label="Filter by way to help">{FILTERS.map((f) => <button key={f} type="button" className={`filter-chip${kind === f ? ' active' : ''}`} aria-pressed={kind === f} onClick={() => setKind(f)}>{f}</button>)}</div>
    <p className="result-count" aria-live="polite">Showing {list.length} of {givingOpportunities.length}</p>
    {list.length === 0 ? <div className="empty-state"><h2>No matches.</h2><p>Try a different word or clear the filter.</p><button type="button" className="button-primary" onClick={() => { setQ(''); setKind('All'); }}>Clear filters</button></div> :
      <div className="ch-cards">{list.map((g) => <article className="ch-card" key={g.id} data-testid={`card-give-${g.id}`}>
        <div><span className="ch-tag">{g.kind}</span></div>
        <h3>{g.title}</h3>
        <p className="ch-area">{g.organization} · {g.serviceArea}</p>
        <p>{g.summary}</p>
        <h4>How to start</h4>
        <ol>{g.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <h4>Requirements</h4>
        <p className="ch-note">{g.requirements}</p>
        <div className="res-links row">{g.links.map((l, i) => <Out key={l.url} href={l.url} className={`outlink-btn${i === 0 ? ' solid' : ''}`}>{l.label}</Out>)}</div>
      </article>)}</div>}
    <div className="disclaimer" style={{ margin: '18px 0 50px' }}><strong>Independent listing.</strong> Health Guide does not process gifts, place volunteers, or promise outcomes. Contact each organization for current needs.</div>
  </main>;
}
