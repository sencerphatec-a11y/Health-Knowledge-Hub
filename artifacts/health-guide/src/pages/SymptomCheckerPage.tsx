import { mayoSymptomChecker, localCommunityChecked } from '../data/local-community';
import { Out } from './shared';
import './CommunityHelp.css';

export default function SymptomCheckerPage() {
  const m = mayoSymptomChecker;
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / symptom checker</div><h1 className="serif">A symptom checker, and how to use it well.</h1><p>{m.summary}</p></div>
    <div className="ch-alert" role="alert"><strong>Not for emergencies. Call 911.</strong>Do not use this checker for an emergency. If symptoms may be life-threatening, call 911 right away instead of searching online.</div>
    <section className="ch-grid">
      <div>
        <div className="eyebrow">How it works</div>
        <ol className="ch-steps">{m.steps.map((s, i) => <li key={s.title}><span className="feature-num">0{i + 1}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol>
        <div className="ch-panel"><h2 className="serif">What it is not</h2>
          <ul><li>It is not a diagnosis.</li><li>It is not comprehensive; it covers only selected symptoms and possible causes.</li><li>It is not a substitute for care from a clinician.</li></ul></div>
        <div className="ch-panel"><h2 className="serif">Your information and privacy</h2>
          <p>Health Guide does not collect your symptoms, and it does not embed or reimplement the checker. Anything you enter is entered on Mayo Clinic’s website, and Mayo Clinic’s own privacy terms apply.</p>
          <p>Health Guide is independent and is not affiliated with Mayo Clinic.</p></div>
      </div>
      <aside className="source-box"><h2>Go to the source</h2>
        <p className="source-note" style={{ marginTop: 0 }}>These open Mayo Clinic, an external site, in a new tab and leave Health Guide.</p>
        <div className="res-links"><Out href={m.url} className="outlink-btn solid">Open Mayo Clinic’s Symptom Checker</Out><Out href={m.aboutUrl}>About the Symptom Checker</Out></div>
        <div className="ch-dates" style={{ marginTop: 18, gridTemplateColumns: '1fr' }}>
          <div><strong>About page published</strong>{m.aboutPublished}</div>
          <div><strong>Health Guide source check</strong>{localCommunityChecked}</div>
        </div>
      </aside>
    </section>
    <div style={{ height: 50 }} />
  </main>;
}
