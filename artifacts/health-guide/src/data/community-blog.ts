export interface BlogSource {
  id: string;
  title: string;
  organization: string;
  url: string;
  published?: string;
}

export interface CommunityPost {
  slug: string;
  title: string;
  category: string;
  summary: string;
  published: string;
  status: 'Project update' | 'Upcoming event' | 'Community recap' | 'Ongoing resource';
  eventDate?: string;
  eventDetails?: string;
  sourceNote: string;
  sections: { heading: string; paragraphs: string[]; sourceIds: string[] }[];
  sourceIds: string[];
}

export const communityChecked = 'October 9, 2026';
export const communitySources: BlogSource[] = [
  { id: 'wdm-library-expansion', title: 'West Des Moines Public Library Expansion Project', organization: 'West Des Moines Public Library', url: 'https://www.wdmlibrary.org/WDMLibraryExpansion' },
  { id: 'wdm-library-year', title: 'FY2026 In Review', organization: 'West Des Moines Public Library', published: '2026-07-24', url: 'https://www.wdmlibrary.org/library-news/fy2026-review' },
  { id: 'wdm-iowa-files', title: 'Iowa Files History Series Returns for 8th Year', organization: 'West Des Moines Public Library', published: '2026-08-21', url: 'https://www.wdmlibrary.org/library-news/iowa-files-history-series-returns-8th-year' },
  { id: 'wdm-harmonica', title: 'Learn to play the harmonica with Blues musician Bob Pace', organization: 'West Des Moines Public Library', url: 'https://www.wdmlibrary.org/event/learn-play-harmonica-blues-musician-bob-pace-119537' },
  { id: 'wdm-library-calendar', title: 'Library homepage and upcoming event listings', organization: 'West Des Moines Public Library', url: 'https://www.wdmlibrary.org/' },
  { id: 'wdm-parks', title: 'Parks & Recreation', organization: 'City of West Des Moines', url: 'https://www.wdm.iowa.gov/government/parks-recreation' },
  { id: 'wdm-raccoon', title: 'Raccoon River Park amenities and notices', organization: 'City of West Des Moines', url: 'https://www.wdm.iowa.gov/government/parks-recreation/raccoon-river-park' },
  { id: 'wdm-human-services', title: 'Human Services programs, donations, and hours', organization: 'City of West Des Moines', url: 'https://www.wdm.iowa.gov/government/human-services' },
];

