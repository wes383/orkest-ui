'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/docs/', label: 'Docs' },
  { href: '/docs/foundations/colors/', label: 'Foundations', prefix: '/docs/foundations' },
  { href: '/docs/components/box/', label: 'Components', prefix: '/docs/components' },
  { href: '/docs/guides/theming/', label: 'Guides', prefix: '/docs/guides' },
];

function normalizePath(value: string): string {
  return value.replace(/\/+$/, '') || '/';
}

export function PrimaryNav() {
  const pathname = usePathname();
  const current = normalizePath(pathname);

  return (
    <nav className="primary-nav" aria-label="Primary">
      {links.map((link) => {
        const isActive = link.prefix
          ? current === link.prefix || current.startsWith(`${link.prefix}/`)
          : current === '/docs';
        // A section link marks the current section; only a link to the page
        // itself may claim aria-current="page".
        const ariaCurrent = isActive
          ? current === normalizePath(link.href)
            ? 'page'
            : 'true'
          : undefined;

        return (
          <Link
            href={link.href}
            className="primary-nav-link"
            aria-current={ariaCurrent}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
