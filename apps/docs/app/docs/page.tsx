import { Icon } from '@orkest/ui';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getNavigation } from '@/lib/docs-source';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Guides, foundations, and component references for Orkest UI.',
};

export default function DocsIndexPage() {
  const navigation = getNavigation();
  const pageCount = navigation.reduce((total, group) => total + group.items.length, 0);
  const componentCount = navigation.find((group) => group.id === 'components')?.items.length ?? 0;

  return (
    <div className="docs-index">
      <header className="page-header docs-index-header">
        <p className="page-eyebrow">Documentation</p>
        <h1 className="page-title">Build with Orkest UI.</h1>
        <p className="page-description">
          Start with the foundations, explore the shipped components, and follow the guides to
          integrate the library into a React or Next.js application.
        </p>
        <p className="page-meta">
          <span>{pageCount} pages</span>
          <span aria-hidden="true">·</span>
          <span>{componentCount} components</span>
        </p>
      </header>

      {navigation.map((group, index) => (
        <section className="docs-index-section" id={group.id} key={group.id}>
          <div className="docs-index-section-header">
            <span className="docs-index-number">{String(index + 1).padStart(2, '0')}</span>
            <h2 className="docs-index-title">{group.label}</h2>
            <p className="docs-index-description">{group.description}</p>
          </div>
          <div className="docs-index-grid">
            {group.items.map((item) => (
              <Link className="docs-index-card" href={item.href} key={item.href}>
                <span className="docs-index-card-title">{item.title}</span>
                <span className="docs-index-card-action">
                  <Icon icon={ArrowUpRight} size="sm" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
