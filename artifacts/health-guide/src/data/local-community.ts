export const localCommunityChecked = 'October 9, 2026';

export interface CommunityLink { label: string; url: string }
export interface LocalResource {
  id: string;
  title: string;
  category: string;
  serviceArea: string;
  summary: string;
  notes: string;
  links: CommunityLink[];
}

export const localResources: LocalResource[] = [
  {
    id: 'wdm-human-services', title: 'West Des Moines Human Services', category: 'Basic needs',
    serviceArea: 'West Des Moines and designated western suburbs',
    summary: 'City programs connect qualifying households with food, clothing, personal-care items, financial assistance, and other practical support.',
    notes: 'Eligibility and the service area differ by program. Contact the department before applying or visiting.',
    links: [{ label: 'Visit Human Services', url: 'https://www.wdm.iowa.gov/government/human-services' }],
  },
  {
    id: 'wdm-library', title: 'West Des Moines Public Library', category: 'Learning & connection',
    serviceArea: 'West Des Moines',
    summary: 'Find books, digital materials, learning programs, and community events for children, teens, adults, and older neighbors.',
    notes: 'Check library-card rules, event registration, and current hours on the library website.',
    links: [{ label: 'Visit the library', url: 'https://www.wdmlibrary.org/' }],
  },
  {
    id: 'wdm-parks', title: 'West Des Moines Parks & Recreation', category: 'Recreation & culture',
    serviceArea: 'West Des Moines',
    summary: 'Explore city parks, trails, recreation programs, and places to get outdoors and spend time with neighbors.',
    notes: 'Registration, fees, accessibility, and seasonal opening details vary by facility or program.',
    links: [{ label: 'Explore Parks & Recreation', url: 'https://www.wdm.iowa.gov/government/parks-recreation' }],
  },
  {
    id: 'wdmcs-resources', title: 'West Des Moines Community Schools — Community Resources', category: 'Family & education',
    serviceArea: 'WDMCS families and school communities',
    summary: 'A district directory of food assistance, financial support, internet resources, and wellness and mental-health information for families.',
    notes: 'School-district boundaries are not the same as city boundaries. Linked programs set their own eligibility requirements.',
    links: [{ label: 'Find family resources', url: 'https://www.wdmcs.org/engage/community-resources' }],
  },
  {
    id: 'wdmcs-foundation', title: 'West Des Moines Community Schools Foundation', category: 'Family & education',
    serviceArea: 'West Des Moines Community School District',
    summary: 'Supports student participation and classroom enrichment through its Student Support and Teacher Grant programs.',
    notes: 'This is a school-support foundation, not a general emergency-assistance office. Contact it about program access and giving.',
    links: [{ label: 'Visit the schools foundation', url: 'https://www.wdmcsfoundation.org/' }],
  },
  {
    id: 'wdm-history', title: 'West Des Moines Historical Society', category: 'Recreation & culture',
    serviceArea: 'West Des Moines',
    summary: 'Connect with local history through the Jordan House and Bennett School museums, educational programs, and community history events.',
    notes: 'Confirm tour availability, admission costs, and event details before visiting.',
    links: [{ label: 'Explore local history', url: 'https://www.wdmhs.org/' }],
  },
  {
    id: 'wdm-community-foundation', title: 'West Des Moines Community Foundation', category: 'Community support',
    serviceArea: 'West Des Moines',
    summary: 'An affiliate of the Community Foundation of Greater Des Moines that directs philanthropic support to local programs, recreation, trails, arts, and culture.',
    notes: 'Its grants are for qualifying organizations and government entities, not individual emergency-aid applications.',
    links: [{ label: 'Visit the community foundation', url: 'https://www.desmoinesfoundation.org/affiliates/polk-county/west-des-moines-community-foundation' }],
  },
  {
    id: 'wdm-community-education', title: 'WDMCS Community Education', category: 'Family & education',
    serviceArea: 'West Des Moines Community School District and community participants',
    summary: 'Find classes, before- and after-school care, intercultural outreach, service opportunities, and information about using school facilities.',
    notes: 'This is distinct from the district’s assistance directory. Program ages, fees, registration, and availability vary; confirm details with Community Education.',
    links: [{ label: 'Explore Community Education', url: 'https://communityed.wdmcs.org/' }],
  },
  {
    id: 'valley-junction', title: 'Historic Valley Junction Foundation', category: 'Recreation & culture',
    serviceArea: 'Historic Valley Junction, West Des Moines',
    summary: 'Explore local community events, family activities, arts, and neighborhood businesses in the historic Valley Junction district.',
    notes: 'Confirm current event dates, costs, and accessibility. Business listings are not an endorsement or a guarantee of free services.',
    links: [{ label: 'Explore Valley Junction', url: 'https://www.valleyjunction.com/' }],
  },
  {
    id: 'wdm-fire-safety', title: 'West Des Moines Fire Department — Community Safety', category: 'Health & wellbeing',
    serviceArea: 'West Des Moines',
    summary: 'Find fire-safety education, home-safety checklists, and community programs, including smoke-alarm assistance for qualifying residents.',
    notes: 'Contact the department about eligibility, arrangements, and any fees. This information page is not an emergency request service; call 911 for an emergency.',
    links: [{ label: 'Find community safety resources', url: 'https://www.wdm.iowa.gov/government/fire-department/community' }],
  },
  {
    id: 'dmarc', title: 'DMARC Food Pantry Network', category: 'Basic needs',
    serviceArea: 'Des Moines metro, including the West Des Moines Human Services pantry',
    summary: 'Find partner food pantries and learn about mobile food assistance and delivery options across the metro.',
    notes: 'Check the current pantry directory, hours, intake requirements, and delivery coverage. This is a regional network.',
    links: [{ label: 'Find food assistance', url: 'https://www.dmarcunited.org/food' }],
  },
  {
    id: 'aging-resources', title: 'Aging Resources of Central Iowa', category: 'Aging & caregiving',
    serviceArea: 'Central Iowa, including West Des Moines area counties',
    summary: 'Information and assistance for older adults, people with disabilities, and caregivers, including connections to nutrition, wellness, and family-caregiver resources.',
    notes: 'A regional agency, not a West Des Moines-only office. Ask about the services available for your home address and situation.',
    links: [{ label: 'Explore aging and caregiver support', url: 'https://www.agingresources.com/' }],
  },
  {
    id: 'everystep', title: 'EveryStep', category: 'Health & wellbeing',
    serviceArea: 'Regional and statewide Iowa programs',
    summary: 'A nonprofit offering home care, hospice, grief support, parenting support, and help navigating health and social-service systems.',
    notes: 'Program coverage, clinical eligibility, referrals, and costs differ. Not every program is available at every location.',
    links: [{ label: 'Explore EveryStep services', url: 'https://everystep.org/about' }],
  },
  {
    id: 'iowa-211', title: '211 Iowa', category: 'Basic needs',
    serviceArea: 'Statewide referral service, including West Des Moines',
    summary: 'A free information and referral service to help locate food, housing, utility assistance, and other community services. Call 211 or search online.',
    notes: '211 connects you with programs; it does not guarantee funding or approval. Call 911 for an immediate emergency.',
    links: [{ label: 'Find help through 211 Iowa', url: 'https://www.211iowa.org/' }],
  },
  {
    id: 'polk-health', title: 'Polk County Health Department', category: 'Health & wellbeing',
    serviceArea: 'Polk County and program-specific service areas',
    summary: 'Official public-health information, prevention resources, and links to clinical services such as STI testing.',
    notes: 'West Des Moines addresses can have different county service rules. Confirm your address, eligibility, appointments, and fees with the department.',
    links: [{ label: 'Visit the health department', url: 'https://www.polkcountyiowa.gov/health-department/' }],
  },
];

