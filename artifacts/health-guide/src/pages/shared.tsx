import { ExternalLink } from 'lucide-react';
export function Out({ href, children, className = 'outlink-btn' }: { href: string; children: React.ReactNode; className?: string }) {
  const tel = href.startsWith('tel:');
  return <a className={className} href={href} {...(tel ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>{children}{!tel && <><ExternalLink size={12} aria-hidden="true" /><span className="sr-only"> (opens external site in a new tab, leaves Health Guide)</span></>}</a>;
}
