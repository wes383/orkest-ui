import Link from 'next/link';

import type { NavGroup } from '@/lib/docs-types';

function normalizePath(value: string): string {
  return value.replace(/\/+$/, '') || '/';
}

export function DocsNav({
  navigation,
  activePath,
  onNavigate,
}: {
  navigation: NavGroup[];
  activePath: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="docs-nav" aria-label="Documentation">
      {navigation.map((group) => (
        <section className="docs-nav-group" key={group.id}>
          <p className="docs-nav-group-title">{group.label}</p>
          <ul className="docs-nav-list">
            {group.items.map((item) => {
              const isActive = normalizePath(item.href) === normalizePath(activePath);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="docs-nav-link"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
