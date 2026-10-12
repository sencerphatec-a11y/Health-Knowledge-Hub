export const drugInteractions = {
  search: {
    id: 'drug-interactions',
    href: '/drug-interactions',
    title: 'Drug Interactions: Medscape resources',
    category: 'Educational guide · External checker',
    summary: 'Learn about drug interactions and medication interactions, and how to use Medscape’s external Drug Interaction Checker. This is an educational guide, not a personalized interaction result or safety check. Discuss your medicines with a pharmacist or clinician.',
    keywords: ['Medscape', 'drug interactions', 'medication interactions', 'drug interaction checker', 'medicine interactions'],
  },
  checked: 'October 11, 2026',
  checkerUrl: 'https://reference.medscape.com/drug-interactionchecker',
  summary: 'Medscape’s Drug Interaction Checker lets you look up potential interactions among prescription medicines, over-the-counter products, and herbal supplements. Its reference information describes interaction mechanisms and clinical action categories, and may include common food interactions. Use it to prepare questions for your pharmacist or clinician—not to decide on treatment yourself.',
  steps: [
    {
      title: 'Prepare your complete medication list',
      text: 'Include prescription and over-the-counter medicines, vitamins, herbs, and supplements. Keep the exact product names, strengths, and how often you take them available for your healthcare team.',
    },
    {
      title: 'Open the Medscape checker',
      text: 'Search for each medicine on Medscape and select the matching result. Add prescription medicines, over-the-counter medicines, and herbal supplements that the checker recognizes, then review the interaction details. Ask a pharmacist about anything you cannot find. Medscape is geared toward healthcare professionals; if prompted to sign in or register, follow the instructions on its site.',
    },
    {
      title: 'Discuss the results before making changes',
      text: 'Share the results and your full list with a pharmacist or clinician. They can consider your doses, timing, medical conditions, and other factors that an online checker cannot fully assess. Do not start, stop, or change a medicine based only on a checker result.',
    },
  ],
  ratings: [
    { name: 'Contraindicated', meaning: 'Medscape indicates that the risks of using the medicines together outweigh the benefits. Ask your clinician or pharmacist promptly about the appropriate next step; do not change treatment on your own.' },
    { name: 'Serious – Use Alternative', meaning: 'Medscape advises clinicians to avoid the combination or consider an alternative. If the combination is unavoidable, professional management or dose changes may be needed.' },
    { name: 'Monitor Closely', meaning: 'Medscape advises monitoring for increased effects, adverse effects, or reduced effectiveness. Results may also label this category “Significant – Monitor Closely.” Your healthcare team determines what monitoring you need.' },
    { name: 'Minor', meaning: 'Medscape describes interactions without clinically meaningful differences or with unknown effects. This does not guarantee safety for an individual, especially when information is limited.' },
  ],
  links: [
    { label: 'Open Medscape Interaction Checker', url: 'https://reference.medscape.com/drug-interactionchecker' },
    { label: 'Medscape Tools & Reference', url: 'https://reference.medscape.com/' },
  ],
};
