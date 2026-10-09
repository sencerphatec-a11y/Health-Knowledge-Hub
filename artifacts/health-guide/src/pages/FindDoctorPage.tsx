import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useSearch } from 'wouter';
import { getSearchDoctorsQueryKey, useSearchDoctors } from '@workspace/api-client-react';
import type { SearchDoctorsParams, SearchDoctorsSpecialty, PhysicianListing } from '@workspace/api-client-react';
import { AlertTriangle, ChevronLeft, ChevronRight, MapPin, Phone, Search } from 'lucide-react';
import { Out } from './shared';
import './FindDoctorPage.css';

const STATES: [string, string][] = [['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],['AS','American Samoa'],['GU','Guam'],['MP','Northern Mariana Islands'],['PR','Puerto Rico'],['VI','U.S. Virgin Islands']];
const SPECIALTIES: [SearchDoctorsSpecialty, string][] = [['all','All specialties'],['family-medicine','Family medicine'],['internal-medicine','Internal medicine'],['pediatrics','Pediatrics'],['ob-gyn','Obstetrics and gynecology'],['cardiology','Cardiology'],['dermatology','Dermatology'],['psychiatry','Psychiatry'],['general-practice','General practice']];
const SPEC_LABEL = Object.fromEntries(SPECIALTIES) as Record<string, string>;
const STATE_CODES = new Set(STATES.map((s) => s[0]));

type Submitted = { mode: 'city' | 'zip'; city: string; state: string; zip: string; specialty: SearchDoctorsSpecialty; page: number };

function parse(search: string): Submitted | null {
  const q = new URLSearchParams(search);
  const zip = (q.get('zip') || '').trim();
  const city = (q.get('city') || '').trim();
  const state = (q.get('state') || '').trim().toUpperCase();
  const sp = q.get('specialty') || 'all';
  const specialty = (SPEC_LABEL[sp] ? sp : 'all') as SearchDoctorsSpecialty;
  const p = Number(q.get('page') || 1);
  const page = Number.isInteger(p) && p >= 1 && p <= 6 ? p : 1;
  if (/^[0-9]{5}$/.test(zip)) return { mode: 'zip', city: '', state: '', zip, specialty, page };
  if (city && city.length <= 80 && STATE_CODES.has(state)) return { mode: 'city', city, state, zip: '', specialty, page };
  return null;
}

function toQuery(s: Submitted) {
  const q = new URLSearchParams();
  if (s.mode === 'zip') q.set('zip', s.zip); else { q.set('city', s.city); q.set('state', s.state); }
  if (s.specialty !== 'all') q.set('specialty', s.specialty);
  if (s.page > 1) q.set('page', String(s.page));
  return q.toString();
}

function fmtDate(v: string | null) {
  if (!v) return null;
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T12:00:00` : v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
const telHref = (p: string) => {
  const [number, extension] = p.split(/\s*(?:extension|ext\.?|x|#)\s*/i);
  const digits = number.replace(/\D/g, '');
  const base = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : null;
  if (!base) return null;
  const ext = extension?.replace(/\D/g, '');
  return `tel:${base}${ext ? `;ext=${ext}` : ''}`;
};

function Listing({ d }: { d: PhysicianListing }) {
  const updated = fmtDate(d.lastUpdated);
  return <article className="fd-card" data-testid={`card-doctor-${d.npi}`}>
    <header>
      <h3 className="serif">{d.name}{d.credential ? <span className="fd-cred">, {d.credential}</span> : null}</h3>
      <p className="fd-sub">Registry listing name. This may not be the name of the office or practice.</p>
    </header>
    {d.specialties.length > 0 && <ul className="fd-tags" aria-label="Specialties listed in registry">{d.specialties.map((s) => <li key={s}>{s}</li>)}</ul>}
    <div className="fd-locs">
      <h4>{d.locations.length === 1 ? 'Practice location' : `${d.locations.length} practice locations`}</h4>
      {d.locations.map((l, i) => {
        const full = `${l.address}, ${l.city}, ${l.state} ${l.postalCode}`;
        const phoneHref = l.phone ? telHref(l.phone) : null;
        return <div className="fd-loc" key={`${full}-${i}`}>
          <MapPin size={15} aria-hidden="true" />
          <div>
            <address>{l.address}<br />{l.city}, {l.state} {l.postalCode}</address>
            <div className="fd-loc-actions">
              {phoneHref ? <a className="outlink-btn" href={phoneHref}><Phone size={12} aria-hidden="true" />{l.phone}</a> : <span className="fd-nophone">{l.phone ? `Phone listed: ${l.phone}` : 'No phone listed'}</span>}
              <Out href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(full)}`}>Directions in Google Maps</Out>
            </div>
          </div>
        </div>;
      })}
    </div>
    <footer>
      <span>NPI {d.npi}{updated ? ` · Registry record updated ${updated}` : ' · Update date not provided'}</span>
      <Out href={d.sourceUrl}>View registry record</Out>
    </footer>
  </article>;
}

