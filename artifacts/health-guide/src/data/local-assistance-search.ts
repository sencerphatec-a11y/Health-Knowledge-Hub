import { assistanceSources } from './assistance-resources';

export const assistanceStates: [string, string][] = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
  ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
  ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
  ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
  ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
  ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
  ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],
  ['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ['AS','American Samoa'],['GU','Guam'],['MP','Northern Mariana Islands'],['PR','Puerto Rico'],['VI','U.S. Virgin Islands'],
];

export type AssistanceTopic = 'food' | 'housing';
export interface SearchLocation { mode: 'city' | 'zip'; city: string; state: string; zip: string }
export interface LocalSearchLink { id: string; title: string; description: string; url: string }
const stateCodes = new Set(assistanceStates.map(([code]) => code));
// These reports were verified against the options in HUD's official PHA directory.
// That directory does not currently supply an American Samoa report.
const phaStateCodes = new Set([...stateCodes].filter(code => code !== 'AS'));

export function locationError(location: SearchLocation): string | null {
  if (location.mode === 'zip') return /^\d{5}$/.test(location.zip.trim()) ? null : 'Enter a five-digit ZIP code.';
  const city = location.city.trim();
  if (!city || city.length > 80 || !/^[\p{L}\p{N} .,'’()/\-]+$/u.test(city)) return 'Enter a city name (up to 80 characters), without wildcards.';
  return stateCodes.has(location.state.toUpperCase()) ? null : 'Choose a U.S. state or territory.';
}

export function normalizeSearchLocation(location: SearchLocation): SearchLocation {
  return location.mode === 'zip'
    ? { mode: 'zip', city: '', state: '', zip: location.zip.trim() }
    : { mode: 'city', city: location.city.trim(), state: location.state.toUpperCase(), zip: '' };
}

export function parseAssistanceLocation(search: string): SearchLocation | null {
  const params = new URLSearchParams(search);
  const zip = params.get('zip') || '';
  const location: SearchLocation = zip
    ? { mode: 'zip', zip, city: '', state: '' }
    : { mode: 'city', zip: '', city: params.get('city') || '', state: params.get('state') || '' };
  return locationError(location) ? null : normalizeSearchLocation(location);
}

export function assistanceLocationQuery(location: SearchLocation): string {
  const value = normalizeSearchLocation(location);
  const q = new URLSearchParams();
  if (value.mode === 'zip') q.set('zip', value.zip);
  else { q.set('city', value.city); q.set('state', value.state); }
  return q.toString();
}

export function assistanceLocationLabel(location: SearchLocation): string {
  return location.mode === 'zip' ? `ZIP ${location.zip}` : `${location.city}, ${location.state}`;
}

export function localSearchLinks(topic: AssistanceTopic, input: SearchLocation): LocalSearchLink[] {
  if (locationError(input)) return [];
  const location = normalizeSearchLocation(input);
  const where = location.mode === 'zip' ? location.zip : `${location.city}, ${location.state}`;
  const maps = (query: string) => `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query })}`;
  const links: LocalSearchLink[] = [];
  if (topic === 'food') {
    if (location.mode === 'zip') links.push({
      id: 'findhelp-pantries', title: `Food pantry programs for ZIP ${location.zip}`,
      description: 'Open findhelp’s food-pantry results for this ZIP. This independent directory may include nearby programs that serve your area; contact the program to confirm its requirements and hours.',
      url: `https://www.findhelp.org/food/food-pantry?${new URLSearchParams({ postal: location.zip })}`,
    });
    links.push({
      id: 'pantry-maps', title: `Search food pantries near ${where}`,
      description: 'Google Maps searches using your entered location. These are third-party discovery results, not verified pantry availability or eligibility. Call before traveling.',
      url: maps(`food pantries near ${where}`),
    }, {
      id: 'feeding-america', title: 'Find a food bank and its partner pantries',
      description: 'On Feeding America’s official locator, enter your ZIP code or choose your state. Contact the food bank for partner pantries and meal programs; the warehouse itself may not offer direct pickup.',
      url: assistanceSources.feedingAmerica,
    }, {
      id: 'hud-food', title: 'HUD’s food-pantry and shelter locator',
      description: 'Choose Food Pantries on HUD Find Shelter, enter your location again, and search. Confirm current services directly with the listed provider.',
      url: assistanceSources.shelter,
    });
  } else {
    if (location.mode === 'city' && phaStateCodes.has(location.state)) links.push({
      id: 'state-pha', title: `${assistanceStates.find(([code]) => code === location.state)?.[1]} housing-agency contacts (official HUD PDF)`,
      description: `HUD’s statewide agency list, not a city-only result list. Search the PDF for ${location.city} or your county, and ask which agency serves your address and administers Section 8. Agency listings do not show current waiting-list openings.`,
      url: `https://www.hud.gov/sites/dfiles/PIH/documents/PHA_Contact_Report_${location.state}.pdf`,
    });
    if (location.mode === 'zip') links.push({
      id: 'findhelp-housing', title: `Housing-cost assistance programs for ZIP ${location.zip}`,
      description: 'Open findhelp’s housing-cost assistance directory for this ZIP. Results can include rent, utility, or other housing support; confirm the type of assistance, service area, eligibility, and funding.',
      url: `https://www.findhelp.org/housing/help-pay-for-housing?${new URLSearchParams({ postal: location.zip })}`,
    });
    links.push({
      id: 'housing-maps', title: `Look up housing agencies near ${where}`,
      description: 'Search Google Maps for public housing agencies using your location. A nearby office may not serve your address: verify its identity and jurisdiction using HUD’s official directory before applying.',
      url: maps(`public housing authority Section 8 near ${where}`),
    }, {
      id: 'official-pha', title: 'Official HUD public housing agency directory',
      description: 'Select your state on HUD’s directory and contact the agency serving your city or county. Ask about Section 8, public housing, application instructions, and waiting lists.',
      url: assistanceSources.pha,
    }, {
      id: 'hud-counselor', title: 'Find a HUD-participating housing counselor',
      description: 'Enter your ZIP code or state again in HUD’s locator and choose the service you need. If it does not load, call 800-569-4287 for help.',
      url: assistanceSources.counselor,
    });
  }
  return links;
}
