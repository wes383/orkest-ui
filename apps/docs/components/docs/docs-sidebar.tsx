'use client';

import { usePathname } from 'next/navigation';

import type { NavGroup } from '@/lib/docs-types';

import { DocsNav } from './docs-nav';
import { useScrollOverflow } from './use-scroll-overflow';

export function DocsSidebar({ navigation }: { navigation: NavGroup[] }) {
  const pathname = usePathname();
  const { ref, overflowing } = useScrollOverflow<HTMLElement>(navigation);

  return (
    <aside
      ref={ref}
      className={overflowing ? 'docs-sidebar docs-sidebar-scrollable' : 'docs-sidebar'}
    >
      <DocsNav navigation={navigation} activePath={pathname} />
    </aside>
  );
}
