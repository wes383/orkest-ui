'use client';

import { usePathname } from 'next/navigation';

import type { NavGroup } from '@/lib/docs-types';

import { DocsNav } from './docs-nav';
import { useScrollOverflow } from './use-scroll-overflow';

export function DocsSidebar({ navigation }: { navigation: NavGroup[] }) {
  const pathname = usePathname();
  const { ref, overflowing } = useScrollOverflow<HTMLDivElement>(navigation);

  return (
    <aside className="docs-sidebar">
      <div
        ref={ref}
        className={
          overflowing ? 'docs-sidebar-scroll docs-sidebar-scrollable' : 'docs-sidebar-scroll'
        }
      >
        <DocsNav navigation={navigation} activePath={pathname} />
      </div>
    </aside>
  );
}
