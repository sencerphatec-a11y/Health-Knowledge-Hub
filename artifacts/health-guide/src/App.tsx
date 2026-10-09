import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ChevronRight, ExternalLink, FileText, HeartPulse, Pill, Search } from 'lucide-react';
import { entries, getEntry, getSource, sources, type Kind, type LibraryEntry } from './data';

const navItems = [
  { label: 'Articles', href: '/articles' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Medications', href: '/medications' },
  { label: 'Sources', href: '/sources' },
];
const collectionFor = (kind: Kind) => kind === 'Article' ? 'articles' : kind === 'Condition' ? 'conditions' : 'medications';
const iconFor = (kind: Kind, size = 17) => kind === 'Article' ? <FileText size={size} strokeWidth={1.7} /> : kind === 'Condition' ? <HeartPulse size={size} strokeWidth={1.7} /> : <Pill size={size} strokeWidth={1.7} />;
const entryHref = (entry: LibraryEntry) => `/${collectionFor(entry.kind)}/${entry.id}`;

function usePageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const [pathname, queryString = ''] = location.split('?');
    const segments = pathname.split('/').filter(Boolean);
    const entry = segments.length === 2 ? getEntry(segments[1]) : undefined;
    const query = new URLSearchParams(queryString).get('q')?.trim();
    let title = 'Trusted health information, articles & guides | Health Guide';
    let description = 'Find clear, evidence-based health articles, condition guides, and medication information, with every topic linked to trusted medical sources.';
    let type = 'website';

    if (entry) {
      title = `${entry.title}: evidence-based guide | Health Guide`;
      description = `${entry.summary} Read the plain-language overview and follow links to the original medical sources.`;
      type = 'article';
    } else if (pathname === '/articles') {
      title = 'Evidence-based health articles & explainers | Health Guide';
      description = 'Read clear explainers about common health questions, medication labels, and public health topics. Every article links to its original sources.';
    } else if (pathname === '/conditions') {
      title = 'Condition library: clear health guides | Health Guide';
      description = 'Explore plain-language guides to common health conditions, with trusted sources and reminders to discuss personal concerns with a clinician.';
    } else if (pathname === '/medications') {
      title = 'Medication guides & medicine safety | Health Guide';
      description = 'Understand common medicines and their safety information. Find original drug information and follow the label and professional advice.';
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
  }, [location]);
}

