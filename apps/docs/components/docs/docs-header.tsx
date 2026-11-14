import Link from 'next/link';

import type { NavGroup, SearchIndexItem } from '@/lib/docs-types';

import { MobileNav } from './mobile-nav';
import { PrimaryNav } from './primary-nav';
import { SearchDialog } from './search-dialog';
import { ThemeToggle } from './theme-toggle';

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
        <span className="brand-badge">Preview</span>

        <PrimaryNav />

        <div className="header-actions">
          <SearchDialog index={searchIndex} />
          <ThemeToggle />
          <MobileNav navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