export const communityPosts: CommunityPost[] = [
  {
    slug: 'a-library-growing-with-west-des-moines',
    title: 'A library growing with West Des Moines',
    category: 'Learning & connection',
    summary: 'The public library’s expansion project offers a positive look at the future of shared spaces, lifelong learning, and neighborhood connection.',
    published: '2026-10-09',
    status: 'Project update',
    sourceNote: 'The project page does not display a publication date. This is an update on published plans, not an announcement that construction or a grand opening has occurred.',
    sourceIds: ['wdm-library-expansion'],
    sections: [
      { heading: 'More room for a community that keeps showing up', sourceIds: ['wdm-library-expansion'], paragraphs: [
        'Some of the most encouraging local developments are the ones that make everyday life a little more welcoming. The West Des Moines Public Library’s expansion project is one worth following: a plan to grow a familiar community resource at its existing location, 4000 Mills Civic Parkway.',
        'The library describes a $6.5 million project that would add more than 8,000 square feet. Planned additions include meeting and study rooms, a larger children’s area, dedicated outreach space, and a drive-up materials drop. These are plans described by the library—not a completed expansion or a confirmed opening date.',
      ] },
      { heading: 'A positive sign of shared curiosity', sourceIds: ['wdm-library-expansion'], paragraphs: [
        'The library’s project page compares service levels when the building opened in 1996 with the community’s current use. Annual circulation has grown from 439,980 to 845,187 items. That is an encouraging reminder that a library can remain a useful, shared resource as the city changes.',
        'For families, students, neighbors working on projects, and people looking for a place to learn, the proposal is about more than shelves. It focuses on the kinds of spaces where people can spend time, ask questions, and connect without needing to make a purchase.',
      ] },
      { heading: 'How to follow along', sourceIds: ['wdm-library-expansion'], paragraphs: [
        'Visit the library’s official project page to view the proposed layouts and read about ways to support the effort. Any donation should go through the library’s own channels; Health Guide does not collect money for this project.',
        'We will treat changes in funding, construction, and opening plans as separate updates that need their own confirmation. For now, the good news is a clearly described effort to make more room for the community.',
      ] },
    ],
  },
  {
    slug: 'iowa-files-a-free-invitation-to-learn-together',
    title: 'Iowa Files returns: a free invitation to learn together',
    category: 'Arts & culture',
    summary: 'The library and West Des Moines Historical Society are bringing neighbors together for an eighth season of local history programs.',
    published: '2026-10-09',
    status: 'Upcoming event',
    eventDate: '2026-10-18',
    eventDetails: '“Iowa Weird” · October 18, 2026 · 3–4 p.m. Central · West Des Moines Public Library Community Room',
    sourceNote: 'The library announced the series on August 21, 2026. The October program is a scheduled opportunity, not a recap of an event that has already happened.',
    sourceIds: ['wdm-iowa-files'],
    sections: [
      { heading: 'A community tradition with another chapter', sourceIds: ['wdm-iowa-files'], paragraphs: [
        'There is something positive about a local tradition that keeps making room for new questions. The Iowa Files History Program is back for an eighth year, presented jointly by the West Des Moines Public Library and the West Des Moines Historical Society.',
        'The library’s announcement describes monthly programs from September 2026 through May 2027. The series is free and open to the public, with support from community partners. That makes learning about Iowa a shared opportunity rather than an activity limited to people with a paid membership.',
      ] },
      { heading: 'A date to keep in mind', sourceIds: ['wdm-iowa-files'], paragraphs: [
        'The published schedule lists “Iowa Weird” for Sunday, October 18, from 3 to 4 p.m. in the library’s Community Room. As of our October 9 source check, this is an upcoming program. Confirm the details on the official schedule before making plans.',
        'The library also says the programs are livestreamed through the Historical Society’s Facebook page and YouTube channel. For residents who cannot attend in person, the official announcement is a useful starting point for finding those options.',
      ] },
      { heading: 'Keep the conversation going', sourceIds: ['wdm-iowa-files'], paragraphs: [
        'A history program can be a simple reason to spend an afternoon with a neighbor or family member and come away with something new to discuss. Check the full season’s schedule for other topics that interest you.',
        'This post highlights a verified local opportunity. It does not guarantee that an event will proceed unchanged; the organizers’ current listings take priority.',
      ] },
    ],
  },
  {
    slug: 'a-saturday-of-music-and-new-skills',
    title: 'A Saturday of music and new skills at the library',
    category: 'Arts & culture',
    summary: 'A scheduled harmonica program with musician Bob Pace gives school-age children, teens, and adults a chance to learn something together.',
    published: '2026-10-09',
    status: 'Upcoming event',
    eventDate: '2026-10-10',
    eventDetails: 'October 10, 2026 · 2–3 p.m. Central · West Des Moines Public Library · Ages 8 and up',
    sourceNote: 'The event page confirms the activity and age guidance; the library homepage lists the October 10 date and 2–3 p.m. time. No source publication date is displayed.',
    sourceIds: ['wdm-harmonica', 'wdm-library-calendar'],
    sections: [
      { heading: 'A small invitation to try something new', sourceIds: ['wdm-harmonica', 'wdm-library-calendar'], paragraphs: [
        'A positive weekend does not have to involve a big trip or a complicated plan. The West Des Moines Public Library is listing a music program with Bob Pace that invites participants to hear music, learn to play the harmonica, and join in.',
        'The library homepage lists the program for Saturday, October 10, 2026, from 2 to 3 p.m. The event description says it is for ages 8 and up, giving school-age children, teens, and adults a shared activity to consider.',
      ] },
      { heading: 'Local talent, shared learning', sourceIds: ['wdm-harmonica'], paragraphs: [
        'The library identifies Pace as a member of both the Iowa Blues Hall of Fame and the Iowa Rock ’n Roll Hall of Fame. The encouraging part of this listing is the opportunity to learn with a local musician in a familiar community setting.',
        'This is a preview, not a report that the program has already taken place. We have not invented an attendance count, participant reaction, or quote from the musician.',
      ] },
      { heading: 'Before you go', sourceIds: ['wdm-harmonica', 'wdm-library-calendar'], paragraphs: [
        'Open the official event listing for the latest details. If you need to know about supplies, accessibility, registration, or availability, check with the library rather than assuming those arrangements from this post.',
        'Even if this particular date does not work for you, the library’s current calendar offers a place to look for another local learning activity.',
      ] },
    ],
  },
  {
    slug: 'celebrating-a-year-of-library-connection',
    title: 'Celebrating a year of library connection',
    category: 'Learning & connection',
    summary: 'The library’s FY2026 review highlights rising event attendance, a new library system, and the building’s 30th anniversary.',
    published: '2026-10-09',
    status: 'Community recap',
    sourceNote: 'This recap draws on the library’s July 24, 2026 report about the fiscal year ending June 2026. It is not newly announced October news.',
    sourceIds: ['wdm-library-year'],
    sections: [
      { heading: 'A good year to look back on', sourceIds: ['wdm-library-year'], paragraphs: [
        'Not every positive community update needs to be breaking news. Sometimes a local organization’s year-end reflection gives us a useful reason to appreciate the work already happening close to home.',
        'In its FY2026 review, posted July 24, the West Des Moines Public Library reported a 4 percent increase in total event attendance, reaching 55,924. Those are reported attendance figures—not a claim that 55,924 different individual residents attended.',
      ] },
      { heading: 'Three decades of a shared place', sourceIds: ['wdm-library-year'], paragraphs: [
        'The report also marks the library building’s 30th anniversary and notes the launch of a new Integrated Library System. Together, these highlights reflect an institution maintaining a familiar community role while updating how it serves readers.',
        'The positive story here is participation: people continuing to use a public place for learning, activities, and everyday access to information. The full annual report provides more context than any short blog post can.',
      ] },
      { heading: 'Explore the full review', sourceIds: ['wdm-library-year'], paragraphs: [
        'Follow the original FY2026 review to reach the library’s annual report. It is a useful way to learn more about the services behind these highlights.',
        'We are sharing a look back, with the source’s original date preserved, so readers can celebrate the achievement without mistaking it for a new announcement.',
      ] },
    ],
  },
  {
    slug: 'room-to-walk-play-and-belong',
    title: 'Room to walk, play, and belong in West Des Moines',
    category: 'Parks & outdoors',
    summary: 'The city’s park and trail network, including Raccoon River Park’s inclusive playground, offers everyday ways to spend time together outside.',
    published: '2026-10-09',
    status: 'Ongoing resource',
    sourceNote: 'These are existing amenities described on city pages checked October 9, 2026—not newly opened parks. Check current closures and seasonal access before visiting.',
    sourceIds: ['wdm-parks', 'wdm-raccoon'],
    sections: [
      { heading: 'Good things that are already close by', sourceIds: ['wdm-parks'], paragraphs: [
        'An encouraging community story can be as simple as noticing the public places already available to us. West Des Moines Parks & Recreation describes a network of 31 parks and 81 miles of trails across more than 1,500 acres of managed land.',
        'For neighbors who enjoy being outdoors, that network offers options for finding a place to walk, meet a friend, or spend time with family. These figures describe existing city resources, not a new construction announcement.',
      ] },
      { heading: 'A park designed with different abilities in mind', sourceIds: ['wdm-raccoon'], paragraphs: [
        'At Raccoon River Park, the city describes an inclusive playground with more than 52,000 square feet of play equipment, seating areas, and nature-inspired landscaping. Its features include sensory play and sloping paths that provide different ways to reach play structures.',
        'The same park’s 3.2-mile nature trail circles Blue Heron Lake. The Athene Pedestrian Bridge, which the city says opened in October 2024, connects the park with Walnut Woods State Park and the regional trail network. It is an established connection—not a bridge newly opened this fall.',
      ] },
      { heading: 'Choose an outing that suits you', sourceIds: ['wdm-raccoon'], paragraphs: [
        'Check the city’s park page for current notices, access information, and amenity rules. Seasonal activities have different schedules, and this post does not promise that a playground, rental service, or swimming area is open on any particular day.',
        'Whether your plan is a short visit or a longer outing, the positive local takeaway is the range of shared spaces available. Choose a route and activity that fit your needs and the conditions that day.',
      ] },
    ],
  },
  {
    slug: 'neighbors-helping-neighbors-through-human-services',
    title: 'Neighbors helping neighbors through Human Services',
    category: 'Community support',
    summary: 'Food, clothing, and other assistance connect residents with practical help—and give neighbors a concrete way to support their community.',
    published: '2026-10-09',
    status: 'Ongoing resource',
    sourceNote: 'This highlights existing city assistance and donation programs. No new grant, fundraising total, or recent volunteer achievement is being claimed.',
    sourceIds: ['wdm-human-services'],
    sections: [
      { heading: 'Practical help is a positive community story', sourceIds: ['wdm-human-services'], paragraphs: [
        'One of the most meaningful forms of good news is knowing that help exists when a household faces a difficult stretch. West Des Moines Human Services describes programs for food, clothing, emergency rent and utility assistance, youth recreation, and other needs.',
        'The department says it assists more than 2,000 households in West Des Moines and surrounding western suburbs. That figure comes from the city’s program overview; it is not a new October achievement or a count measured by Health Guide.',
      ] },
      { heading: 'Two ways to connect', sourceIds: ['wdm-human-services'], paragraphs: [
        'If you need support, start with the department’s official page to find program details and contact information. Different services have different hours and eligibility rules, so confirm what applies to your household before visiting.',
        'If you are able to help, the city lists food and personal-care donation options and designated drop-off hours. Checking current needs first is a useful way to make a contribution that fits the program. Health Guide does not collect donations or applications.',
      ] },
      { heading: 'Keeping dignity at the center', sourceIds: ['wdm-human-services'], paragraphs: [
        'The department’s stated mission focuses on opportunities for healthy, stable, and productive lives. Its overview also emphasizes compassion and acceptance for people seeking assistance.',
        'This is a positive local resource worth knowing about, whether you need help yourself or want to support a neighbor. Visit the official source for up-to-date hours, weather-related closures, and program requirements.',
      ] },
    ],
  },
];

export const getCommunityPost = (slug: string) => communityPosts.find(post => post.slug === slug);
export const getCommunitySource = (id: string) => communitySources.find(source => source.id === id);

export function communityPostStatus(post: CommunityPost, now = new Date()) {
  if (!post.eventDate) return post.status;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  const today = `${value('year')}-${value('month')}-${value('day')}`;
  return post.eventDate < today ? 'Past event' : post.eventDate === today ? 'Today' : 'Upcoming event';
}
