import Link from 'next/link';

import type { NavGroup, SearchIndexItem } from '@/lib/docs-types';

import { MobileNav } from './mobile-nav';
import { SearchDialog } from './search-dialog';
import { ThemeToggle } from './theme-toggle';

const primaryLinks = [
  { href: '/docs/', label: 'Docs' },
  { href: '/docs/foundations/colors/', label: 'Foundations' },
  { href: '/docs/components/box/', label: 'Components' },
  { href: '/docs/guides/theming/', label: 'Guides' },
];

export function DocsHeader({
  navigation,
  searchIndex,
}: {
  navigation: NavGroup[];
  searchIndex: SearchIndexItem[];
}) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Orkest UI home">
          <span className="brand-mark" aria-hidden="true">
            O
          </span>
          <span className="brand-name">Orkest UI</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <SearchDialog index={searchIndex} />
          <ThemeToggle />
          <MobileNav navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
