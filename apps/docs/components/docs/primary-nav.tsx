'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/docs/', label: 'Docs' },
  { href: '/docs/foundations/colors/', label: 'Foundations', prefix: '/docs/foundations' },
  { href: '/docs/components/box/', label: 'Components', prefix: '/docs/components' },
  { href: '/docs/guides/theming/', label: 'Guides', prefix: '/docs/guides' },
];

export function PrimaryNav() {
  const pathname = usePathname();
  const current = pathname.replace(/\/+$/, '') || '/';

  return (
    <nav className="primary-nav" aria-label="Primary">
      {links.map((link) => {
        const isActive = link.prefix
          ? current === link.prefix || current.startsWith(`${link.prefix}/`)
          : current === '/docs';

        return (
          <Link
            href={link.href}
            className="primary-nav-link"
            aria-current={isActive ? 'page' : undefined}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
