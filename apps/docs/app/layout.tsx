import type { Metadata } from 'next';
import Link from 'next/link';

import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/plus-jakarta-sans';

import '@orkest/ui/style.css';
import './globals.css';

import { DocsHeader } from '@/components/docs/docs-header';
import { ThemeScript } from '@/components/docs/theme-script';
import { getNavigation, getSearchIndex } from '@/lib/docs-source';

export const metadata: Metadata = {
  title: {
    default: 'Orkest UI',
    template: '%s · Orkest UI',
  },
  description:
    'A neutral-first React component library with accessible primitives, semantic design tokens, and light and dark themes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navigation = getNavigation();
  const searchIndex = getSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <DocsHeader navigation={navigation} searchIndex={searchIndex} />
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <p>Orkest UI · A neutral-first React component library.</p>
            <Link href="/docs/introduction/">Read the documentation</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