export interface GivingOpportunity {
  id: string;
  title: string;
  organization: string;
  kind: 'Donate' | 'Volunteer' | 'Donate & volunteer';
  serviceArea: string;
  summary: string;
  steps: string[];
  requirements: string;
  links: CommunityLink[];
}

export const givingOpportunities: GivingOpportunity[] = [
  {
    id: 'human-services-donations', title: 'Help stock food and essential supplies',
    organization: 'West Des Moines Human Services', kind: 'Donate', serviceArea: 'West Des Moines',
    summary: 'Support neighbors through financial gifts, nonperishable food, personal-care supplies, gently used clothing, or a coordinated collection drive.',
    steps: ['Review the current needs and accepted-item list before shopping or collecting.', 'Coordinate a drive with the department and confirm donation hours at 139 6th Street.', 'Use the city’s official giving page for financial gifts.'],
    requirements: 'Do not drop off unaccepted items. The department does not accept medical equipment, furniture, baby equipment, or damaged items. Needs and drop-off hours can change.',
    links: [
      { label: 'Donation needs & drop-off details', url: 'https://www.wdm.iowa.gov/government/human-services/ways-to-give/in-kind-donations' },
      { label: 'Official ways to give', url: 'https://www.wdm.iowa.gov/government/human-services/how-can-i-help-or-make-a-donation/donate-now-copy' },
    ],
  },
  {
    id: 'human-services-volunteers', title: 'Give time to neighbors who need support',
    organization: 'West Des Moines Human Services', kind: 'Volunteer', serviceArea: 'West Des Moines',
    summary: 'Explore Food Pantry, Food Rescue, Clothing Closet, and English Language Learner volunteer roles, including student and corporate opportunities.',
    steps: ['Review current roles and choose the appropriate volunteer application.', 'Complete the required release and any screening requested for your role.', 'Wait for staff to confirm your placement and schedule before arriving.'],
    requirements: 'The published minimum age is 14. Under-18 students need a parent or guardian release. Screening, fees, and exceptions vary by role; the city page contains differing background-check statements, so confirm the requirements with staff. Pantry and clothing roles are not advertised as one-time shifts.',
    links: [{ label: 'Volunteer roles & applications', url: 'https://www.wdm.iowa.gov/government/human-services/volunteer-opportunities' }],
  },
  {
    id: 'parks-volunteers', title: 'Care for a park or trail',
    organization: 'West Des Moines Parks & Recreation', kind: 'Volunteer', serviceArea: 'West Des Moines',
    summary: 'Organize a group to help keep local parks and trails clean through the city’s adoption program.',
    steps: ['Ask the city about available locations or a one-time project.', 'Submit an adoption form if joining the program and have each participant complete a waiver.', 'Follow the city’s safety guidance and report your cleanup results.'],
    requirements: 'Locations may already be adopted. Confirm a project with staff first; supplies and planning support are described on the city website.',
    links: [{ label: 'Adopt a Park or Trail', url: 'https://www.wdm.iowa.gov/government/parks-recreation/donations-volunteer-opportunities/adopt-a-park-or-trail' }],
  },
  {
    id: 'library-giving', title: 'Support learning for every generation',
    organization: 'West Des Moines Library Friends Foundation', kind: 'Donate', serviceArea: 'West Des Moines',
    summary: 'Membership donations support library materials, technology, and programs for children, teens, adults, and older residents.',
    steps: ['Read how the Friends Foundation supports the library.', 'Use the official Friends page to join, renew, or find its current fundraising options.', 'Contact the foundation directly with questions about your gift.'],
    requirements: 'This is support for the Friends Foundation, not a payment to Health Guide. Confirm gift terms with the foundation; no tax benefit is guaranteed here.',
    links: [{ label: 'Support the Library Friends Foundation', url: 'https://www.wdmlibrary.org/about/friends-foundation' }],
  },
  {
    id: 'schools-giving', title: 'Help students take part and teachers innovate',
    organization: 'West Des Moines Community Schools Foundation', kind: 'Donate', serviceArea: 'West Des Moines Community School District',
    summary: 'Contribute to student opportunities, teacher grants, or a selected foundation-supported school group.',
    steps: ['Explore the foundation’s Student Support and Teacher Grant programs.', 'Choose a giving option on its official donation page.', 'Ask the foundation how a restricted gift will be used before donating.'],
    requirements: 'School-district coverage differs from city boundaries. Confirm the intended program and any gift restrictions with the foundation.',
    links: [
      { label: 'Explore school-support programs', url: 'https://www.wdmcsfoundation.org/' },
      { label: 'Foundation donation information', url: 'https://www.wdmcsfoundation.org/make-an-impact/donate.html' },
    ],
  },
  {
    id: 'community-foundation-giving', title: 'Invest in local community projects',
    organization: 'West Des Moines Community Foundation', kind: 'Donate', serviceArea: 'West Des Moines',
    summary: 'Support community programs through general giving or funds focused on long-term support, recreation and trails, or arts and culture.',
    steps: ['Read the fund descriptions on the official affiliate page.', 'Follow its “View and Give” link to the foundation’s giving system.', 'Contact the foundation about gift restrictions, fund rules, and tax questions.'],
    requirements: 'Endowment and passthrough funds work differently. Tax treatment depends on the fund and your circumstances; consult the foundation or a qualified adviser.',
    links: [{ label: 'Explore local giving funds', url: 'https://www.desmoinesfoundation.org/affiliates/polk-county/west-des-moines-community-foundation' }],
  },
  {
    id: 'history-giving', title: 'Preserve West Des Moines stories',
    organization: 'West Des Moines Historical Society', kind: 'Donate', serviceArea: 'West Des Moines',
    summary: 'Support local history education and preservation through society membership or a financial contribution.',
    steps: ['Learn about the society’s museums and educational work.', 'Follow its official membership or donation link.', 'Contact the society before offering objects or other in-kind gifts.'],
    requirements: 'No volunteer placement or acceptance of historic items is promised. Ask the society about current needs and contribution terms.',
    links: [{ label: 'Membership & donation options', url: 'https://www.wdmhs.org/' }],
  },
  {
    id: 'dmarc-giving', title: 'Strengthen the metro food pantry network',
    organization: 'DMARC', kind: 'Donate & volunteer', serviceArea: 'Regional network, including West Des Moines',
    summary: 'Help fight food insecurity through food or financial gifts, volunteer service, or an organized drive supporting the network that includes the local Human Services pantry.',
    steps: ['Use DMARC’s “Get Involved” links to choose giving, volunteering, or a drive.', 'Confirm the location, accepted items, and requirements with the coordinator.', 'For a West Des Moines placement, ask about the local partner pantry rather than assuming every shift is in the city.'],
    requirements: 'Network opportunities can be elsewhere in the metro. Schedules, screening, and needs differ by activity.',
    links: [{ label: 'DMARC ways to help', url: 'https://www.dmarcunited.org/food' }],
  },
  {
    id: 'everystep-giving', title: 'Support care, families, and grief services',
    organization: 'EveryStep', kind: 'Donate & volunteer', serviceArea: 'Regional and statewide Iowa programs',
    summary: 'Explore financial giving and volunteer roles supporting EveryStep’s care programs, family services, and Giving Tree thrift store.',
    steps: ['Review current giving and volunteer options on EveryStep’s support page.', 'Ask which program and location would serve your intended community.', 'Complete the organization’s application and any required training before starting a role.'],
    requirements: 'Roles and programs are not all based in West Des Moines. Clinical or patient-facing opportunities may have additional requirements; placement is not guaranteed.',
    links: [{ label: 'EveryStep giving & volunteering', url: 'https://everystep.org/support' }],
  },
];

export const mayoSymptomChecker = {
  url: 'https://www.mayoclinic.org/symptom-checker/select-symptom/itt-20009075',
  aboutUrl: 'https://www.mayoclinic.org/about-this-site/about-symptom-checker',
  aboutPublished: 'September 15, 2015',
  summary: 'Mayo Clinic’s online Symptom Checker helps you explore possible causes of selected adult and child symptoms. It is an information tool, not a diagnosis or a substitute for a health-care professional.',
  steps: [
    { title: 'Choose an adult or child symptom', text: 'Open the official Mayo Clinic checker and select a symptom from the appropriate list.' },
    { title: 'Select related factors', text: 'Follow Mayo Clinic’s prompts about that symptom. You enter information on Mayo Clinic’s website, not Health Guide.' },
    { title: 'Read possible causes', text: 'Use the results as background for a conversation with your clinician, not as confirmation of a condition or a treatment plan.' },
  ],
};