export default function FindDoctorPage() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const submitted = useMemo(() => parse(search), [search]);

  const [mode, setMode] = useState<'city' | 'zip'>('city');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [specialty, setSpecialty] = useState<SearchDoctorsSpecialty>('all');
  const [err, setErr] = useState('');

  useEffect(() => {
    const s = parse(search);
    if (s) { setMode(s.mode); setCity(s.city); setState(s.state); setZip(s.zip); setSpecialty(s.specialty); }
    else { setMode('city'); setCity(''); setState(''); setZip(''); setSpecialty('all'); }
    setErr('');
  }, [search]);

  const params: SearchDoctorsParams | undefined = submitted
    ? { ...(submitted.mode === 'zip' ? { zip: submitted.zip } : { city: submitted.city, state: submitted.state }), specialty: submitted.specialty, page: submitted.page }
    : undefined;
  const q = useSearchDoctors(params, { query: { enabled: !!submitted, retry: false, staleTime: 60000, queryKey: getSearchDoctorsQueryKey(params) } });

  const go = (s: Submitted) => navigate(`/find-a-doctor?${toQuery(s)}`);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'zip') {
      if (!/^[0-9]{5}$/.test(zip.trim())) return setErr('Enter a 5-digit ZIP code.');
      go({ mode, city: '', state: '', zip: zip.trim(), specialty, page: 1 });
    } else {
      if (!city.trim()) return setErr('Enter a city name.');
      if (city.trim().length > 80) return setErr('City name must be 80 characters or fewer.');
      if (!/^[\p{L}\p{N} .,'’()/\-]+$/u.test(city.trim())) return setErr('Enter a city name without wildcards or special search symbols.');
      if (!state) return setErr('Choose a state.');
      go({ mode, city: city.trim(), state, zip: '', specialty, page: 1 });
    }
    setErr('');
  };

  const where = submitted ? (submitted.mode === 'zip' ? `ZIP ${submitted.zip}` : `${submitted.city}, ${submitted.state}`) : '';
  const data = q.data;
  const showData = !!submitted && !q.isError && !q.isFetching && data;

  return <main className="shell fd-page">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / find a doctor</div><h1 className="serif">Look up a physician listing.</h1>
      <p>Search the public federal NPI Registry by city and state or by ZIP code. You get registry listings, not recommendations. We do not ask about symptoms or health details.</p></div>

    <div className="fd-notice" role="note">
      <strong>Read before you search.</strong>
      <ul>
        <li>An NPI number does not confirm a license or credentials, and an active registry record does not mean an office is open.</li>
        <li>Matching is exact city or ZIP, not a nearby radius. Listings can be out of date and are not comprehensive.</li>
        <li>Contact the office for its current address, hours, new-patient status, insurance, and appointments. Health Guide is not an appointment service.</li>
        <li><strong>If symptoms could be life-threatening, call 911.</strong> This page is not an emergency tool.</li>
      </ul>
    </div>

    <form className="fd-form" onSubmit={onSubmit} noValidate>
      <fieldset className="fd-modes"><legend className="sr-only">Search by</legend>
        <label className={mode === 'city' ? 'on' : ''}><input type="radio" name="mode" checked={mode === 'city'} onChange={() => { setMode('city'); setErr(''); }} />City and state</label>
        <label className={mode === 'zip' ? 'on' : ''}><input type="radio" name="mode" checked={mode === 'zip'} onChange={() => { setMode('zip'); setErr(''); }} />ZIP code</label>
      </fieldset>
      <div className="fd-fields">
        {mode === 'city' ? <>
          <div className="fd-field grow"><label htmlFor="fd-city">City</label><input id="fd-city" value={city} maxLength={80} autoComplete="address-level2" onChange={(e) => setCity(e.target.value)} placeholder="West Des Moines" /></div>
          <div className="fd-field"><label htmlFor="fd-state">State</label><select id="fd-state" value={state} onChange={(e) => setState(e.target.value)}><option value="">Choose state</option>{STATES.map(([c, n]) => <option key={c} value={c}>{n} ({c})</option>)}</select></div>
        </> : <div className="fd-field"><label htmlFor="fd-zip">ZIP code</label><input id="fd-zip" value={zip} inputMode="numeric" maxLength={5} autoComplete="postal-code" onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} placeholder="50266" /></div>}
        <div className="fd-field"><label htmlFor="fd-spec">Specialty (optional)</label><select id="fd-spec" value={specialty} onChange={(e) => setSpecialty(e.target.value as SearchDoctorsSpecialty)}>{SPECIALTIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <button type="submit" className="button-primary fd-go"><Search size={14} aria-hidden="true" />Search registry</button>
      </div>
      {err && <p className="fd-err" role="alert">{err}</p>}
    </form>

    {!submitted && <div className="catalog-state fd-state"><MapPin size={26} aria-hidden="true" /><h2>Start with a place.</h2>
      <p>Enter a city and state or a ZIP code above. Nothing is sent until you press Search registry.</p>
      <button type="button" className="button-primary" onClick={() => go({ mode: 'city', city: 'West Des Moines', state: 'IA', zip: '', specialty: 'all', page: 1 })}>Use West Des Moines, IA</button></div>}

    {submitted && <section className="fd-results" aria-live="polite" aria-busy={q.isFetching}>
      <h2 className="serif fd-h">Registry listings for {where}{submitted.specialty !== 'all' ? `, ${SPEC_LABEL[submitted.specialty]}` : ''}</h2>
      {q.isFetching && <div className="fd-skels" role="status"><span className="sr-only">Searching the NPI Registry</span>{[0, 1, 2].map((i) => <div className="fd-skel" key={i}><i /><b /><span /></div>)}</div>}

      {!q.isFetching && q.isError && <div className="catalog-state catalog-error fd-state" role="alert"><AlertTriangle size={26} aria-hidden="true" /><h2>The search did not complete.</h2>
        <p>This is a lookup error, not an empty result. The registry may be slow or unavailable. Try again in a moment.</p>
        <button type="button" className="button-primary" onClick={() => q.refetch()}>Try again</button></div>}

      {showData && <>
        {data.items.length === 0 ? <div className="catalog-state fd-state">
          <h2>{data.hasMore ? 'No matching physician on this page.' : 'No physician listings found.'}</h2>
          <p>{data.hasMore ? `This page held ${data.directoryRecordsOnPage} directory records, but none were active physician listings that matched. More records are available on the next page.` : `No active physician listings matched ${where}${submitted.specialty !== 'all' ? ` for ${SPEC_LABEL[submitted.specialty].toLowerCase()}` : ''}. Matching is exact, so try a nearby city or ZIP, a different spelling, or all specialties.`}</p>
          {data.hasMore && submitted.page < 6 && <button type="button" className="button-primary" onClick={() => go({ ...submitted, page: submitted.page + 1 })}>Check next page</button>}
        </div> : <>
          <p className="result-count">Page {data.page}: {data.items.length} physician listing{data.items.length === 1 ? '' : 's'} from {data.directoryRecordsOnPage} directory records. Non-physician records are filtered out. Order is not a ranking.</p>
          <div className="fd-list">{data.items.map((d) => <Listing key={d.npi} d={d} />)}</div>
        </>}

        {data.limitReached && <div className="fd-notice" role="note"><strong>Registry limit reached.</strong> The CMS registry returns at most 1,200 records per search, so some listings may not appear. Try a narrower location or a specific specialty.</div>}

        <nav className="pagination" aria-label="Search result pages">
          <button type="button" disabled={submitted.page <= 1} onClick={() => go({ ...submitted, page: submitted.page - 1 })}><ChevronLeft size={13} aria-hidden="true" />Previous</button>
          <span>Page {data.page}</span>
          <button type="button" disabled={!data.hasMore || submitted.page >= 6} onClick={() => go({ ...submitted, page: submitted.page + 1 })}>Next<ChevronRight size={13} aria-hidden="true" /></button>
        </nav>
        {data.hasMore && submitted.page >= 6 && <p className="fd-sub center">Results stop at page 6. Narrow by location or specialty to see others.</p>}
        <p className="catalog-updated">Retrieved {fmtDate(data.retrievedAt)} from the CMS NPPES NPI Registry API v2.1. <Out href={data.sourceUrl} className="inline-out">Source</Out></p>
      </>}
    </section>}

    <div className="disclaimer fd-foot"><strong>Independent listing.</strong> Health Guide is not affiliated with CMS. Data comes from the public <Out href="https://npiregistry.cms.hhs.gov/api-page" className="inline-out">NPPES NPI Registry API</Out>; you can also use the official <Out href="https://npiregistry.cms.hhs.gov/registry" className="inline-out">NPI Registry directory</Out>. Maps links give directions to an address only and say nothing about distance or quality.</div>
  </main>;
}
