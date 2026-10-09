export const assistanceChecked = 'October 9, 2026';

export interface AssistanceLink { label: string; url: string }
export interface AssistanceProgram {
  id: string;
  name: string;
  type: string;
  summary: string;
  eligibility: string;
  cost: string;
  nextSteps: string[];
  links: AssistanceLink[];
}

export const assistanceSources = {
  feedingAmerica: 'https://www.feedingamerica.org/find-your-local-foodbank',
  findhelp: 'https://www.findhelp.org/',
  food211: 'https://www.211.org/get-help/food-programs-food-benefits',
  housing211: 'https://www.211.org/get-help/housing-expenses',
  pha: 'https://www.hud.gov/contactus/public-housing-contacts',
  counselor: 'https://www.hud.gov/findacounselor',
  shelter: 'https://www.hud.gov/findshelter',
  vouchers: 'https://www.usa.gov/housing-voucher-section-8',
  emergencyRent: 'https://www.usa.gov/emergency-pay-rent',
  publicHousing: 'https://www.hud.gov/helping-americans/public-housing-programs',
  fraud: 'https://www.hudoig.gov/sites/default/files/2024-08/fraud_bulletin-fake_hcv_waitlists_508.pdf',
};

export const foodPrograms: AssistanceProgram[] = [
  {
    id: 'moms-meals', name: "Mom’s Meals", type: 'Prepared meal delivery • commercial provider',
    summary: 'Prepared meals delivered to the home, with menu options for different nutrition needs. Individuals and caregivers can explore direct purchase or qualifying program benefits.',
    eligibility: 'Some Medicaid, Medicare Advantage, Older Americans Act, and PACE participants may qualify through a plan or program. Coverage is not automatic: contact the plan, case manager, service coordinator, or Area Agency on Aging. Self-pay options are also available.',
    cost: 'Self-pay customers pay for meals and any applicable delivery charges. Covered benefits depend on the specific plan or program; do not assume that Medicare or Medicaid membership alone makes meals free.',
    nextSteps: [
      'Use the official eligibility guide and check your plan’s coverage documents.',
      'If purchasing directly, confirm the current meal prices, delivery availability, shipping fees, and order terms.',
      'Discuss dietary restrictions with your clinician or dietitian, and ask the provider about suitable menus and allergens.',
    ],
    links: [
      { label: 'How to access Mom’s Meals', url: 'https://www.momsmeals.com/our-food-programs/ways-to-access-our-medically-tailored-meals' },
      { label: 'Self-pay information', url: 'https://www.momsmeals.com/our-food-programs/self-pay/' },
      { label: 'Meal and ordering FAQs', url: 'https://www.momsmeals.com/faqs/' },
    ],
  },
  {
    id: 'meals-from-heartland', name: 'Meals from the Heartland', type: 'Meal packaging & distribution • nonprofit',
    summary: 'An Iowa-based nonprofit whose volunteers package meals for children and families in Iowa, elsewhere in the United States, and around the world. Its work includes distribution through partners.',
    eligibility: 'This is a meal-packaging and hunger-relief organization, not a direct-to-home meal-ordering service. Receiving food depends on the distributing partner and its service area.',
    cost: 'There is no individual meal price or delivery benefit offered by Health Guide. Ask a local food pantry or distribution partner about obtaining food; do not assume walk-in pickup at the packaging center.',
    nextSteps: [
      'Read the official organization overview to understand how the meals reach communities.',
      'If you need food now, use the pantry search below or call 211 to find a local distribution program.',
      'If you want to help, visit the organization’s website for current meal-packaging, volunteer, and donation opportunities.',
    ],
    links: [
      { label: 'Meals from the Heartland website', url: 'https://mealsfromtheheartland.org/' },
      { label: 'About its hunger-relief work', url: 'https://mealsfromtheheartland.org/about' },
    ],
  },
  {
    id: 'meals-on-wheels', name: 'Meals on Wheels', type: 'Local meal & support programs • nonprofit network',
    summary: 'Meals on Wheels America connects visitors to independently operated local programs. Services may include home-delivered meals, community dining, nutrition support, and social connection.',
    eligibility: 'Programs generally serve adults age 60 or older who have difficulty shopping, cooking, or getting out. Age rules, needs assessments, referrals, service areas, and capacity vary by local provider.',
    cost: 'Depending on the local program and circumstances, meals may be free, have a suggested donation, or use a sliding fee scale. Confirm costs and any waiting list with the local program.',
    nextSteps: [
      'Enter your ZIP code in the official Find Meals and Services locator.',
      'Contact the listed local program to ask about eligibility, meal options, delivery, fees, and availability.',
      'Ask what application, assessment, or referral is needed. A caregiver can inquire for a loved one.',
    ],
    links: [
      { label: 'Find Meals on Wheels near you', url: 'https://www.mealsonwheelsamerica.org/find-meals-and-services/' },
      { label: 'What Meals on Wheels delivers', url: 'https://www.mealsonwheelsamerica.org/our-work/' },
    ],
  },
];

