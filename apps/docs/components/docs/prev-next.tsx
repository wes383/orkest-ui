import Link from 'next/link';

import type { NavItem } from '@/lib/docs-types';

export function PrevNext({
  previous,
  next,
}: {
  previous: NavItem | null;
  next: NavItem | null;
}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="prev-next" aria-label="Previous and next pages">
      {previous ? (
        <Link href={previous.href} className="page-nav-link">
          <span className="page-nav-label">Previous</span>
          <span className="page-nav-title">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="page-nav-link page-nav-next">
          <span className="page-nav-label">Next</span>
          <span className="page-nav-title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
