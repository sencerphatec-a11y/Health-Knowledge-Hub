import { ExternalLink } from 'lucide-react';

const src = `${import.meta.env.BASE_URL}pulsecare/index.html`;

export default function PulseCarePage() {
  return <main className="shell pc-wrap">
    <div className="pc-head animate-arrive">
      <div className="eyebrow">The reading room / PulseCare</div>
      <h1>PulseCare patient portal.</h1>
      <p>PulseCare is an educational prototype that uses sample data. Appointments, refills, payment, telehealth, and clinical assessments are not connected or live.</p>
    </div>
    <div className="pc-actions">
      <a className="text-link" href={src} target="_blank" rel="noreferrer" data-testid="link-pulsecare-fullscreen">Open full screen <ExternalLink size={14} /></a>
    </div>
    <div className="pc-frame">
      <iframe
        title="PulseCare educational patient portal prototype (sample data)"
        src={src}
        sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
        referrerPolicy="no-referrer"
        data-testid="iframe-pulsecare"
      />
    </div>
  </main>;
}
