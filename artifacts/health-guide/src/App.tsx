import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, Route, Switch, useLocation, useSearch } from 'wouter';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, FileText, HeartPulse, Pill, Search } from 'lucide-react';
import { getGetMedicationLabelQueryKey, MedicationLabelType, useGetMedicationLabel, useGetMedicationLabels } from '@workspace/api-client-react';
import ResourcesPage from './pages/ResourcesPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import GiveBackPage from './pages/GiveBackPage';
import FindDoctorPage from './pages/FindDoctorPage';
import FindFoodPage from './pages/FindFoodPage';
import HousingAssistancePage from './pages/HousingAssistancePage';
import QuestionnairesPage from './pages/QuestionnairesPage';
import { medicationLabelTypeDefinitions, medicationLabelTypeSource } from './data/medication-label-types';
import HomeAboutSection from './components/HomeAboutSection';
import VaccinesPage from './pages/VaccinesPage';
import GoodRxPage from './pages/GoodRxPage';
import DrugInteractionsPage from './pages/DrugInteractionsPage';
import PulseCarePage from './pages/PulseCarePage';
import BlogPage, { BlogPostPage } from './pages/BlogPage';
import { getCommunityPost } from './data/community-blog';
import { entries, getEntry, getSource, sources, type Kind, type LibraryEntry } from './data';
import { articleSelectionChecked, recentArticleCount, formatArticleDate } from './data/recent-articles';
import './article-library.css';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Blog', href: '/blog' },
  { label: 'Symptom Checker', href: '/symptom-checker' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Find a Doctor', href: '/find-a-doctor' },
  { label: 'Questionnaires', href: '/questionnaires' },
  { label: 'Medications', href: '/medications' },
  { label: 'Drug Interactions', href: '/drug-interactions' },
  { label: 'Resources', href: '/resources' },
  { label: 'Find Food', href: '/find-food' },
  { label: 'Housing Assistance', href: '/housing-assistance' },
  { label: 'Give Back', href: '/give-back' },
  { label: 'Vaccines', href: '/vaccines' },
  { label: 'GoodRx', href: '/goodrx' },
  { label: 'Sources', href: '/sources' },
];
const collectionFor = (kind: Kind) => kind === 'Article' ? 'articles' : kind === 'Condition' ? 'conditions' : 'medications';
const iconFor = (kind: Kind, size = 17) => kind === 'Article' ? <FileText size={size} strokeWidth={1.7} /> : kind === 'Condition' ? <HeartPulse size={size} strokeWidth={1.7} /> : <Pill size={size} strokeWidth={1.7} />;
const entryHref = (entry: LibraryEntry) => `/${collectionFor(entry.kind)}/${entry.id}`;