export const housingPrograms: AssistanceProgram[] = [
  {
    id: 'section-8', name: 'Section 8 / Housing Choice Vouchers', type: 'Longer-term rental assistance',
    summary: 'Housing Choice Vouchers can help eligible households pay rent for qualifying private housing. A local public housing agency (PHA) administers the program and pays its approved share to the landlord; the tenant pays the remaining share.',
    eligibility: 'The PHA determines eligibility using factors including annual gross household income, family size, and citizenship or eligible immigration status. Income limits vary by area. This website does not assess your eligibility.',
    cost: 'Applying to a housing authority for a voucher should not require an application fee. A voucher does not necessarily cover all rent. Do not pay someone to guarantee approval or a place on a waiting list.',
    nextSteps: [
      'Choose your city and state below and open HUD’s official PHA contact list for your state.',
      'Ask the agency whether it serves your city or county, operates a voucher program, and is currently accepting applications.',
      'Apply through the agency’s official process. Ask about required documents and how to keep your contact information updated.',
      'Expect that waiting lists may be long or closed. A listing is not confirmation of available vouchers or immediate help.',
    ],
    links: [
      { label: 'USA.gov: Section 8 eligibility and applying', url: assistanceSources.vouchers },
      { label: 'Find your official public housing agency', url: assistanceSources.pha },
      { label: 'HUD Housing Choice Voucher program', url: 'https://www.hud.gov/helping-americans/housing-choice-vouchers' },
    ],
  },
  {
    id: 'public-housing', name: 'Public housing & other affordable housing', type: 'Housing options managed locally',
    summary: 'Public housing and other affordable rental options are different from a tenant-based Section 8 voucher. Ask your housing agency about the programs and properties it manages or can refer you to.',
    eligibility: 'Property and program rules, income limits, occupancy requirements, and waiting lists differ. The office nearest to you is not necessarily the agency that serves your address.',
    cost: 'Rent and tenant payments depend on the particular housing program. Confirm all charges, application requirements, and lease terms directly with the official agency or property.',
    nextSteps: [
      'Find the PHA serving your city or county using HUD’s state contact list.',
      'Ask separately about public housing, vouchers, and any property-specific waiting lists.',
      'Confirm the application website and whether applications are currently open before sharing documents.',
    ],
    links: [
      { label: 'HUD public housing programs', url: assistanceSources.publicHousing },
      { label: 'Official PHA directory', url: assistanceSources.pha },
    ],
  },
  {
    id: 'emergency-rent', name: 'Emergency rent assistance', type: 'Short-term help & local referrals',
    summary: 'State, local, and nonprofit programs may help people facing a rent shortfall or housing instability. These programs are separate from the longer-term Section 8 voucher process.',
    eligibility: 'Requirements, eligible expenses, documentation, funding, and availability vary by state and local program. A directory entry does not mean funding is available or that an application will be approved.',
    cost: 'Confirm whether the program offers a grant, loan, referral, or another type of support. Health Guide does not distribute funds or take applications.',
    nextSteps: [
      'Call 211 and explain your city or ZIP code and that you need rental assistance.',
      'Use USA.gov and local program directories to find the correct administering organization.',
      'Ask about deadlines, required documents, funding, and whether they can help before a scheduled eviction or payment deadline.',
    ],
    links: [
      { label: 'USA.gov: emergency rent assistance', url: assistanceSources.emergencyRent },
      { label: '211 housing assistance information', url: assistanceSources.housing211 },
      { label: 'Call 211', url: 'tel:211' },
    ],
  },
  {
    id: 'housing-counseling', name: 'Housing counseling', type: 'Help understanding your options',
    summary: 'HUD-participating housing counseling agencies can help visitors understand housing options and related financial decisions. The official locator supports ZIP-code or state searches and rental-housing service filters.',
    eligibility: 'Ask the agency whether it offers the service you need and how to arrange an appointment. Counseling is not a voucher award, legal representation, or a promise of rental funding.',
    cost: 'Ask the agency about any applicable fees before agreeing to services. If the online locator is unavailable, HUD’s counseling phone line can help you find an agency.',
    nextSteps: [
      'Use HUD’s counseling locator and enter your ZIP code or state.',
      'Choose rental housing services or another relevant service and contact an agency.',
      'For locator assistance, call HUD at 800-569-4287.',
    ],
    links: [
      { label: 'Find a HUD-participating counselor', url: assistanceSources.counselor },
      { label: 'HUD housing counseling information', url: 'https://www.hud.gov/stat/sfh/housing-counseling' },
      { label: 'Call HUD: 800-569-4287', url: 'tel:8005694287' },
    ],
  },
  {
    id: 'shelter', name: 'Shelter & homelessness resources', type: 'Help when housing cannot wait',
    summary: 'HUD’s Find Shelter tool and local 211 services can point you toward shelters, food pantries, and community organizations. People experiencing or at risk of homelessness can ask about local homelessness-service providers.',
    eligibility: 'Shelter rules, intake arrangements, accessibility, family accommodation, and bed availability vary. Call the provider before traveling when possible.',
    cost: 'Ask the local provider about services and any requirements. A search result is not a reserved bed or guaranteed placement. For immediate danger or a life-threatening emergency, call 911.',
    nextSteps: [
      'Call 211 for local shelter referrals or open HUD’s Find Shelter tool.',
      'Choose a category, enter your location, and contact a listed provider.',
      'Ask about current space, intake times, transportation, accessibility, and what to bring.',
    ],
    links: [
      { label: 'HUD Find Shelter', url: assistanceSources.shelter },
      { label: 'USA.gov: emergency housing assistance', url: 'https://www.usa.gov/emergency-housing-assistance' },
      { label: 'Call 211', url: 'tel:211' },
    ],
  },
];
