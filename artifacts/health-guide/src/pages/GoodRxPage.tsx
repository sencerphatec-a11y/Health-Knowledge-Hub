import { goodRxInfo } from '../data/support-resources';
import { Out } from './shared';

export default function GoodRxPage() {
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / GoodRx</div><h1 className="serif">Prescription coupons, explained.</h1><p>{goodRxInfo.summary}</p></div>
    <div className="notice-strong" role="note"><strong>GoodRx is not insurance.</strong> Health Guide shows no live prices or coupons and cannot promise savings.</div>
    <section className="rx-grid">
      <div><div className="eyebrow">How it works</div><ol className="rx-steps">{goodRxInfo.steps.map((s, i) => <li key={s.title}><span className="feature-num">0{i + 1}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></div>
      <aside className="source-box"><h2>Go to GoodRx</h2><p className="source-note" style={{ marginTop: 0 }}>These open GoodRx, an external commercial site, in a new tab and leave Health Guide.</p>
        <div className="res-links">{goodRxInfo.links.map((l, i) => <Out key={l.url} href={l.url} className={`outlink-btn${i === 0 ? ' solid' : ''}`}>{l.label}</Out>)}</div></aside>
    </section>
    <section className="rx-cautions"><h2 className="serif">Before you use a coupon</h2><ul>{goodRxInfo.cautions.map((c) => <li key={c}>{c}</li>)}</ul></section>
    <div style={{ height: 50 }} />
  </main>;
}
