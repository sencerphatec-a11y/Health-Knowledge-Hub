export const resourceChecked = 'October 9, 2026';

export const supportResources = [
  {
    id: 'eldercare', title: 'Eldercare Locator', organization: 'Administration for Community Living · U.S. government',
    summary: 'Find services for older adults and their families in your community through the official Eldercare Locator.',
    highlights: ['Search by location for local aging services', 'Find community support for independent living and caregiving', 'Speak with trained staff about available resources'],
    contact: { label: 'Call 1-800-677-1116', url: 'tel:18006771116' },
    links: [{ label: 'Visit Eldercare Locator', url: 'https://eldercare.acl.gov/' }],
    limitations: 'Local availability and eligibility vary. Health Guide does not submit requests or determine eligibility.',
  },
  {
    id: 'patient-advocate', title: 'Patient Advocate Foundation', organization: 'Independent nonprofit patient-support organization',
    summary: 'Get help navigating access to care, insurance challenges, and available financial assistance.',
    highlights: ['Explore case-management services and patient education', 'Find financial assistance programs and eligibility details', 'Use Medicare and insurance resources'],
    contact: { label: 'Call 1-800-532-5274', url: 'tel:18005325274' },
    links: [
      { label: 'Visit Patient Advocate Foundation', url: 'https://www.patientadvocate.org/' },
      { label: 'Case-management services', url: 'https://www.patientadvocate.org/connect-with-services/case-management-services/' },
      { label: 'Patient education library', url: 'https://education.patientadvocate.org/' },
      { label: 'TotalAssist financial assistance', url: 'https://totalassist.org/' },
    ],
    limitations: 'Programs have eligibility requirements and may depend on available funding. Assistance is not guaranteed.',
  },
  {
    id: 'usa-gov', title: 'USA.gov', organization: 'Official U.S. government information and services',
    summary: 'Find government benefits, health information, disability services, and help understanding how to apply.',
    highlights: ['Explore benefits and financial assistance', 'Find health-insurance and medical-bill resources', 'Locate disability services and other government programs'],
    links: [
      { label: 'Visit USA.gov', url: 'https://www.usa.gov/' },
      { label: 'Find government benefits', url: 'https://www.usa.gov/benefit-finder' },
      { label: 'Health resources', url: 'https://www.usa.gov/health' },
      { label: 'Disability services', url: 'https://www.usa.gov/disability-services' },
    ],
    limitations: 'USA.gov helps you find official programs. Individual agencies decide eligibility and process applications.',
  },
];

export const goodRxInfo = {
  summary: 'GoodRx is a commercial service that lets you compare prescription prices at pharmacies and find discount coupons. GoodRx is not insurance.',
  steps: [
    { title: 'Find the exact prescription', text: 'On GoodRx, check the medicine name, strength, dosage form, and quantity against your prescription. Ask your pharmacist if you are unsure.' },
    { title: 'Compare pharmacy prices', text: 'Compare nearby pharmacy offers on GoodRx. Ask the pharmacy to confirm the current price; location, quantity, and coupon terms can change the amount.' },
    { title: 'Choose a coupon', text: 'Get the coupon on GoodRx and present it to your pharmacist before paying. Health Guide does not generate coupons or collect prescription details.' },
    { title: 'Compare with your insurance', text: 'Ask the pharmacist to compare your insurance price with the coupon price. Do not assume a coupon is cheaper or can be combined with insurance; check how paying outside insurance affects your plan.' },
  ],
  cautions: [
    'Savings and pharmacy acceptance are not guaranteed. Health Guide does not display live prices or verify discounts.',
    'Free coupons and optional paid memberships are different offerings. Review GoodRx’s current terms before signing up.',
    'Do not change a medicine, dose, or pharmacy treatment plan without speaking with your prescriber or pharmacist.',
    'GoodRx is an external commercial website with its own privacy policy. These are informational links, not an endorsement or an integrated price service.',
  ],
  links: [
    { label: 'Visit GoodRx', url: 'https://www.goodrx.com/' },
    { label: 'Search prescriptions on GoodRx', url: 'https://www.goodrx.com/search' },
    { label: 'How GoodRx works', url: 'https://www.goodrx.com/how-goodrx-works' },
  ],
};

export const resourceSources = [
  ...supportResources.map(resource => ({ id: `support-${resource.id}`, title: resource.title, organization: resource.organization, url: resource.links[0].url, description: `${resource.summary} Links checked ${resourceChecked}.` })),
  { id: 'goodrx-how', title: 'How GoodRx works', organization: 'GoodRx · commercial service', url: 'https://www.goodrx.com/how-goodrx-works', description: 'Primary source for prescription price comparison and coupon instructions. GoodRx is not insurance.' },
  { id: 'cdc-vis', title: 'Vaccine Information Statements', organization: 'Centers for Disease Control and Prevention', url: 'https://www.cdc.gov/vaccines/hcp/current-vis/index.html', description: 'Full CDC index of English vaccine fact sheets, including benefits, precautions, reactions, and serious-problem guidance.' },
  { id: 'cdc-schedules', title: 'Vaccine schedules for you and your family', organization: 'Centers for Disease Control and Prevention', url: 'https://www.cdc.gov/vaccines/imz-schedules/index.html', description: 'Official current childhood and adult schedules, with source dates, notes, and updates.' },
  { id: 'cdc-safety', title: 'Vaccine safety questions and concerns', organization: 'Centers for Disease Control and Prevention', url: 'https://www.cdc.gov/vaccine-safety/about/index.html', description: 'Official resources about vaccine safety, adverse effects, and precautions.' },
];
