import { Out } from '../../pages/shared';

export function CrisisSupport({ selfHarm }: { selfHarm: boolean }) {
  return <>
    {selfHarm && <div className="qn-alert qn-alert-urgent" role="alert" data-testid="alert-self-harm">
      <h2>Please reach out for support now</h2>
      <p>You marked a thought of being better off dead or of hurting yourself. Prompt support from a professional is recommended, whatever the rest of your answers or any total score. In the U.S., call or text <a href="tel:988">988</a> (<a href="sms:988">text 988</a>) to reach the 988 Suicide and Crisis Lifeline, or use chat at the link below.</p>
      <p><strong>If you are in immediate danger or cannot stay safe, call <a href="tel:911">911</a> or go to the nearest emergency department.</strong> Consider telling a trusted person near you, and ask them to stay with you.</p>
      <div className="qn-row"><a className="outlink-btn solid" href="tel:988" data-testid="link-call-988">Call 988</a><a className="outlink-btn" href="sms:988" data-testid="link-text-988">Text 988</a><Out href="https://988lifeline.org/">988 chat and support</Out></div>
    </div>}
    <aside className="qn-support" aria-label="Crisis support" data-testid="panel-crisis-support">
      <strong>Support is available any age, any time.</strong> In the U.S., call or text <a href="tel:988">988</a> (<a href="sms:988">text</a>) or visit <Out href="https://988lifeline.org/" className="inline-out">988lifeline.org</Out>. In immediate danger, call <a href="tel:911">911</a>. Outside the U.S., contact your local emergency or crisis service. A low score cannot establish safety or rule out a need for support.
    </aside>
  </>;
}

export function MedicalAlert() {
  return <div className="qn-alert qn-alert-urgent" role="alert" data-testid="alert-urgent-medical">
    <h2>Possible medical emergency</h2>
    <p>You reported current severe symptoms. Stop and do not exercise. <strong>In the U.S., call <a href="tel:911">911</a> now</strong> or have someone take you to an emergency department. Elsewhere, call your local emergency number. Do not drive yourself.</p>
    <div className="qn-row"><a className="outlink-btn solid" href="tel:911" data-testid="link-call-911">Call 911</a></div>
  </div>;
}

export function Limits({ exercise }: { exercise: boolean }) {
  return <div className="disclaimer" role="note" data-testid="notice-questionnaire-limits">
    <strong>Education, not diagnosis.</strong> These reflections are not a diagnosis, medical advice, or clearance to exercise, and cannot replace a clinician.
    {exercise && <> This custom exercise reflection is original and is <strong>not</strong> the PAR-Q or PAR-Q+; it does not replace the official PAR-Q+, which cannot be embedded here without permission. Official: <Out href="https://eparmedx.com/print-versions-of-par-q/" className="inline-out">PAR-Q print versions</Out> and <Out href="https://eparmedx.com/?page_id=75" className="inline-out">PAR-Q+ information</Out>.</>}
  </div>;
}

export function Privacy() {
  return <p className="qn-small" data-testid="text-privacy">Your answers exist only in this tab's memory. Health Guide does not save or submit them, or put them in the page address. Reloading or changing tools clears them. Use Clear answers before leaving a shared device. External resources follow their own privacy policies.</p>;
}
