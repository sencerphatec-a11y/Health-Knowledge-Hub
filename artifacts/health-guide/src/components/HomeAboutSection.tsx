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
    <div className="ap-credit" data-testid="site-creator-record">
      <div className="ap-credit-heading">
        <div>
          <div className="eyebrow">The story behind the site</div>
          <h3>Built and published by Phil.</h3>
          <p>Health Guide was created as an independent, source-linked place to make useful health and community information easier to find.</p>
        </div>
        <span className="ap-credit-badge">Independent project</span>
      </div>
      <dl className="ap-credit-facts">
        <div className="ap-credit-fact">
          <dt>Tracked workdays</dt>
          <dd>3 days</dd>
          <dd className="ap-credit-detail">October 9, 10 &amp; 11, 2026</dd>
        </div>
        <div className="ap-credit-fact">
          <dt>First published</dt>
          <dd><time dateTime="2026-10-09">October 9, 2026</time></dd>
          <dd className="ap-credit-detail">First recorded publication</dd>
        </div>
        <div className="ap-credit-fact">
          <dt>Latest publication</dt>
          <dd><time dateTime="2026-10-11">October 11, 2026</time></dd>
          <dd className="ap-credit-detail">Latest recorded publication</dd>
        </div>
      </dl>
      <div className="ap-credit-links">
        <a href="https://github.com/sencerphatec-a11y/Health-Knowledge-Hub/commits/main" target="_blank" rel="noreferrer">View project history <ArrowRight size={14} /></a>
        <a href="https://github.com/sencerphatec-a11y/Health-Knowledge-Hub/commit/70a1ba91b7c1bcc5ab397ce420f45e77444ee4a6" target="_blank" rel="noreferrer">View first publish record <ArrowRight size={14} /></a>
        <a href="https://github.com/sencerphatec-a11y/Health-Knowledge-Hub/commit/f4aebeb918dd94cb85562e887bc661cdecfbe4a4" target="_blank" rel="noreferrer">View latest publish record <ArrowRight size={14} /></a>
      </div>
      <p className="ap-credit-note">Workdays count distinct dates with GitHub commits authored as <code>philstaver</code>. Dates use Central Time (America/Chicago), checked October 12, 2026. This is a dated record of activity, not hours worked.</p>
    </div>
  </section>;
}
