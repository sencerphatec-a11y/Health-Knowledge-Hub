import { Link } from 'wouter';
import LocalAssistanceSearch from '../components/LocalAssistanceSearch';
import AssistanceProgramCard from '../components/AssistanceProgramCard';
import { Out } from '../pages/shared';
import { assistanceChecked, assistanceSources, housingPrograms } from '../data/assistance-resources';
import './AssistancePages.css';

export default function HousingAssistancePage() {
  return <main className="shell ap-page" data-testid="page-housing-assistance">
    <header className="ap-hero">
      <div className="eyebrow">Community resources</div>
      <h1>Housing assistance, <em>explained.</em></h1>
      <p className="ap-lead">A plain-language starting point for rental help, public housing, counseling, and shelter, with links to official sources. For individuals, families, and caregivers.</p>
      <p className="ap-note">Source links last checked {assistanceChecked}. Waiting lists may be long or closed, and no program here is guaranteed.</p>
    </header>

    <LocalAssistanceSearch topic="housing" />

    <aside className="ap-notice warn" role="note" data-testid="notice-housing-scams">
      <strong>Protect yourself from housing-assistance scams.</strong>
      <ul>
        <li>A housing authority should not charge an application fee for a voucher.</li>
        <li>Never pay anyone for promised approval or a better waiting-list position.</li>
        <li>Share Social Security numbers and documents only through an official agency portal you have verified.</li>
        <li>Health Guide is not HUD and does not collect applications, income, or health details.</li>
      </ul>
      <Out href={assistanceSources.fraud}>HUD OIG fraud bulletin (PDF)</Out>
    </aside>

    <section className="ap-section" aria-labelledby="housing-programs-h">
      <h2 id="housing-programs-h" className="serif">National housing resources</h2>
      <p className="ap-lead">Section 8 vouchers are not an immediate emergency grant, and public housing is a distinct program. Ask your local agency which options apply to you.</p>
      <div className="ap-grid">{housingPrograms.map((p) => <AssistanceProgramCard key={p.id} program={p} />)}</div>
    </section>

    <section className="ap-section ap-two" aria-labelledby="housing-local-h">
      <div>
        <h2 id="housing-local-h" className="serif">Close to home</h2>
        <p>For West Des Moines community news and local context, see the <Link href="/blog" className="text-link">community blog</Link>. Browse <Link href="/resources" className="text-link">more resources</Link> or <Link href="/find-food" className="text-link">find food</Link>.</p>
      </div>
      <div>
        <h2 className="serif">Health and housing</h2>
        <p>Health conditions can shape housing needs. Read the <Link href="/conditions" className="text-link">condition guides</Link> or <Link href="/find-a-doctor" className="text-link">find a doctor</Link> for medical questions.</p>
      </div>
    </section>

    <aside className="ap-notice" data-testid="notice-housing-scope">
      <strong>Scope of this page.</strong> This is general information, not legal or medical advice. Health Guide does not decide eligibility, distribute funds, take applications, or book appointments. Confirm everything with the official agency.
    </aside>
  </main>;
}