function usePageMetadata() {
  const [location] = useLocation();
  const queryString = useSearch();
  useEffect(() => {
    const pathname = location;
    const segments = pathname.split('/').filter(Boolean);
    const entry = segments.length === 2 ? getEntry(segments[1]) : undefined;
    const communityPost = segments[0] === 'blog' && segments.length === 2 ? getCommunityPost(segments[1]) : undefined;
    const query = new URLSearchParams(queryString).get('q')?.trim();
    let title = 'Health information & community resources | Health Guide';
    let description = 'Find medical-condition and medication information, food and housing assistance directories, and community resources, with links to original sources.';
    let type = 'website';

    if (communityPost) {
      title = `${communityPost.title} | West Des Moines community blog`;
      description = `${communityPost.summary} An original, source-linked Health Guide community post about West Des Moines, Iowa.`;
      type = 'article';
    } else if (pathname === '/blog') {
      title = 'Positive West Des Moines, Iowa community stories | Health Guide Blog';
      description = 'Read original positive stories about West Des Moines libraries, parks, arts, and neighbors helping neighbors, with links to verified local sources.';
    } else if (pathname.startsWith('/blog/')) {
      title = 'Community post not found | Health Guide Blog';
      description = 'Browse positive, source-linked community stories from West Des Moines, Iowa.';
    } else if (entry) {
      title = entry.published ? `${entry.title} | Health Guide` : `${entry.title}: evidence-based guide | Health Guide`;
      description = entry.published
        ? `${entry.summary} Published ${formatArticleDate(entry.published)} by ${entry.publisher}. Read the brief and original article.`
        : `${entry.summary} Read the plain-language overview and follow links to the original medical sources.`;
      type = 'article';
    } else if (pathname === '/articles') {
      title = '50 recent healthcare articles & health explainers | Health Guide';
      description = 'Browse 50 recent health reads curated for broad U.S. relevance, with publisher dates, short summaries, original-source links, and separate everyday-health explainers.';
    } else if (pathname === '/symptom-checker') {
      title = 'Mayo Clinic Symptom Checker: information & official link | Health Guide';
      description = 'Learn how to use Mayo Clinic’s external adult and child Symptom Checker, with an official link and clear limits. It is not a diagnosis or an emergency service.';
    } else if (pathname === '/conditions') {
      title = 'Condition library: clear health guides | Health Guide';
      description = 'Explore 50 curated, alphabetical guides to common conditions that touch daily American life, with trusted sources and reminders to discuss personal concerns with a clinician.';
    } else if (pathname === '/find-a-doctor') {
      title = 'Find a doctor by city or ZIP code | Health Guide';
      description = 'Search real CMS NPI Registry physician practice listings by city and state or ZIP code, with optional specialty filters, listed addresses, phone numbers, and source links.';
    } else if (pathname === '/questionnaires') {
      title = 'Health questionnaires & educational results | Health Guide';
      description = 'Explore private adult wellness and lifestyle reflections, PHQ-9 and GAD-7 symptom screeners, and exercise-readiness information with official PAR-Q+ links. Scores are not diagnoses or exercise clearance.';
    } else if (pathname === '/medications') {
      title = 'Medication guides & medicine safety | Health Guide';
      description = 'Search current U.S. human medication and biologic product labels, read labeled uses, and follow direct DailyMed citations.';
    } else if (pathname.startsWith('/medications/')) {
      title = 'Medication label and labeled uses | Health Guide';
      description = 'Read the product-specific labeled uses and find the complete original DailyMed label, warnings, and directions.';
    } else if (pathname === '/pulsecare') {
      title = 'PulseCare patient portal prototype | Health Guide';
      description = 'Explore PulseCare, an educational patient portal prototype with sample data. Appointments, refills, payments, and telehealth are not live.';
    } else if (pathname === '/resources') {
      title = 'West Des Moines resources & nationwide support | Health Guide';
      description = 'Explore 15 local and regional resources for West Des Moines, Iowa, plus Eldercare Locator, Patient Advocate Foundation, and USA.gov. Read service details and visit official websites.';
    } else if (pathname === '/give-back') {
      title = 'Donate & volunteer in West Des Moines, Iowa | Health Guide';
      description = 'Find nine source-linked ways to help West Des Moines neighbors through donations and volunteering, with official next steps, service areas, and participation requirements.';
    } else if (pathname === '/find-food') {
      title = 'Find food pantries & meal programs | Health Guide';
      description = 'Find food-pantry search links by city and state or ZIP code, and learn about Mom’s Meals, Meals from the Heartland, and Meals on Wheels, including eligibility, costs, and official sources.';
    } else if (pathname === '/housing-assistance') {
      title = 'Housing & rental assistance near you | Health Guide';
      description = 'Find local housing assistance directories, official HUD housing-agency contacts by state, Section 8 information, emergency rent help, shelter resources, and counseling.';
    } else if (pathname === '/vaccines') {
      title = 'Vaccine information & CDC schedules | Health Guide';
      description = 'Search source-linked vaccine fact sheets from the CDC VIS index and read educational schedule summaries with links to full CDC schedules.';
    } else if (pathname === '/goodrx') {
      title = 'GoodRx prescription coupons explained | Health Guide';
      description = 'Learn how the GoodRx commercial coupon service works. GoodRx is not insurance, and savings are not guaranteed.';
    } else if (pathname === '/drug-interactions') {
      title = 'Drug interactions & Drugs.com resources | Health Guide';
      description = 'Learn about Drugs.com’s interaction checker, interaction ratings, and medicine, food, alcohol, and supplement precautions, with links to the original resources.';
    } else if (pathname === '/sources') {
      title = 'Health Guide sources & citations | MedlinePlus, CDC, FDA';
      description = 'See the original public-health and medicine sources behind Health Guide articles, condition pages, and medication guides.';
    } else if (pathname === '/search') {
      title = query ? `Results for ${query} | Health Guide` : 'Search health information | Health Guide';
      description = query
        ? `Search results for ${query} across Health Guide articles, conditions, and medication references.`
        : 'Search evidence-based articles, condition guides, medication information, and trusted medical sources.';
    } else if (pathname !== '/') {
      title = 'Page not found | Health Guide';
      description = 'This Health Guide page could not be found. Browse the article, condition, and medication libraries instead.';
    }

    document.title = title;
    const updateMeta = (selector: string, attributes: Record<string, string>) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }
      for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    };
    updateMeta('meta[name="description"]', { name: 'description', content: description });
    updateMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    updateMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    updateMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    updateMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    updateMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  }, [location, queryString]);
}