function Header() {
  const [location] = useLocation();
  return <>
    <header className="shell topbar">
      <Link href="/" className="brand" aria-label="Health Guide home" data-testid="link-home-brand">
        <span className="brand-mark"><HeartPulse size={19} strokeWidth={1.7} /></span>
        <span>health guide</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={location.startsWith(item.href) ? 'page' : undefined} data-testid={`nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
      </nav>
      <Link href="/sources" className="text-link" style={{ fontSize: 12 }} data-testid="link-source-standard">Our standard <ArrowUpRight size={14} /></Link>
    </header>
    <nav className="shell nav-mobile" aria-label="Main navigation">
      {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={location.startsWith(item.href) ? 'page' : undefined} data-testid={`mobile-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
    </nav>
  </>;
}

function Footer() {
  return <footer className="footer">
    <div className="shell footer-inner">
      <div><div className="brand" style={{ fontSize: 15 }}><span className="brand-mark" style={{ width: 28, height: 28 }}><HeartPulse size={15} /></span><span>health guide</span></div><p style={{ margin: '9px 0 0' }}>Clear answers. Credible sources. No diagnosis.</p></div>
      <div className="footer-links"><Link href="/articles">Articles</Link><Link href="/conditions">Conditions</Link><Link href="/medications">Medications</Link><Link href="/sources">Sources</Link></div>
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
    <button className={home ? 'search-submit' : 'sr-only'} type="submit" data-testid={home ? 'button-home-search' : 'button-library-search'}>{home ? 'Search library' : 'Search'}</button>
  </form>;
}

function Home() {
  const [, setLocation] = useLocation();
  const doSearch = (query: string) => setLocation(query ? `/search?q=${encodeURIComponent(query)}` : '/articles');
  const articlePicks = entries.filter((entry) => entry.kind === 'Article');
  return <main>
    <div className="shell hero animate-arrive">
      <div>
        <div className="eyebrow">A public health reading room</div>
        <h1>Good health starts with <em>good information.</em></h1>
        <p className="hero-copy">Clear, considered explanations for everyday health questions—grounded in trusted public-health sources, and written for real life.</p>
        <div className="hero-actions">
          <Link href="/articles" className="button-primary" data-testid="link-browse-articles">Browse the library <ArrowRight size={15} /></Link>
          <Link href="/sources" className="text-link" data-testid="link-view-sources">See our sources <ArrowUpRight size={15} /></Link>
        </div>
      </div>
      <div className="hero-art" aria-label="Illustration of a quiet sprouting branch" role="img">
        <span className="art-stem" /><span className="leaf leaf-a" /><span className="leaf leaf-b" /><span className="leaf leaf-c" /><span className="leaf leaf-d" />
        <span className="art-note">A little clarity goes a long way.</span>
      </div>
    </div>
    <div className="shell"><SearchField home onSearch={doSearch} /></div>
    <section className="shell section">
      <div className="section-head"><div><div className="eyebrow">Start with a topic</div><h2 className="serif">A useful place to begin.</h2></div><p>Explore our library of common conditions, medicines, and the questions people ask about them.</p></div>
      <div className="topic-grid">
        {[
          { href: '/conditions', icon: <HeartPulse size={18} />, count: '03 guides', title: 'Conditions', copy: 'Plain-language introductions to common health conditions.' },
          { href: '/medications', icon: <Pill size={18} />, count: '03 guides', title: 'Medications', copy: 'What common medicines are for, and where to find safety details.' },
          { href: '/articles', icon: <BookOpen size={18} />, count: '03 explainers', title: 'Articles', copy: 'Helpful context for readings, labels, and everyday questions.' },
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
      <div className="section-head"><div><div className="eyebrow">A few good reads</div><h2 className="serif">The essentials, simply told.</h2></div><Link href="/articles" className="text-link">All articles <ArrowRight size={15} /></Link></div>
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
    <div className="card-bottom"><span>Read the guide</span><ArrowUpRight size={15} /></div>
  </Link>;
}

function Library({ kind }: { kind: Kind }) {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = params.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState('All topics');
  const baseEntries = useMemo(() => entries.filter((entry) => entry.kind === kind), [kind]);
  const categories = ['All topics', ...Array.from(new Set(baseEntries.map((entry) => entry.category)))];
  const filtered = baseEntries.filter((entry) => {
    const matchesQuery = `${entry.title} ${entry.summary} ${entry.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === 'All topics' || entry.category === filter);
  });
  const collectionName = kind === 'Article' ? 'Articles' : kind === 'Condition' ? 'Conditions' : 'Medications';
  const description = kind === 'Article'
    ? 'Short explainers for common health questions, built around trusted public-health sources.'
    : kind === 'Condition'
      ? 'Straightforward introductions to common conditions. Start here for context, then bring personal questions to a clinician.'
      : 'Understand the basics of common medicines and check the original information and product labeling.';
  return <main className="shell">
    <div className="page-heading animate-arrive"><div className="eyebrow">The library / {collectionName}</div><h1 className="serif">{collectionName}, made clearer.</h1><p>{description}</p></div>
    <div className="library-controls">
      <SearchField initial={initialQuery} onSearch={(value) => { setQuery(value); setLocation(value ? `/${collectionFor(kind)}?q=${encodeURIComponent(value)}` : `/${collectionFor(kind)}`); }} />
      {categories.map((category) => <button key={category} type="button" className={`filter-chip${filter === category ? ' active' : ''}`} onClick={() => setFilter(category)} aria-pressed={filter === category} data-testid={`filter-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}
    </div>
    <p className="result-count" aria-live="polite" data-testid="text-result-count">{filtered.length} {filtered.length === 1 ? 'guide' : 'guides'} in this collection</p>
    {filtered.length ? <div className="listing-grid">{filtered.map((entry) => <EntryCard key={entry.id} entry={entry} />)}</div> : <div className="empty-state" data-testid="empty-search"><Search size={25} /><h2>No guides found</h2><p>Try another word or choose a different topic.</p><button className="button-primary" onClick={() => { setQuery(''); setFilter('All topics'); setLocation(`/${collectionFor(kind)}`); }}>Clear search and filters</button></div>}
    <div style={{ paddingBottom: 50 }}><Disclaimer /></div>
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
        <div className="detail-meta"><span>Reviewed {entry.checked}</span><span>·</span><span>Source: {sourceNames}</span></div>
      </div>
    </div>
    <div className="detail-layout">
      <article className="reading-content">
        <div className="key-callout"><strong>In brief</strong><br />This guide is for general education. Personal symptoms, test results, and medicine choices need individual advice from a qualified health professional.</div>
        {entry.sections.map((section) => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
        </section>)}
        <section><h2>When to seek help</h2><p>For personal questions, contact a clinician or pharmacist. If symptoms may be urgent or life-threatening, contact your local emergency services now.</p></section>
        <Disclaimer />
      </article>
      <aside className="source-box" aria-label="Primary sources">
        <h2>Read the original</h2>
        {entry.sourceIds.map((sourceId) => <SourceCitation key={sourceId} sourceId={sourceId} />)}
        <p className="source-note">Our editorial review date is October 2026. This is when Health Guide checked this summary; it does not mean the linked source page was updated then.</p>
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
  const [location, setLocation] = useLocation();
  const query = new URLSearchParams(location.split('?')[1] || '').get('q')?.trim() || '';
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
    <div className="page-heading animate-arrive"><div className="eyebrow">The reading room / citations</div><h1 className="serif">Follow the source.</h1><p>We believe health information should show its work. Every guide points back to the public-health material behind its summary.</p></div>
    <div className="disclaimer" style={{ marginBottom: 25 }}><strong>Editorial check date: October 2026.</strong> This date records our review of the summaries, not a claim that any source website was updated on that date.</div>
    <div className="sources-list">
      {sources.map((source) => {
        const topics = entries.filter((entry) => entry.sourceIds.includes(source.id));
        return <article className="source-directory-card" key={source.id} data-testid={`source-row-${source.id}`}>
          <div><h2>{source.title}</h2><p>{source.organization} · {source.description}</p></div>
          <a className="button-primary" style={{ padding: '10px 14px', fontSize: 11 }} href={source.url} target="_blank" rel="noreferrer">Visit original <ExternalLink size={13} /></a>
          <div className="source-tags" aria-label="Guides citing this source">{topics.map((entry) => <Link key={entry.id} href={entryHref(entry)}>{entry.title}</Link>)}</div>
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
      <Route path="/conditions" component={() => <Library kind="Condition" />} />
      <Route path="/medications" component={() => <Library kind="Medication" />} />
      <Route path="/sources" component={SourcesPage} />
      <Route path="/search" component={SearchResults} />
      <Route path="/:collection/:id">{(params) => <Detail collection={params.collection} id={params.id} />}</Route>
      <Route component={NotFound} />
    </Switch>
  </div>;
}

export default App;
