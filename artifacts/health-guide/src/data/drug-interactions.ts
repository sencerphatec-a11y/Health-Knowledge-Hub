export const drugInteractions = {
  checked: 'October 11, 2026',
  checkerUrl: 'https://www.drugs.com/drug_interactions.html',
  summary: 'Drugs.com offers an external interaction checker and educational guides about how medicines can interact with other medicines, food, alcohol, supplements, and health conditions. Use these resources to prepare questions for your pharmacist or clinician—not to decide on treatment yourself.',
  steps: [
    {
      title: 'Prepare your complete medication list',
      text: 'Include prescription and over-the-counter medicines, vitamins, herbs, and supplements. Keep the exact product names, strengths, and how often you take them available for your healthcare team.',
    },
    {
      title: 'Open the Drugs.com checker',
      text: 'Enter medicine names on Drugs.com and select the matching products. Add the medicines and any supplements the tool recognizes, then review its interaction results and available food, alcohol, and condition warnings. Ask a pharmacist about anything you cannot find.',
    },
    {
      title: 'Discuss the results before making changes',
      text: 'Share the results and your full list with a pharmacist or clinician. They can consider your doses, timing, medical conditions, and other factors that an online checker cannot fully assess. Do not start, stop, or change a medicine based only on a checker result.',
    },
  ],
  ratings: [
    { name: 'Major', meaning: 'Signals a potentially highly significant interaction. A clinician or pharmacist should assess the combination and explain what action is appropriate.' },
    { name: 'Moderate', meaning: 'Signals a potentially significant interaction that may require avoiding the combination, closer monitoring, or professional management.' },
    { name: 'Minor', meaning: 'Generally indicates a less significant interaction, but it can still matter for an individual’s treatment or side effects.' },
    { name: 'Unknown', meaning: 'Interaction information is limited or unavailable. This is not confirmation that the combination is safe.' },
  ],
  links: [
    { label: 'Open Drugs.com Interaction Checker', url: 'https://www.drugs.com/drug_interactions.html' },
    { label: 'Medicine and alcohol information', url: 'https://www.drugs.com/article/medications-and-alcohol.html' },
    { label: 'Grapefruit and medicine information', url: 'https://www.drugs.com/article/grapefruit-drug-interactions.html' },
    { label: 'Visit Drugs.com', url: 'https://www.drugs.com/' },
  ],
};
