import { drugInteractions } from '../data/drug-interactions';
import { Out } from './shared';
import './CommunityHelp.css';

export default function DrugInteractionsPage() {
  return <main className="shell" data-testid="page-drug-interactions">
    <div className="page-heading animate-arrive">
      <div className="eyebrow">The reading room / drug interactions</div>
      <h1 className="serif">Understand potential drug interactions.</h1>
      <p>{drugInteractions.summary}</p>
    </div>
    <div className="notice-strong" role="note">
      <strong>Education, not a personalized safety check.</strong> Health Guide does not run an interaction checker or provide medical clearance. A “no interactions found” result does not guarantee a combination is safe.
    </div>
    <section className="ch-grid" aria-label="Using Medscape resources">
      <div>
        <h2 className="eyebrow">How to use the resources</h2>
        <ol className="ch-steps">
          {drugInteractions.steps.map((step, index) => <li key={step.title}>
            <span className="feature-num" aria-hidden="true">0{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
        <section className="ch-panel">
          <h2 className="serif">What should you discuss with your pharmacist?</h2>
          <ul>
            <li><strong>Medicine with medicine:</strong> prescription and over-the-counter products can change each other’s effects or increase side effects.</li>
            <li><strong>Food and alcohol:</strong> certain foods, beverages, or alcohol can affect how some medicines work.</li>
            <li><strong>Herbs and supplements:</strong> “natural” does not mean free of interactions; some products may not be listed or well studied.</li>
            <li><strong>Health conditions:</strong> a medicine may worsen an existing condition or need special precautions. An interaction checker does not replace a review of your medical history.</li>
          </ul>
        </section>
        <section className="ch-panel">
          <h2 className="serif">Understanding the ratings</h2>
          <p>Medscape describes interactions using clinical action categories. These are summaries of its definitions, not a personalized risk score. The results and action recommendations need interpretation by your healthcare team.</p>
          <ul>{drugInteractions.ratings.map((rating) => <li key={rating.name}><strong>{rating.name}:</strong> {rating.meaning}</li>)}</ul>
          <p style={{ marginTop: 12 }}><Out href={drugInteractions.checkerUrl}>Read Medscape’s About section and category definitions</Out></p>
        </section>
        <section className="ch-panel">
          <h2 className="serif">Your information and privacy</h2>
          <p>This page does not ask for, store, or send your medication list. The checker is not embedded here: anything you enter on Medscape is handled under that site’s own privacy policy and terms.</p>
          <p>Medscape is an external medical-information resource geared toward healthcare professionals. Health Guide is independent and is not affiliated with Medscape.</p>
        </section>
      </div>
      <aside className="source-box">
        <h2>Go to Medscape</h2>
        <p className="source-note" style={{ marginTop: 0 }}>These links leave Health Guide and open Medscape in a new tab.</p>
        <div className="res-links">{drugInteractions.links.map((link, index) =>
          <Out key={link.url} href={link.url} className={`outlink-btn${index === 0 ? ' solid' : ''}`}>{link.label}</Out>
        )}</div>
        <p className="source-note">Source: Medscape’s Drug Interaction Checker, including its About section and category definitions. Health Guide source check: {drugInteractions.checked}. This is our review date, not the source’s publication date; source content can change.</p>
      </aside>
    </section>
    <section className="rx-cautions">
      <h2 className="serif">When to get help</h2>
      <p>Contact your pharmacist or clinician promptly if you suspect an interaction or a new side effect. Do not wait for an online result to seek care.</p>
      <p><strong>For a possible life-threatening reaction, such as trouble breathing, collapse, or severe chest pain, call 911 in the U.S.</strong> Outside the U.S., use your local emergency number.</p>
    </section>
    <div style={{ height: 50 }} />
  </main>;
}
