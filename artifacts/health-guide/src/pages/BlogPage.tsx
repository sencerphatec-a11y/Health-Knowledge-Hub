import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { communityPosts, communityChecked, getCommunityPost, getCommunitySource, communityPostStatus } from '../data/community-blog';
import type { CommunityPost } from '../data/community-blog';
import { Out } from './shared';
import './BlogPage.css';

const fmt = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function Disclosure() {
  return <p className="disclaimer cb-disc" data-testid="text-blog-disclosure"><strong>Independent community blog.</strong> These are original Health Guide posts based on linked public sources, checked {communityChecked}. Health Guide is not affiliated with the City of West Des Moines or the library, and this is not an automatically updated news feed.</p>;
}

function Badge({ post }: { post: CommunityPost }) {
  const s = communityPostStatus(post);
  const cls = s === 'Today' ? 'live' : s === 'Past event' ? 'past' : '';
  return <span className={`cb-badge ${cls}`} data-testid={`status-${post.slug}`}>{s}</span>;
}

export default function BlogPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = useMemo(() => ['All', ...Array.from(new Set(communityPosts.map(p => p.category)))], []);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return communityPosts.filter(p => (cat === 'All' || p.category === cat) &&
      (!t || [p.title, p.summary, p.category, p.status].join(' ').toLowerCase().includes(t)));
  }, [q, cat]);
  const filtering = q.trim() !== '' || cat !== 'All';
  const lead = !filtering ? list[0] : undefined;
  const rest = lead ? list.slice(1) : list;

  return <main className="shell cb">
    <header className="cb-mast animate-arrive">
      <div><div className="eyebrow">Community blog / West Des Moines, Iowa</div>
        <h1>Good news, <em>close to home.</em></h1></div>
      <div className="cb-locale"><b>West Des Moines, Iowa</b>Positive stories about the library, parks, arts, and neighbors helping neighbors, each linked to its public source.</div>
    </header>
    <Disclosure />
    <div className="cb-tools">
      <label className="library-search"><Search size={15} aria-hidden="true" /><span className="sr-only">Search community posts</span>
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search posts" data-testid="input-blog-search" /></label>
      {cats.map(c => <button key={c} type="button" className={`filter-chip${cat === c ? ' active' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)} data-testid={`button-topic-${c}`}>{c}</button>)}
    </div>
    <p className="result-count" role="status">{list.length} of {communityPosts.length} posts</p>

    {lead && <article className="cb-lead" data-testid={`card-lead-${lead.slug}`}>
      <div className="cb-lead-art"><div className="eyebrow" style={{ color: '#cfe0d6' }}>Lead story</div><div className="cb-big serif">West Des Moines</div></div>
      <div className="cb-lead-body"><div className="cb-row"><Badge post={lead} /><span>{lead.category}</span></div>
        <h2>{lead.title}</h2><p>{lead.summary}</p>
        <div className="cb-row" style={{ marginBottom: 16 }}>Blog post {fmt(lead.published)}</div>
        <Link href={`/blog/${lead.slug}`} className="button-primary" data-testid={`link-post-${lead.slug}`}>Read the story <ArrowRight size={14} aria-hidden="true" /></Link></div>
    </article>}

    {rest.length > 0 && <div className="cb-grid">
      {rest.map(p => <article className="cb-card" key={p.slug} data-testid={`card-post-${p.slug}`}>
        <div className="cb-row"><Badge post={p} /><span>{p.category}</span></div>
        <h2>{p.title}</h2><p>{p.summary}</p>
        <div className="cb-row" style={{ marginBottom: 12 }}>Blog post {fmt(p.published)}</div>
        <Link href={`/blog/${p.slug}`} className="text-link" data-testid={`link-post-${p.slug}`}>Read post <ArrowRight size={13} aria-hidden="true" /></Link>
      </article>)}
    </div>}

    {list.length === 0 && <div className="empty-state"><h2>No posts match.</h2><p>Try a different word or topic.</p>
      <button type="button" className="button-primary" onClick={() => { setQ(''); setCat('All'); }} data-testid="button-clear-filters">Clear filters</button></div>}
  </main>;
}

export function BlogPostPage({ slug }: { slug: string }) {
  const post = getCommunityPost(slug);
  if (!post) return <main className="shell cb"><div className="cb-status-nf" data-testid="status-not-found">
    <div className="eyebrow">Community blog</div><h1>We could not find that post.</h1>
    <p className="hero-copy">The link may be mistyped or the post may have moved. Browse all community stories instead.</p>
    <Link href="/blog" className="button-primary" style={{ marginTop: 20 }} data-testid="link-back-blog"><ArrowLeft size={14} aria-hidden="true" /> Back to the blog</Link></div></main>;

  const status = communityPostStatus(post);
  const sources = post.sourceIds.map(getCommunitySource).filter((s): s is NonNullable<typeof s> => !!s);
  return <main className="shell cb">
    <div className="detail-top animate-arrive">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/blog" data-testid="link-back-blog"><ArrowLeft size={12} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Community blog</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <div className="detail-hero">
        <div className="cb-row"><Badge post={post} /><span className="eyebrow" style={{ display: 'inline-flex' }}>{post.category} / West Des Moines, Iowa</span></div>
        <h1>{post.title}</h1><p>{post.summary}</p>
      </div>
    </div>
    <div className="detail-layout">
      <article className="reading-content">
        <div className="cb-dates">
          <div><strong>Blog post date</strong>{fmt(post.published)} (Health Guide)</div>
          <div><strong>Sources checked</strong>{communityChecked}</div>
        </div>
        {post.eventDetails && <div className="cb-event" data-testid="text-event-details"><strong>{status}:</strong> {post.eventDetails}</div>}
        {status === 'Past event' && <div className="cb-warn" data-testid="warning-archive"><strong>Archive notice.</strong> The scheduled date has passed. This is an archived preview, not confirmation that the event took place.</div>}
        {post.eventDate && status !== 'Past event' && <div className="cb-warn"><strong>Verify with the organizers</strong> before attending, since details can change.</div>}
        {post.eventDate && status === 'Past event' && <div className="cb-warn">Verify with organizers for any follow-up sessions.</div>}
        <p className="key-callout"><strong>About the sources.</strong> {post.sourceNote}</p>
        {post.sections.map(s => <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((para, i) => <p key={i}>{para}</p>)}
          <div className="cb-cite">Source:{s.sourceIds.map(id => { const src = getCommunitySource(id); return src ? <a key={id} href={src.url} target="_blank" rel="noopener noreferrer">{src.title}<span className="sr-only"> (opens in a new tab)</span></a> : null; })}</div>
        </section>)}
        <Disclosure />
        <Link href="/blog" className="text-link" data-testid="link-back-blog-bottom"><ArrowLeft size={13} aria-hidden="true" /> Back to all posts</Link>
      </article>
      <aside className="source-box" aria-label="Original sources">
        <h2>Original sources and get involved</h2>
        {sources.map(s => <div className="source-item" key={s.id} data-testid={`source-${s.id}`}>
          <span style={{ fontWeight: 700 }}>{s.organization}</span>
          <Out href={s.url} className="outlink-btn" ><span>{s.title}</span></Out>
          <span style={{ marginTop: 8 }}>{s.published ? `Source published ${fmt(s.published)}` : 'No source publication date displayed'}</span>
        </div>)}
        <p className="source-note">Checked {communityChecked}. Use the original pages for current details.</p>
      </aside>
    </div>
  </main>;
}
