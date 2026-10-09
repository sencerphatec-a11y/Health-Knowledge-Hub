import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Search } from 'lucide-react';
import { Out } from '../pages/shared';
import {
  assistanceStates, locationError, normalizeSearchLocation, parseAssistanceLocation,
  assistanceLocationQuery, assistanceLocationLabel, localSearchLinks,
  type AssistanceTopic, type SearchLocation,
} from '../data/local-assistance-search';

const paths: Record<AssistanceTopic, string> = { food: '/find-food', housing: '/housing-assistance' };

export default function LocalAssistanceSearch({ topic }: { topic: AssistanceTopic }) {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const active = useMemo(() => parseAssistanceLocation(search), [search]);
  const [form, setForm] = useState<SearchLocation>(active ?? { mode: 'city', city: '', state: '', zip: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(active ? { ...active } : { mode: 'city', city: '', state: '', zip: '' });
    setError(null);
  }, [active]);

  const links = useMemo(() => (active ? localSearchLinks(topic, active) : []), [topic, active]);
  const set = (patch: Partial<SearchLocation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = locationError(form);
    if (err) { setError(err); return; }
    setError(null);
    setLocation(`${paths[topic]}?${assistanceLocationQuery(normalizeSearchLocation(form))}`);
  };

  const id = `las-${topic}`;
  const errId = `${id}-error`;
  const food = topic === 'food';
  const locationInUrl = new URLSearchParams(search);
  const invalidUrl = !active && ['zip', 'city', 'state'].some(key => locationInUrl.has(key));

  return <section className="ap-search" aria-labelledby={`${id}-h`} data-testid={`section-search-${topic}`}>
    <h2 id={`${id}-h`} className="serif">{food ? 'Look for food near you' : 'Look for housing help near you'}</h2>
    <p className="ap-lead">Enter a location to prepare search links. <strong>Results open on other websites.</strong> These links do not confirm current hours, eligibility, or availability. Nothing is sent to an outside directory until you click a link.</p>
    <form className="ap-form" onSubmit={submit} noValidate data-testid={`form-search-${topic}`}>
      <fieldset className="ap-modes">
        <legend>Search by</legend>
        {(['city', 'zip'] as const).map((m) => <label key={m} className={form.mode === m ? 'on' : ''}>
          <input type="radio" name={`${id}-mode`} checked={form.mode === m} onChange={() => { set({ mode: m }); setError(null); }} data-testid={`radio-mode-${topic}-${m}`} />
          {m === 'city' ? 'City and state' : 'ZIP code'}
        </label>)}
      </fieldset>
      <div className="ap-fields">
        {form.mode === 'city' ? <>
          <div className="ap-field grow"><label htmlFor={`${id}-city`}>City</label>
            <input id={`${id}-city`} value={form.city} maxLength={80} autoComplete="address-level2" onChange={(e) => set({ city: e.target.value })} aria-invalid={!!error} aria-describedby={error ? errId : undefined} placeholder="West Des Moines" data-testid={`input-city-${topic}`} /></div>
          <div className="ap-field"><label htmlFor={`${id}-state`}>State or territory</label>
            <select id={`${id}-state`} value={form.state} onChange={(e) => set({ state: e.target.value })} aria-invalid={!!error} aria-describedby={error ? errId : undefined} data-testid={`select-state-${topic}`}>
              <option value="">Choose…</option>
              {assistanceStates.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select></div>
        </> : <div className="ap-field grow"><label htmlFor={`${id}-zip`}>ZIP code</label>
          <input id={`${id}-zip`} value={form.zip} inputMode="numeric" maxLength={5} autoComplete="postal-code" onChange={(e) => set({ zip: e.target.value })} aria-invalid={!!error} aria-describedby={error ? errId : undefined} placeholder="50265" data-testid={`input-zip-${topic}`} /></div>}
        <button type="submit" className="button-primary ap-go" data-testid={`button-search-${topic}`}><Search size={15} aria-hidden="true" /> Show search links</button>
      </div>
      {error && <p id={errId} role="alert" className="ap-err" data-testid={`text-error-${topic}`}>{error}</p>}
    </form>

    {active ? <div className="ap-results" aria-live="polite" data-testid={`results-${topic}`}>
      <h3>Search links for {assistanceLocationLabel(active)}</h3>
      <p className="ap-note">Each link opens another website in a new tab. You may need to enter your location again there. Listings can be incomplete or out of date: call ahead and confirm hours, requirements, and availability.</p>
      <ul className="ap-linklist">
        {links.map((l) => <li key={l.id} data-testid={`result-${l.id}`}>
          <Out href={l.url} className="ap-result-link">{l.title}</Out>
          <p>{l.description}</p>
        </li>)}
      </ul>
    </div> : <p className="ap-empty" role={invalidUrl ? 'alert' : undefined} data-testid={`text-empty-${topic}`}>{invalidUrl ? 'The location in this page link is invalid. Enter a city and state or a five-digit ZIP code to create a valid search.' : 'No search yet. Choose a city and state or a ZIP code above. Your search is kept in the page address, so it survives reload and back/forward.'}</p>}

    <div className="ap-fallback" data-testid={`fallback-${topic}`}>
      <h3>Need help right now? You do not have to search first.</h3>
      <div>
        <Out href="tel:211">Call 211</Out>
        <Out href={food ? 'https://www.211.org/get-help/food-programs-food-benefits' : 'https://www.211.org/get-help/housing-expenses'}>{food ? '211 food programs' : '211 housing help'}</Out>
        {food
          ? <Out href="https://www.feedingamerica.org/find-your-local-foodbank">Feeding America locator</Out>
          : <><Out href="tel:8005694287">HUD counseling: 800-569-4287</Out><Out href="https://www.hud.gov/contactus/public-housing-contacts">HUD housing agency directory</Out></>}
      </div>
      <p>For immediate danger or a life-threatening emergency, call 911.</p>
    </div>
  </section>;
}
