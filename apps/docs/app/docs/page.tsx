import type { Metadata } from 'next';
import Link from 'next/link';

import { getNavigation } from '@/lib/docs-source';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Guides, foundations, and component references for Orkest UI.',
};

export default function DocsIndexPage() {
  const navigation = getNavigation();

  return (
    <div className="docs-index">
      <header className="page-header">
        <p className="page-eyebrow">Documentation</p>
        <h1 className="page-title">Everything you need to build with Orkest UI.</h1>
        <p className="page-description">
          Start with the foundations, explore the shipped components, and follow the guides to
          integrate the library into a React or Next.js application.
        </p>
      </header>

      {navigation.map((group) => (
        <section className="docs-index-section" id={group.id} key={group.id}>
          <h2 className="docs-index-title">{group.label}</h2>
          <p className="docs-index-description">{group.description}</p>
          <div className="docs-index-grid">
            {group.items.map((item) => (
              <Link className="docs-index-card" href={item.href} key={item.href}>
                <span className="docs-index-card-title">{item.title}</span>
                <span className="docs-index-card-action">Read page</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
