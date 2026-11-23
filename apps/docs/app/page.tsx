import { readFileSync } from 'node:fs';
import path from 'node:path';

import { Icon } from '@orkest/ui';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { CalendarShowcase, DialogShowcase, ToastShowcase } from '@/components/landing/showcase';
import { getNavigation } from '@/lib/docs-source';

interface PackageMetadata {
  version: string;
  license: string;
}

function readPackageMetadata(): PackageMetadata {
  const file = path.join(process.cwd(), '..', '..', 'packages', 'ui', 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8')) as Partial<PackageMetadata>;

  return { version: pkg.version ?? '0.0.0', license: pkg.license ?? 'Apache-2.0' };
}

export default function HomePage() {
  const componentCount =
    getNavigation().find((group) => group.id === 'components')?.items.length ?? 0;
  const { version, license } = readPackageMetadata();

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <h1 className="landing-title">
            UI, <span className="landing-title-accent">thoughtfully</span> made.
          </h1>
          <p className="landing-lede">
            A lightweight, accessible, and flexible React component library designed to help
            developers build consistent, beautiful user interfaces with ease.
          </p>
          <div className="landing-actions">
            <Link className="button-link" href="/docs/installation/">
              Get started
              <Icon icon={ArrowRight} size="sm" />
            </Link>
            <Link className="button-link button-link-secondary" href="/docs/components/box/">
              Browse components
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-showcase" aria-labelledby="landing-showcase">
        <div className="landing-showcase-heading">
          <p className="landing-kicker">Live preview</p>
          <h2 className="landing-showcase-title" id="landing-showcase">
            Real components, not screenshots.
          </h2>
          <p className="landing-showcase-lede">
            Click, type, and open — every demo below runs the same code that ships in the package.
          </p>
        </div>
        <div className="landing-showcase-grid">
          <article className="landing-showcase-card landing-showcase-calendar">
            <header className="landing-showcase-header">
              <span className="landing-showcase-name">Calendar</span>
              <Link className="landing-showcase-link" href="/docs/components/calendar/">
                Docs
                <Icon icon={ArrowUpRight} size="sm" />
              </Link>
            </header>
            <div className="landing-showcase-body">
              <CalendarShowcase />
            </div>
          </article>
          <article className="landing-showcase-card">
            <header className="landing-showcase-header">
              <span className="landing-showcase-name">Dialog</span>
              <Link className="landing-showcase-link" href="/docs/components/dialog/">
                Docs
                <Icon icon={ArrowUpRight} size="sm" />
              </Link>
            </header>
            <div className="landing-showcase-body">
              <DialogShowcase />
            </div>
          </article>
          <article className="landing-showcase-card">
            <header className="landing-showcase-header">
              <span className="landing-showcase-name">Toast</span>
              <Link className="landing-showcase-link" href="/docs/components/toast/">
                Docs
                <Icon icon={ArrowUpRight} size="sm" />
              </Link>
            </header>
            <div className="landing-showcase-body">
              <ToastShowcase />
            </div>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo">
              <span className="landing-title-accent">O</span>rkest UI
            </span>
            <p className="landing-footer-tagline">
              Neutral-first React components with semantic design tokens, accessible behavior, and
              light and dark themes.
            </p>
          </div>
          <div className="landing-footer-links">
            <a
              className="landing-footer-link"
              href="https://github.com/wes383/orkest-ui"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <Icon icon={ArrowUpRight} size="sm" />
            </a>
            <a
              className="landing-footer-link"
              href="https://www.npmjs.com/package/@orkest/ui"
              target="_blank"
              rel="noreferrer"
            >
              npm
              <Icon icon={ArrowUpRight} size="sm" />
            </a>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p className="landing-footer-facts">
            <span>{componentCount} components</span>
            <span>v{version}</span>
            <span>{license}</span>
            <span>Built on Base UI</span>
          </p>
          <p className="landing-footer-copyright">© {new Date().getFullYear()} Orkest UI</p>
        </div>
      </footer>
    </div>
  );
}
