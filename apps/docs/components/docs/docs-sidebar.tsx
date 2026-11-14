'use client';

import { usePathname } from 'next/navigation';

import type { NavGroup } from '@/lib/docs-types';

import { DocsNav } from './docs-nav';

export function DocsSidebar({ navigation }: { navigation: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      <DocsNav navigation={navigation} activePath={pathname} />
    </aside>
  );
}
