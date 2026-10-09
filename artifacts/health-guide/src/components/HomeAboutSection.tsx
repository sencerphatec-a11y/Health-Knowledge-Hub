import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import '../pages/AssistancePages.css';

export default function HomeAboutSection() {
  return <section id="about" className="shell section ap-about" aria-labelledby="about-h" data-testid="section-about">
    <div className="eyebrow">About this website</div>
    <h2 id="about-h" className="serif">Health Guide, in plain terms.</h2>
    <p className="ap-lead">Health Guide is an independent, source-linked reading room for anyone looking for medical-condition information or community support: individuals, families, caregivers, and neighbors.</p>
    <div className="ap-about-grid">
      <div>
        <h3>Who this is for</h3>
        <p>Anyone who needs help finding resources for medical conditions, community information, or both. You do not need an account or medical records to use these guides and resource searches.</p>
      </div>
      <div>
        <h3>What it helps with</h3>
        <ul>
          <li>Reading about <Link href="/conditions">conditions</Link> and <Link href="/medications">medications</Link>, with links to original sources.</li>
          <li>Finding national medical, <Link href="/find-food">food</Link>, and <Link href="/housing-assistance">housing</Link> resources, alongside West Des Moines local resources and the <Link href="/blog">community blog</Link>.</li>
          <li>Starting a search for a clinician through <Link href="/find-a-doctor">Find a Doctor</Link>, or browsing <Link href="/resources">resources</Link>.</li>
        </ul>
      </div>
      <div>
        <h3>What it is not</h3>
        <p>Health Guide does not give medical or legal advice, diagnose, or decide eligibility. It does not fund, accept applications for, or book services. Food and housing search links open external directories; physician listings appear in Find a Doctor.</p>
      </div>
    </div>
    <Link href="/resources" className="text-link">Browse resources <ArrowRight size={15} /></Link>
  </section>;
}
