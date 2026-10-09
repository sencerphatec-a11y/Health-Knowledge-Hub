import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { vaccineFacts, vaccineSourceChecked, vaccineIndexUrl, scheduleStatus, scheduleDisclaimer, scheduleGroups, vaccineLearningLinks } from '../data/vaccines';
import { Out } from './shared';

export default function VaccinesPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState('children');
  const cats = useMemo(() => ['All', ...Array.from(new Set(vaccineFacts.map((v) => v.category)))], []);
  const list = vaccineFacts.filter((v) => (cat === 'All' || v.category === cat) && `${v.title} ${v.category} ${v.summary}`.toLowerCase().includes(q.trim().toLowerCase()));
  const group = scheduleGroups.find((g) => g.id === tab) ?? scheduleGroups[0];
  const reset = () => { setQ(''); setCat('All'); };
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / vaccines</div><h1 className="serif">Vaccines, with sources.</h1><p>Schedules and plain-language fact sheets drawn from the CDC Vaccine Information Statement (VIS) index, with FDA licensed-vaccine information for products without a CDC VIS. Source checked {vaccineSourceChecked}.</p></div>
    <nav className="res-links row" aria-label="On this vaccine page">
      <a className="text-link" href="#vaccination-schedules">Vaccination schedules</a>
      <a className="text-link" href="#vaccine-fact-sheets">Search vaccine facts</a>
      <a className="text-link" href="#official-vaccine-resources">Official resources</a>
    </nav>

    <div className="notice-strong" role="note"><strong>Safety overview.</strong> Benefits and side effects vary by vaccine. Serious reactions need emergency care: call 911 for signs of a severe allergic reaction. VAERS is for reporting, not emergency treatment. VIS snapshots do not replace current schedules, and some older statements contain outdated seasonal dosing, so dosing-specific sections are deliberately omitted. Not every vaccine has a VIS, and not all vaccines are routine.</div>

    <section id="vaccination-schedules" className="vx-section" aria-labelledby="sched-h">
      <div className="eyebrow">Schedules</div><h2 className="serif" id="sched-h">Timing by life stage.</h2>
      <p className="vx-status" data-testid="text-schedule-status">{scheduleStatus}</p>
      <p className="vx-status"><strong>Not a complete or personalized recommendation.</strong> {scheduleDisclaimer}</p>
      <div role="tablist" aria-label="Schedule groups" className="vx-tabs">
        {scheduleGroups.map((g) => <button key={g.id} role="tab" id={`tab-${g.id}`} aria-selected={tab === g.id} aria-controls="sched-panel" className={`filter-chip${tab === g.id ? ' active' : ''}`} onClick={() => setTab(g.id)} data-testid={`tab-schedule-${g.id}`}>{g.label}</button>)}
      </div>
      <div role="tabpanel" id="sched-panel" aria-labelledby={`tab-${group.id}`} className="vx-panel">
        <h3 className="serif">{group.title}</h3><p>{group.description}</p>
        <div className="condition-table-scroll"><table><caption className="sr-only">{group.title} schedule summary</caption>
          <thead><tr><th scope="col">Vaccine</th><th scope="col">Typical timing</th><th scope="col">Notes</th></tr></thead>
          <tbody>{group.rows.map((r) => <tr key={r.vaccine}><th scope="row">{r.vaccine}</th><td>{r.timing}</td><td>{r.notes}</td></tr>)}</tbody></table></div>
        <div className="res-links row"><Out href={group.sourceUrl} className="outlink-btn solid">Official CDC source page</Out>{group.links.map((l) => <Out key={l.url} href={l.url}>{l.label}</Out>)}</div>
      </div>
    </section>

    <section id="vaccine-fact-sheets" className="vx-section" aria-labelledby="facts-h">
      <div className="eyebrow">Fact sheets</div><h2 className="serif" id="facts-h">{vaccineFacts.length} vaccine references.</h2>
      <p className="vx-status">Covers the <Out href={vaccineIndexUrl} className="inline-out">CDC VIS index</Out>. Expand a record to read its summary; always follow the linked source.</p>
      <div className="library-controls"><div className="library-search"><Search size={17} aria-hidden="true" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vaccines" aria-label="Search vaccines" data-testid="input-vaccine-search" /></div>
        {cats.map((c) => <button key={c} type="button" className={`filter-chip${cat === c ? ' active' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
      <p className="result-count" aria-live="polite" data-testid="text-vaccine-count">{list.length} of {vaccineFacts.length} records</p>
      {list.length ? <div className="vx-list">{list.map((v) => {
        const isOpen = !!open[v.id];
        return <article className="vx-item" key={v.id} data-testid={`card-vaccine-${v.id}`}>
          <h3><button type="button" className="vx-toggle" aria-expanded={isOpen} aria-controls={`vx-${v.id}`} onClick={() => setOpen({ ...open, [v.id]: !isOpen })}><span><span className="card-meta">{v.category}</span><span className="vx-title">{v.title}</span></span><span className="vx-plus" aria-hidden="true">{isOpen ? '−' : '+'}</span></button></h3>
          <p className="vx-sum">{v.summary}</p>
          {isOpen && <div id={`vx-${v.id}`} className="vx-body">
            {v.sections.length === 0 && <p>This is an FDA-only reference. Read the full medication guide at the source link.</p>}
            {v.sections.map((s) => <section key={s.heading}><h4>{s.heading}</h4>
              {s.blocks && s.blocks.length ? s.blocks.map((b, i) => b.kind === 'list' ? <ul key={i}>{b.items?.map((it) => <li key={it}>{it}</li>)}</ul> : <p key={i}>{b.text}</p>)
                : <>{s.paragraphs.map((p) => <p key={p}>{p}</p>)}{s.points && s.points.length > 0 && <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>}</>}
            </section>)}
          </div>}
          <Out href={v.sourceUrl}>Source</Out>
        </article>;
      })}</div> : <div className="empty-state" data-testid="empty-vaccine-search"><Search size={25} /><h2>No vaccine records match</h2><p>Try another name or category.</p><button className="button-primary" onClick={reset} data-testid="button-reset-vaccines">Reset search and filters</button></div>}
    </section>

    <section id="official-vaccine-resources" className="vx-section"><div className="eyebrow">Keep reading</div><h2 className="serif">Official links.</h2>
      <div className="res-links row">{vaccineLearningLinks.map((l) => <Out key={l.url} href={l.url}>{l.label}</Out>)}</div></section>
    <div style={{ height: 50 }} />
  </main>;
}
