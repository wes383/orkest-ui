'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteFooter() {
  const pathname = usePathname();
  const current = pathname.replace(/\/+$/, '') || '/';

  if (current !== '/') {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>Orkest UI · A neutral-first React component library.</p>
        <Link href="/docs/introduction/">Read the documentation</Link>
      </div>
    </footer>
  );
}
