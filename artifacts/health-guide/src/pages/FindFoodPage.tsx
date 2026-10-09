import { Link } from 'wouter';
import LocalAssistanceSearch from '../components/LocalAssistanceSearch';
import AssistanceProgramCard from '../components/AssistanceProgramCard';
import { Out } from '../pages/shared';
import { assistanceChecked, assistanceSources, foodPrograms } from '../data/assistance-resources';
import './AssistancePages.css';

export default function FindFoodPage() {
  return <main className="shell ap-page" data-testid="page-find-food">
    <header className="ap-hero">
      <div className="eyebrow">Community resources</div>
      <h1>Find food <em>near you.</em></h1>
      <p className="ap-lead">Food pantries, home-delivered meals, and hunger-relief programs, gathered as links to official and independent directories. Useful for individuals, families, and caregivers, including people managing a medical condition.</p>
      <p className="ap-note">Source links last checked {assistanceChecked}. Programs change, so confirm details directly.</p>
    </header>

    <LocalAssistanceSearch topic="food" />

    <section className="ap-section" aria-labelledby="food-programs-h">
      <h2 id="food-programs-h" className="serif">Meal delivery and hunger-relief programs</h2>
      <p className="ap-lead">These organizations work differently: some deliver prepared meals, while others package food for distribution through partners. Being listed is not an endorsement or a promise of availability where you live.</p>
      <div className="ap-grid">{foodPrograms.map((p) => <AssistanceProgramCard key={p.id} program={p} />)}</div>
    </section>

    <section className="ap-section ap-two" aria-labelledby="food-more-h">
      <div>
        <h2 id="food-more-h" className="serif">More directories</h2>
        <div className="ap-links-inline">
          <Out href={assistanceSources.findhelp}>findhelp</Out>
          <Out href={assistanceSources.food211}>211 food programs</Out>
          <Out href={assistanceSources.feedingAmerica}>Feeding America</Out>
        </div>
      </div>
      <div>
        <h2 className="serif">Local and related reading</h2>
        <p>Looking for West Des Moines community news? Read the <Link href="/blog" className="text-link">community blog</Link>. Browse <Link href="/resources" className="text-link">more resources</Link>, the <Link href="/conditions" className="text-link">condition guides</Link>, or <Link href="/housing-assistance" className="text-link">housing assistance</Link>.</p>
      </div>
    </section>

    <aside className="ap-notice" data-testid="notice-food-scope">
      <strong>Scope of this page.</strong> Health Guide is an independent reading room, not a food program, and does not take applications, deliver food, or decide eligibility. This is not medical advice. Questions about nutrition, diets, or allergies belong with a doctor or dietitian; you can <Link href="/find-a-doctor">find a doctor</Link> or read about <Link href="/medications">medications</Link>.
    </aside>
  </main>;
}