function Header() {
  const [location] = useLocation();
  const active = (href: string) => href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`);
  return <>
    <header className="shell topbar">
      <Link href="/" className="brand" aria-label="Health Guide home" data-testid="link-home-brand">
        <span className="brand-mark"><HeartPulse size={19} strokeWidth={1.7} /></span>
        <span>health guide</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? 'page' : undefined} data-testid={`nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}>{item.label}</Link>)}
      </nav>
      <Link href="/sources" className="text-link" style={{ fontSize: 12 }} data-testid="link-source-standard">Our standard <ArrowUpRight size={14} /></Link>
    </header>
    <nav className="shell nav-mobile" aria-label="Main navigation">
      {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? 'page' : undefined} data-testid={`mobile-nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}>{item.label}</Link>)}
    </nav>
  </>;
}

function Footer() {
  return <footer className="footer">
    <div className="shell footer-inner">
      <div><div className="brand" style={{ fontSize: 15 }}><span className="brand-mark" style={{ width: 28, height: 28 }}><HeartPulse size={15} /></span><span>health guide</span></div><p style={{ margin: '9px 0 0' }}>Clear answers. Credible sources. No diagnosis.</p></div>
      <div className="footer-links">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
      <span>Editorial source check: October 2026</span>
    </div>
  </footer>;
}

function Disclaimer() {
  return <div className="disclaimer" role="note" data-testid="notice-medical-disclaimer">
    <strong>For information, not individual care.</strong> Health Guide offers general education, not diagnosis or treatment advice. For personal questions, talk with a clinician or pharmacist and follow medicine labels. If symptoms may be urgent or life-threatening, contact your local emergency services now.
  </div>;
}

function SearchField({ initial = '', onSearch, home = false }: { initial?: string; onSearch: (query: string) => void; home?: boolean }) {
  const [query, setQuery] = useState(initial);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSearch(query.trim()); };
  return <form className={home ? 'search-panel' : 'library-search'} onSubmit={submit} role="search">
    <Search size={19} aria-hidden="true" />
    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={home ? 'Search a topic, symptom, or medicine' : 'Search titles and summaries'} aria-label="Search health information" data-testid={home ? 'input-home-search' : 'input-library-search'} />
    <button className={home ? 'search-submit' : 'library-search-submit'} type="submit" data-testid={home ? 'button-home-search' : 'button-library-search'}>{home ? 'Search library' : 'Search'}</button>
  </form>;
}

function Home() {
  const [, setLocation] = useLocation();
  const doSearch = (query: string) => setLocation(query ? `/search?q=${encodeURIComponent(query)}` : '/articles');
  const articlePicks = entries.filter((entry) => entry.kind === 'Article').slice(0, 3);
  return <main>
    <div className="shell hero animate-arrive">
      <div>
        <div className="eyebrow">A public health reading room</div>
        <h1>Good health starts with <em>good information.</em></h1>
        <p className="hero-copy">Clear, considered explanations for everyday health questions—grounded in trusted public-health sources, and written for real life.</p>
        <div className="hero-actions">
          <Link href="/articles" className="button-primary" data-testid="link-browse-articles">Browse the library <ArrowRight size={15} /></Link>
          <Link href="/sources" className="text-link" data-testid="link-view-sources">See our sources <ArrowUpRight size={15} /></Link>
          <a href="#about" className="text-link" data-testid="link-about-home">About this website <ArrowRight size={15} /></a>
        </div>
      </div>
      <div className="hero-art" aria-label="Illustration of a quiet sprouting branch" role="img">
        <span className="art-stem" /><span className="leaf leaf-a" /><span className="leaf leaf-b" /><span className="leaf leaf-c" /><span className="leaf leaf-d" />
        <span className="art-note">A little clarity goes a long way.</span>
      </div>
    </div>
    <div className="shell"><SearchField home onSearch={doSearch} /></div>
    <HomeAboutSection />
    <section className="shell section">
      <div className="section-head"><div><div className="eyebrow">Start with a topic</div><h2 className="serif">A useful place to begin.</h2></div><p>Explore our library of common conditions, medicines, and the questions people ask about them.</p></div>
      <div className="topic-grid">
        {[
          { href: '/conditions', icon: <HeartPulse size={18} />, count: `${entries.filter((e) => e.kind === 'Condition').length} condition guides`, title: 'Conditions', copy: 'Plain-language introductions to common health conditions.' },
          { href: '/medications', icon: <Pill size={18} />, count: 'DailyMed catalog', title: 'Medications', copy: 'Search current product labels and read their original safety information.' },
          { href: '/articles', icon: <BookOpen size={18} />, count: `${recentArticleCount} recent reads + 3 explainers`, title: 'Articles', copy: 'Recent healthcare reporting and useful everyday-health context.' },
        ].map((topic) => <Link key={topic.href} href={topic.href} className="topic-card" data-testid={`card-topic-${topic.title.toLowerCase()}`}>
          <div className="card-meta"><span>{topic.count}</span><span className="card-icon">{topic.icon}</span></div>
          <h3>{topic.title}</h3><p>{topic.copy}</p><div className="card-bottom"><span>Explore the collection</span><ArrowUpRight size={16} /></div>
        </Link>)}
      </div>
    </section>
    <section className="feature-band">
      <div className="shell feature-inner">
        <div><div className="eyebrow">A different kind of health guide</div><h2 className="serif">Useful answers,<br />without the noise.</h2></div>
        <div className="feature-list">
          <div className="feature-row"><span className="feature-num">01</span><div><h3>Grounded in trusted sources</h3><p>Every guide points you to its original public-health source, so you can read further and see where information comes from.</p></div></div>
          <div className="feature-row"><span className="feature-num">02</span><div><h3>Written to be understood</h3><p>We explain the essentials in everyday language, without replacing the context a health professional can provide.</p></div></div>
          <div className="feature-row"><span className="feature-num">03</span><div><h3>Clear about what we are not</h3><p>This is a reading room—not a diagnostic tool, a treatment plan, or a substitute for individual care.</p></div></div>
        </div>
      </div>
    </section>
    <section className="shell section">
      <div className="section-head"><div><div className="eyebrow">A few good reads</div><h2 className="serif">Recent health reads, with sources.</h2></div><Link href="/articles" className="text-link">All articles <ArrowRight size={15} /></Link></div>
      <div className="topic-grid">
        {articlePicks.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
      </div>
    </section>
    <section className="shell" style={{ paddingBottom: 68 }}><Disclaimer /></section>
    <Footer />
  </main>;
}

function EntryCard({ entry }: { entry: LibraryEntry }) {
  return <Link href={entryHref(entry)} className="listing-card" data-testid={`card-entry-${entry.id}`}>
    <div className="card-meta"><span>{entry.category}</span><span className="card-icon">{iconFor(entry.kind, 16)}</span></div>
    <h2>{entry.title}</h2><p>{entry.summary}</p>
    {entry.published && <div className="article-byline">{entry.publisher}<br />Published <time dateTime={entry.published}>{formatArticleDate(entry.published)}</time></div>}
    <div className="card-bottom"><span>{entry.published ? 'Read the brief & original source' : 'Read the guide'}</span><ArrowUpRight size={15} /></div>
  </Link>;
}

function Library({ kind }: { kind: Kind }) {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(useSearch());
  const initialQuery = params.get('q') || '';
  const query = initialQuery;
  const [filter, setFilter] = useState('All topics');
  const [articleScope, setArticleScope] = useState('recent');
  const [articleSort, setArticleSort] = useState('newest');
  const baseEntries = useMemo(() => entries.filter((entry) => entry.kind === kind && (kind !== 'Article' || articleScope === 'all' || (articleScope === 'recent' ? !!entry.published : !entry.published))).sort((a, b) => {
    if (kind !== 'Article' || articleSort === 'title') return a.title.localeCompare(b.title);
    if (!a.published) return b.published ? 1 : a.title.localeCompare(b.title);
    if (!b.published) return -1;
    const comparison = (a.publishedAt || a.published).localeCompare(b.publishedAt || b.published);
    return (articleSort === 'oldest' ? comparison : -comparison) || a.title.localeCompare(b.title);
  }), [kind, articleScope, articleSort]);
  const categories = ['All topics', ...Array.from(new Set(baseEntries.map((entry) => entry.category)))];
  const filtered = baseEntries.filter((entry) => {
    const matchesQuery = `${entry.title} ${entry.summary} ${entry.category} ${entry.publisher || ''}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (filter === 'All topics' || entry.category === filter);
  });
  const collectionName = kind === 'Article' ? 'Articles' : kind === 'Condition' ? 'Conditions' : 'Medications';
  const description = kind === 'Article'
    ? 'Recent healthcare reporting and explainers selected for broad relevance to American readers. Find the publication date, a short brief, and the original source for every recent read.'
    : kind === 'Condition'
      ? 'Straightforward introductions to common conditions. Start here for context, then bring personal questions to a clinician.'
      : 'Understand the basics of common medicines and check the original information and product labeling.';
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The library / {collectionName}</div><h1 className="serif">{collectionName}, made clearer.</h1><p>{description}</p></div>
    {kind === 'Article' && <>
      <p className="article-selection-note" data-testid="text-article-selection">50 recent reads · Published September 15–October 9, 2026 · Sources checked {articleSelectionChecked}. This is a curated snapshot, not a live feed or a verified ranking of the most-read articles. Briefs link to publisher sites; some publishers may restrict access. Reporting and early research are not medical guidelines.</p>
      <div className="article-controls">
        <label>Collection <select aria-label="Article collection" value={articleScope} onChange={event => { setArticleScope(event.target.value); setFilter('All topics'); }} data-testid="select-article-collection">
          <option value="recent">50 recent reads</option><option value="explainers">3 everyday explainers</option><option value="all">All 53 articles</option>
        </select></label>
        <label>Sort <select aria-label="Sort articles" value={articleSort} onChange={event => setArticleSort(event.target.value)} data-testid="select-article-sort">
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option>
        </select></label>
      </div>
    </>}
    <div className="library-controls">
      <SearchField key={initialQuery} initial={initialQuery} onSearch={(value) => { setLocation(value ? `/${collectionFor(kind)}?q=${encodeURIComponent(value)}` : `/${collectionFor(kind)}`); }} />
      {categories.map((category) => <button key={category} type="button" className={`filter-chip${filter === category ? ' active' : ''}`} onClick={() => setFilter(category)} aria-pressed={filter === category} data-testid={`filter-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}
    </div>
    {kind === 'Condition' && <p className="catalog-note" data-testid="text-conditions-note">A curated set of common conditions, listed alphabetically. This is not an official numerical prevalence ranking.</p>}
    <p className="result-count" aria-live="polite" data-testid="text-result-count">{filtered.length} {kind === 'Article' ? (filtered.length === 1 ? 'article' : 'articles') : (filtered.length === 1 ? 'guide' : 'guides')} in this collection</p>
    {filtered.length ? <div className="listing-grid">{filtered.map((entry) => <EntryCard key={entry.id} entry={entry} />)}</div> : <div className="empty-state" data-testid="empty-search"><Search size={25} /><h2>No guides found</h2><p>Try another word or choose a different topic.</p><button className="button-primary" onClick={() => { setFilter('All topics'); setLocation(`/${collectionFor(kind)}`); }}>Clear search and filters</button></div>}
    <div style={{ paddingBottom: 50 }}><Disclaimer /></div>
    <Footer />
  </main>;
}

function MedicationCatalog() {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(useSearch());
  const initialQuery = urlParams.get('q') || '';
  const rawLabelType = urlParams.get('labelType');
  const labelType = Object.values(MedicationLabelType).find(type => type === rawLabelType);
  const pageFromUrl = Number(urlParams.get('page') || '1');
  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchValue, setSearchValue] = useState(initialQuery);
  const params = useMemo(() => ({
    ...(initialQuery.trim() ? { query: initialQuery.trim() } : {}),
    ...(labelType ? { labelType } : {}),
    page,
  }), [initialQuery, labelType, page]);
  const catalog = useGetMedicationLabels(params);
  const resultsFocus = useRef<HTMLDivElement>(null);
  const focusAfterLoad = useRef(false);
  useEffect(() => {
    if (!catalog.isFetching && catalog.data && !catalog.isError && focusAfterLoad.current) {
      resultsFocus.current?.focus();
      focusAfterLoad.current = false;
    }
  }, [catalog.isFetching, catalog.data, catalog.isError]);
  useEffect(() => { setSearchValue(initialQuery); }, [initialQuery]);
  useEffect(() => {
    if (catalog.data && (catalog.data.page !== page || (rawLabelType !== null && !labelType))) {
      const search = new URLSearchParams();
      if (initialQuery.trim()) search.set('q', initialQuery.trim());
      if (labelType) search.set('labelType', labelType);
      if (catalog.data.page > 1) search.set('page', String(catalog.data.page));
      setLocation(`/medications${search.size ? `?${search.toString()}` : ''}`, { replace: true });
    }
  }, [catalog.data, page, initialQuery, labelType, rawLabelType, setLocation]);

  const goTo = (nextQuery: string, nextPage: number, nextLabelType = labelType || '', moveFocus = false) => {
    focusAfterLoad.current = moveFocus;
    const search = new URLSearchParams();
    if (nextQuery.trim()) search.set('q', nextQuery.trim());
    if (nextLabelType) search.set('labelType', nextLabelType);
    if (nextPage > 1) search.set('page', String(nextPage));
    setLocation(`/medications${search.size ? `?${search.toString()}` : ''}`);
  };
  const results = catalog.data;

  return <main className="shell medication-catalog">
    <div className="page-heading animate-arrive">
      <div className="eyebrow">The library / medication labels</div>
      <h1 className="serif">Medications and their uses.</h1>
      <p>Search current U.S. human drug and biologic labels from DailyMed—including prescription medicines, over-the-counter products, vaccines, and other therapies. Select a product to read its labeled uses and original source.</p>
    </div>
    <form className="catalog-search" role="search" onSubmit={(event) => { event.preventDefault(); goTo(searchValue, 1); }}>
      <Search size={18} aria-hidden="true" />
      <input aria-label="Search medication labels" maxLength={100} value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search a generic or brand name" data-testid="input-medication-catalog-search" />
      {searchValue && <button className="catalog-clear" type="button" onClick={(event) => { event.currentTarget.form?.querySelector('input')?.focus(); setSearchValue(''); goTo('', 1); }} aria-label="Clear search" data-testid="button-clear-medication-search">Clear</button>}
      <button className="button-primary catalog-submit" type="submit" data-testid="button-search-medication-labels">Search labels <ArrowRight size={14} /></button>
    </form>
    <div className="catalog-filter">
      <label htmlFor="medication-label-type">Label type</label>
      <select id="medication-label-type" value={labelType || ''} onChange={(event) => goTo(initialQuery, 1, event.target.value)} data-testid="select-medication-label-type">
        <option value="">All label types</option>
        {Object.values(MedicationLabelType).map(type => <option key={type} value={type}>{labelTypeName(type)}</option>)}
      </select>
      {labelType && <button type="button" className="text-link" onClick={() => goTo(initialQuery, 1, '')}>Clear label filter</button>}
    </div>

    <div className="catalog-note"><Pill size={16} /><span>Records are product-specific, not unique medicines. DailyMed inclusion does not establish FDA approval or effectiveness; some labels are for unapproved or homeopathic products. Animal drugs, devices, and manufacturing ingredients are excluded.</span></div>
    {labelType && <p className="label-type-selected-help" id="selected-label-type-explanation" data-testid="text-selected-label-type-explanation">
      <strong>{labelTypeName(labelType)}: </strong>{medicationLabelTypeDefinitions[labelType].description}{' '}
      <a href={medicationLabelTypeDefinitions[labelType].source} target="_blank" rel="noopener noreferrer">{medicationLabelTypeDefinitions[labelType].sourceLabel} <ExternalLink size={11} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
    </p>}
    <details className="label-type-guide" data-testid="medication-label-type-guide">
      <summary>What do the nine label types mean?</summary>
      <p>These are categories of product-label documents, not rankings of safety or effectiveness. A category is not an independent approval check or a recommendation for your care. All label types remain included unless you choose a filter.</p>
      <p><a href={medicationLabelTypeSource} target="_blank" rel="noopener noreferrer">FDA: official labeling document types <ExternalLink size={11} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></p>
      <dl>{Object.values(MedicationLabelType).map(type => {
        const definition = medicationLabelTypeDefinitions[type];
        return <div key={type} data-testid={`explanation-label-type-${type}`}>
          <dt>{definition.name}</dt>
          <dd>{definition.description}{' '}<a href={definition.source} target="_blank" rel="noopener noreferrer">{definition.sourceLabel} <ExternalLink size={11} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></dd>
        </div>;
      })}</dl>
    </details>

    <p className="medication-status" role="status" aria-live="polite" aria-atomic="true" data-testid="status-medication-catalog">
      {catalog.isFetching ? 'Loading medication labels.' : catalog.isError ? '' : results ? `${results.totalItems.toLocaleString()} label ${results.totalItems === 1 ? 'record' : 'records'}${results.query ? ` for “${results.query}”` : ''}. ${results.totalItems ? `Page ${results.page} of ${results.totalPages}.` : 'No label records found.'}` : ''}
    </p>
    {catalog.isLoading ? <section className="catalog-results" aria-label="Loading medication labels" aria-busy="true">
      <div className="skeleton-line" /><div className="label-skeletons">{[1, 2, 3, 4, 5, 6].map((item) => <div className="label-skeleton" key={item}><i /><b /><span /></div>)}</div>
    </section> : catalog.isError ? <div className="catalog-state catalog-error" role="alert">
      <h2>Labels could not be loaded.</h2><p>{catalog.error.message || 'We could not reach the current DailyMed catalog. Please try again.'}</p>
      <button type="button" className="button-primary" onClick={() => { focusAfterLoad.current = true; catalog.refetch(); }} data-testid="button-retry-medication-catalog">Try again <ArrowRight size={14} /></button>
      <button type="button" className="text-link" onClick={() => goTo('', 1, '', true)} style={{ marginTop: 16 }}>Return to the catalog <ArrowRight size={14} /></button>
    </div> : results ? <>
      <div className="catalog-summary" ref={resultsFocus} tabIndex={-1} role="region" aria-label="Medication label results" data-testid="text-medication-catalog-summary">
        <p>{results.query ? <>Results for <strong>“{results.query}”</strong></> : <>Current U.S. human drug-label catalog</>}{results.labelType && <> · {labelTypeName(results.labelType)}</>}</p>
        <span>{results.totalItems.toLocaleString()} {results.totalItems === 1 ? 'label record' : 'label records'}</span>
      </div>
      {results.items.length ? <div className="label-list" data-testid="list-medication-labels">
        {results.items.map((label) => <Link key={label.setId} href={`/medications/${encodeURIComponent(label.setId)}`} className="label-row" data-testid={`link-medication-label-${label.setId}`}>
          <span className="label-leading"><Pill size={18} strokeWidth={1.6} /></span>
          <span className="label-main"><span className="label-title">{label.title}</span><span className="label-subtitle"><span className={`label-type ${label.labelType}`}>{labelTypeName(label.labelType)}</span><span>Published {formatDate(label.publishedDate)}</span><span>View labeled uses</span></span></span>
          <ArrowUpRight size={17} className="label-arrow" aria-hidden="true" />
        </Link>)}
      </div> : <div className="catalog-state" data-testid="empty-medication-catalog"><Search size={24} /><h2>No label records found</h2><p>Try another generic or brand name{labelType ? ' or choose a different label type' : ''}. Search covers current product labels, not just ingredient names.</p><button className="text-link" type="button" onClick={() => { setSearchValue(''); goTo('', 1, labelType || '', true); }}>Clear search <ArrowRight size={14} /></button>{labelType && <button className="text-link" type="button" onClick={() => { setSearchValue(''); goTo('', 1, '', true); }}>Clear search and filters <ArrowRight size={14} /></button>}</div>}
      {results.totalPages > 1 && <nav className="pagination" aria-label="Medication label pages">
        <button type="button" disabled={results.page <= 1} onClick={() => goTo(initialQuery, results.page - 1, labelType || '', true)} data-testid="button-medications-previous"><ChevronLeft size={16} /> Previous</button>
        <span>Page <strong>{results.page}</strong> of <strong>{results.totalPages}</strong></span>
        <button type="button" disabled={results.page >= results.totalPages} onClick={() => goTo(initialQuery, results.page + 1, labelType || '', true)} data-testid="button-medications-next">Next <ChevronRight size={16} /></button>
      </nav>}
      <div className="catalog-updated"><CalendarDays size={14} /> Catalog last updated {formatDate(results.catalogUpdatedAt)} · Records from <a href="https://dailymed.nlm.nih.gov/dailymed/" target="_blank" rel="noreferrer">DailyMed <ExternalLink size={11} /></a></div>
    </> : null}
    <section className="section" aria-label="Authored medication guides"><h2 className="serif">Everyday medication guides</h2><p className="source-note">Our plain-language guides are separate from the product-specific label catalog.</p><div className="listing-grid">{entries.filter(entry => entry.kind === 'Medication').map(entry => <EntryCard key={entry.id} entry={entry} />)}</div></section>
    <div className="catalog-disclaimer"><Disclaimer /></div>
    <Footer />
  </main>;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
}

function labelTypeName(type: string) {
  const knownType = Object.values(MedicationLabelType).find(value => value === type);
  return knownType ? medicationLabelTypeDefinitions[knownType].name : type;
}

function MedicationRecordRoute({ id }: { id: string }) {
  const authoredEntry = getEntry(id);
  if (authoredEntry?.kind === 'Medication') return <Detail collection="medications" id={id} />;
  return <MedicationLabelDetailPage setId={id} />;
}

function MedicationLabelDetailPage({ setId }: { setId: string }) {
  const queryKey = getGetMedicationLabelQueryKey(setId);
  const labelQuery = useGetMedicationLabel(setId, { query: { enabled: !!setId, queryKey } });
  const label = labelQuery.data;
  const titleFocus = useRef<HTMLHeadingElement>(null);
  const focusAfterLoad = useRef(true);
  useEffect(() => { focusAfterLoad.current = true; }, [setId]);
  useEffect(() => {
    if (!labelQuery.isFetching && focusAfterLoad.current) {
      titleFocus.current?.focus();
      focusAfterLoad.current = false;
    }
  }, [setId, labelQuery.isFetching, labelQuery.isError]);
  const status = <p className="medication-status" role="status" aria-live="polite" aria-atomic="true" data-testid="status-medication-detail">
    {labelQuery.isFetching ? 'Loading medication label.' : labelQuery.isError ? '' : label ? `Medication label loaded: ${label.title}` : ''}
  </p>;

  if (labelQuery.isLoading) return <main className="shell medication-detail">{status}<section aria-label="Loading medication label" aria-busy="true"><div className="detail-top"><div className="skeleton-line short" /><div className="skeleton-heading" /><div className="skeleton-line" /></div><div className="detail-layout"><article className="reading-content"><div className="label-detail-skeleton" /><div className="label-detail-skeleton" /></article></div></section></main>;
  if (labelQuery.isError || !label) return <main className="shell medication-detail">
    {status}<div className="catalog-state detail-error" role="alert"><Pill size={25} /><h1 className="serif" ref={titleFocus} tabIndex={-1}>This label could not be opened.</h1><p>{labelQuery.error?.message || 'It may no longer be in the catalog, or the service may be temporarily unavailable.'}</p><button type="button" className="button-primary" onClick={() => { focusAfterLoad.current = true; labelQuery.refetch(); }} data-testid="button-retry-medication-label">Try again <ArrowRight size={14} /></button><Link href="/medications" className="text-link"><ArrowLeft size={14} /> Back to medication labels</Link></div><Footer />
  </main>;

  return <main className="shell medication-detail">
    {status}
    <div className="detail-top animate-arrive">
      <div className="breadcrumbs"><Link href="/medications">Medication labels</Link><ChevronRight size={13} /><span>DailyMed product label</span></div>
      <div className="detail-hero">
        <div className="eyebrow"><Pill size={15} /> DailyMed · {labelTypeName(label.labelType)}</div>
        <h1 ref={titleFocus} tabIndex={-1}>{label.title}</h1>
        <p>This is an individual product label. Labels can vary between products, even when they contain the same active ingredient.</p>
        <div className="detail-meta"><span>Published {formatDate(label.publishedDate)}</span><span>·</span><span>Effective {label.labelEffectiveDate ? formatDate(label.labelEffectiveDate) : 'date not listed'}</span></div>
      </div>
    </div>
    <div className="detail-layout">
      <article className="reading-content medication-uses">
        <div className="key-callout"><strong>Read this carefully.</strong><br />This label is general product information, not a personal recommendation. The right medicine and use depend on your health and the exact product. Follow its full labeling and ask a clinician or pharmacist about personal questions.</div>
        <section>
          <h2>Labeled uses</h2>
          {label.usesText ? <div className="uses-copy">{label.usesText}</div> : <div className="uses-unavailable"><p>The current label did not expose a separate uses section in this view.</p><p>Open the original DailyMed label to review the complete product information, including uses, warnings, and directions.</p></div>}
        </section>
        <section><h2>What this page can and cannot tell you</h2><p>Label wording describes the product information supplied in the source record. It does not establish whether a medicine is appropriate for you, how to use it personally, or how it may interact with your health or other medicines.</p><p>For personal questions, speak with a clinician or pharmacist. Follow the product label and professional advice. For urgent or life-threatening symptoms, contact local emergency services.</p></section>
        <Disclaimer />
      </article>
      <aside className="source-box" aria-label="Original medication label">
        <h2>Original product source</h2>
        <div className="source-item"><a href={label.sourceUrl} target="_blank" rel="noreferrer" data-testid="link-original-dailymed-label">Read the complete label</a><span>DailyMed · U.S. National Library of Medicine</span><a className="outlink" href={label.sourceUrl} target="_blank" rel="noreferrer">Open original source <ExternalLink size={12} /></a></div>
        <p className="source-note">Uses are extracted from the source label, including its indication subsections. This view does not replace the complete label. DailyMed inclusion is not proof of FDA approval or effectiveness.</p>
        <Link href="/sources" className="text-link" style={{ marginTop: 9, fontSize: 11 }}>How we cite sources <ArrowRight size={13} /></Link>
      </aside>
    </div>
    <div className="detail-back"><Link href="/medications" className="text-link"><ArrowLeft size={14} /> Browse medication labels</Link></div>
    <Footer />
  </main>;
}

function SourceCitation({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId);
  if (!source) return null;
  return <div className="source-item" data-testid={`citation-${source.id}`}>
    <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
    <span>{source.organization}</span>
    <a className="outlink" href={source.url} target="_blank" rel="noreferrer">Open original source <ExternalLink size={12} /></a>
  </div>;
}

function Detail({ collection, id }: { collection: string; id: string }) {
  const entry = getEntry(id);
  const [, setLocation] = useLocation();
  if (!entry || collectionFor(entry.kind) !== collection) return <NotFound />;
  const siblings = entries.filter((item) => item.kind === entry.kind && item.id !== entry.id).slice(0, 3);
  const sourceNames = entry.sourceIds.map((sourceId) => getSource(sourceId)?.organization).filter(Boolean).join(', ');
  return <main className="shell">
    <div className="detail-top animate-arrive">
      <div className="breadcrumbs"><Link href={`/${collection}`}>{collection[0].toUpperCase() + collection.slice(1)}</Link><ChevronRight size={13} /><span>{entry.title}</span></div>
      <div className="detail-hero">
        <div className="eyebrow">{iconFor(entry.kind, 15)} {entry.kind} · {entry.category}</div>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
        <div className="detail-meta"><span>{entry.published ? <>Published <time dateTime={entry.published}>{formatArticleDate(entry.published)}</time> · {entry.articleType}</> : `Reviewed ${entry.checked}`}</span><span>·</span><span>Source: {sourceNames}</span></div>
        {entry.originalUrl && <a href={entry.originalUrl} target="_blank" rel="noopener noreferrer" className="button-primary article-source-action" data-testid="link-original-article">Read the full article at {entry.publisher} <ExternalLink size={15} /></a>}
      </div>
    </div>
    <div className="detail-layout">
      <article className="reading-content">
        <div className="key-callout"><strong>In brief</strong><br />This guide is for general education. Personal symptoms, test results, and medicine choices need individual advice from a qualified health professional.</div>
        {entry.sections.map((section) => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.blocks ? section.blocks.map((block, index) => block.kind === 'list'
            ? <ul key={index}>{block.items?.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul>
            : block.kind === 'table'
              ? <div className="condition-table-scroll" key={index}><table>
                <thead><tr>{block.headers?.map((header, column) => <th scope="col" key={column}>{header}</th>)}</tr></thead>
                <tbody>{block.rows?.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody>
              </table></div>
              : <p key={index}>{block.text}</p>) : <>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          </>}
        </section>)}
        <section><h2>When to seek help</h2><p>For personal questions, contact a clinician or pharmacist. If symptoms may be urgent or life-threatening, contact your local emergency services now.</p></section>
        <Disclaimer />
      </article>
      <aside className="source-box" aria-label="Primary sources">
        <h2>Read the original</h2>
        {entry.sourceIds.map((sourceId) => <SourceCitation key={sourceId} sourceId={sourceId} />)}
        <p className="source-note">{entry.published ? `Source checked ${entry.checked}. This is a curation check, not a clinical review. The publication date comes from the publisher; read the original for updates and corrections.` : 'Our editorial review date is October 2026. This is when Health Guide checked this summary; it does not mean the linked source page was updated then.'}</p>
        <Link href="/sources" className="text-link" style={{ marginTop: 9, fontSize: 11 }}>How we cite sources <ArrowRight size={13} /></Link>
      </aside>
    </div>
    {siblings.length > 0 && <section style={{ paddingBottom: 64 }}>
      <div className="section-head"><div><div className="eyebrow">Keep exploring</div><h2 className="serif" style={{ fontSize: 36 }}>More {entry.kind.toLowerCase()} guides</h2></div><Link href={`/${collection}`} className="text-link">Browse all <ArrowRight size={14} /></Link></div>
      <div className="topic-grid">{siblings.map((item) => <EntryCard key={item.id} entry={item} />)}</div>
    </section>}
    <Footer />
  </main>;
}

function SearchResults() {
  const [, setLocation] = useLocation();
  const query = new URLSearchParams(useSearch()).get('q')?.trim() || '';
  const normalizedQuery = query.toLowerCase();
  const results = entries.filter((entry) => {
    const sourcesForEntry = entry.sourceIds.map((sourceId) => {
      const source = getSource(sourceId);
      return source ? `${source.title} ${source.organization}` : '';
    }).join(' ');
    const searchableText = [
      entry.title,
      entry.category,
      entry.summary,
      ...entry.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.points || [])]),
      sourcesForEntry,
    ].join(' ').toLowerCase();
    return !normalizedQuery || searchableText.includes(normalizedQuery);
  });
  const submitSearch = (value: string) => setLocation(value ? `/search?q=${encodeURIComponent(value)}` : '/search');

  return <main className="shell">
    <div className="page-heading animate-arrive">
      <div className="eyebrow">The library / search</div>
      <h1 className="serif">{query ? `Results for “${query}”` : 'Search the health library.'}</h1>
      <p>Search across articles, condition guides, medicines, and their source information.</p>
    </div>
    <div className="library-controls">
      <SearchField initial={query} onSearch={submitSearch} />
    </div>
    <p className="result-count" aria-live="polite" data-testid="text-search-result-count">
      {results.length} {results.length === 1 ? 'guide' : 'guides'} found
    </p>
    {results.length ? <div className="listing-grid">{results.map((entry) => <EntryCard key={entry.id} entry={entry} />)}</div> : <div className="empty-state" data-testid="empty-global-search">
      <Search size={25} /><h2>No guides found</h2><p>Try another word, or explore a library below.</p>
      <div className="hero-actions">
        <Link href="/articles" className="text-link">Articles</Link>
        <Link href="/conditions" className="text-link">Conditions</Link>
        <Link href="/medications" className="text-link">Medications</Link>
      </div>
    </div>}
    <div style={{ paddingBottom: 50 }}><Disclaimer /></div>
    <Footer />
  </main>;
}

function SourcesPage() {
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / citations</div><h1 className="serif">Follow the source.</h1><p>Every guide and article brief links to its original source. Public-health guidance, medical explainers, research news, and journalism are distinct types of information.</p></div>
    <div className="disclaimer" style={{ marginBottom: 25 }}><strong>Editorial check date: October 2026.</strong> This date records our review of the summaries, not a claim that any source website was updated on that date.</div>
    <div className="sources-list">
      {sources.map((source) => {
        const topics = entries.filter((entry) => entry.sourceIds.includes(source.id));
        return <article className="source-directory-card" key={source.id} data-testid={`source-row-${source.id}`}>
          <div><h2>{source.title}</h2><p>{source.organization} · {source.description}</p></div>
          <a className="button-primary" style={{ padding: '10px 14px', fontSize: 11 }} href={source.url} target="_blank" rel="noreferrer">Visit original <ExternalLink size={13} /></a>
          <div className="source-tags" aria-label="Guides citing this source">{source.id === 'dailymed' && <Link href="/medications">Browse medication labels</Link>}{source.id === 'drugs-com' && <Link href="/drug-interactions">Drug interaction resources</Link>}{topics.map((entry) => <Link key={entry.id} href={entryHref(entry)}>{entry.title}</Link>)}</div>
        </article>;
      })}
    </div>
    <section style={{ paddingBottom: 34 }}><Disclaimer /></section>
    <Footer />
  </main>;
}

function NotFound() {
  const [, setLocation] = useLocation();
  return <main className="shell" style={{ minHeight: '70dvh', display: 'grid', placeItems: 'center' }}>
    <div className="empty-state" style={{ width: '100%', maxWidth: 530 }}><BookOpen size={28} /><h1 className="serif">We couldn’t find that guide.</h1><p>Try browsing the library or return to the reading room.</p><button className="button-primary" onClick={() => setLocation('/')}>Back to the home page <ArrowLeft size={14} /></button></div>
  </main>;
}

function App() {
  usePageMetadata();
  return <div className="site-wrap">
    <Header />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={() => <Library kind="Article" />} />
      <Route path="/blog">{() => <><BlogPage /><Footer /></>}</Route>
      <Route path="/blog/:slug">{(params) => <><BlogPostPage slug={params.slug} /><Footer /></>}</Route>
      <Route path="/symptom-checker">{() => <><SymptomCheckerPage /><Footer /></>}</Route>
      <Route path="/conditions" component={() => <Library kind="Condition" />} />
      <Route path="/find-a-doctor">{() => <><FindDoctorPage /><Footer /></>}</Route>
      <Route path="/questionnaires">{() => <><QuestionnairesPage /><Footer /></>}</Route>
      <Route path="/medications" component={MedicationCatalog} />
      <Route path="/drug-interactions">{() => <><DrugInteractionsPage /><Footer /></>}</Route>
      <Route path="/medications/:id">{(params) => <MedicationRecordRoute id={params.id} />}</Route>
      <Route path="/pulsecare">{() => <><PulseCarePage /><Footer /></>}</Route>
      <Route path="/resources">{() => <><ResourcesPage /><Footer /></>}</Route>
      <Route path="/find-food">{() => <><FindFoodPage /><Footer /></>}</Route>
      <Route path="/housing-assistance">{() => <><HousingAssistancePage /><Footer /></>}</Route>
      <Route path="/give-back">{() => <><GiveBackPage /><Footer /></>}</Route>
      <Route path="/vaccines">{() => <><VaccinesPage /><Footer /></>}</Route>
      <Route path="/goodrx">{() => <><GoodRxPage /><Footer /></>}</Route>
      <Route path="/sources" component={SourcesPage} />
      <Route path="/search" component={SearchResults} />
      <Route path="/:collection/:id">{(params) => <Detail collection={params.collection} id={params.id} />}</Route>
      <Route component={NotFound} />
    </Switch>
  </div>;
}

export default App;
