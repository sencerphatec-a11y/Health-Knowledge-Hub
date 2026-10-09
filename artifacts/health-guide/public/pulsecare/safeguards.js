/* Integration layer for the user-provided PulseCare prototype.
 * Navigation and sample interactions are retained; nothing is submitted or stored.
 */
(() => {
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);

  // Use the same 50 source-linked conditions as the main Health Guide library.
  conditionsDatabase.splice(0, conditionsDatabase.length, ...(window.PULSECARE_CONDITIONS || []));
  window.renderConditions = (list) => {
    const container = document.getElementById('conditions-grid');
    container.replaceChildren();
    if (!list.length) {
      container.textContent = 'No matching conditions. Try another term.';
      return;
    }
    for (const condition of [...list].sort((a, b) => a.name.localeCompare(b.name))) {
      const card = document.createElement('div');
      card.className = 'bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3';
      card.innerHTML = `<h3 class="font-bold text-slate-800 text-base">${escapeHtml(condition.name)}</h3>
        <span class="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded">${escapeHtml(condition.cat)}</span>
        <p class="text-sm text-slate-600">${escapeHtml(condition.summary)}</p>
        <a class="text-sm font-semibold text-sky-700 underline" href="../conditions/${encodeURIComponent(condition.id)}" target="_blank" rel="noopener noreferrer">Read the condition guide</a>
        <p class="text-xs text-slate-500">Source: <a class="underline" href="${escapeHtml(condition.sourceUrl)}" target="_blank" rel="noopener noreferrer">MedlinePlus · U.S. National Library of Medicine</a></p>`;
      container.appendChild(card);
    }
  };

  // Remove generic preparation rules that could conflict with facility instructions.
  for (const guide of diagnosticGuides) {
    guide.prep = 'Follow the instructions from your ordering clinician and testing facility. Fasting, contrast, and medication directions depend on your situation.';
    guide.recovery = 'Ask the testing facility what to expect, including whether sedation or a ride home is needed.';
  }

  window.filterBodyRegion = (region) => {
    document.querySelectorAll('.region-btn').forEach((button) => {
      const active = button.getAttribute('onclick')?.includes(`'${region}'`);
      button.className = active
        ? 'region-btn border border-sky-600 bg-sky-50 text-sky-700 font-medium py-2 px-3 rounded-lg text-xs text-center'
        : 'region-btn border border-slate-200 hover:bg-slate-50 font-medium py-2 px-3 rounded-lg text-xs text-center';
    });
    renderSymptomChecklist(region);
  };

  const moduleNotes = {
    'symptom-checker': ['An educational checklist, not a validated assessment. A missing red flag does not mean you are safe.', 'https://medlineplus.gov/ency/article/001927.htm', 'Recognizing medical emergencies'],
    'vaccine-hub': ['The vaccine schedules and clinic choices below are incomplete examples, not current personalized recommendations. The booking form only previews a demo.', 'https://www.cdc.gov/vaccines/hcp/imz-schedules/index.html', 'Current CDC immunization schedules'],
    'drug-directory': ['This five-medicine sample is not the full directory. Interaction and pill tools cannot determine safety or identity. Use the full product-label catalog and a pharmacist.', '../medications', 'Full Health Guide medication catalog'],
    'medicare-navigator': ['This is an informational prototype, not a benefits determination. Example premiums and plan descriptions are not live rates.', 'https://www.medicare.gov/', 'Official Medicare information'],
    'patient-portal': ['All patient details, test results, prescriptions, messages, bills, and appointments shown here are sample records. No account or healthcare service is connected. Do not enter identifying information.', null, null],
    'conditions-library': ['50 curated common conditions, alphabetically listed—not an official prevalence ranking. Summaries are sourced from MedlinePlus.', '../conditions', 'Full Conditions library'],
    'find-doctor': ['Fictional providers, ratings, and insurance examples. These are not verified clinicians, and booking buttons do not request appointments.', 'https://www.medicare.gov/care-compare/', 'Find real providers on Medicare Care Compare'],
    'diagnostic-guide': ['Example durations and prices only. This calculator is not an insurance quote or a personal cost estimate; ask your facility and insurer for actual instructions and costs.', 'https://medlineplus.gov/lab-tests/', 'MedlinePlus medical tests'],
    'mental-health': ['Reflection questions only. This is not a PHQ-9, GAD-7, clinical score, or diagnosis. Speak with a professional if concerned; call/text 988 for U.S. crisis support.', 'https://www.nimh.nih.gov/health/find-help', 'Find mental health help'],
    'preventive-blog': ['The article previews and discussion checklist are general education, not a personalized screening plan.', 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics/uspstf-a-and-b-recommendations', 'USPSTF preventive recommendations'],
  };

  const originalOnload = window.onload;
  window.onload = (event) => {
    originalOnload?.(event);
    for (const [id, [text, href, label]] of Object.entries(moduleNotes)) {
      const note = document.createElement('div');
      note.className = 'p-4 rounded-xl text-sm bg-amber-50 text-amber-950 border border-amber-300';
      note.setAttribute('role', 'note');
      note.textContent = text;
      if (href) {
        const link = document.createElement('a');
        link.className = 'block mt-2 font-semibold text-sky-700 underline';
        link.textContent = label;
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        note.appendChild(link);
      }
      document.getElementById('mod-' + id)?.prepend(note);
    }
    resetSymptomChecker();
    // None of these sample fields need real contact information.
    document.querySelectorAll('input[type="email"], input[type="tel"]').forEach((input) => {
      input.disabled = true;
      input.placeholder = 'Demo — no personal contact details';
    });
    document.querySelectorAll('button').forEach((button) => {
      if (button.textContent.trim() === 'Calculate Score') button.textContent = 'Read Reflection Guidance';
    });
    if (window.lucide) lucide.createIcons();
  };
})();
