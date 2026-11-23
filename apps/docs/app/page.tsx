import { readFileSync } from 'node:fs';
import path from 'node:path';

import { Icon } from '@orkest/ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import {
  ActionsShowcase,
  DisclosureShowcase,
  DisplayShowcase,
  FeedbackShowcase,
  FieldsShowcase,
  FormattingShowcase,
  MenuShowcase,
  PickersShowcase,
  RangeShowcase,
  SheetShowcase,
  TabsShowcase,
  TogglesShowcase,
} from '@/components/landing/showcase';
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

      <section className="landing-showcase" aria-label="Live component previews">
        <div className="landing-showcase-grid">
          <div className="landing-showcase-cell">
            <ActionsShowcase />
          </div>
          <div className="landing-showcase-cell">
            <FieldsShowcase />
          </div>
          <div className="landing-showcase-cell">
            <TogglesShowcase />
          </div>
          <div className="landing-showcase-cell">
            <TabsShowcase />
          </div>
          <div className="landing-showcase-cell">
            <PickersShowcase />
          </div>
          <div className="landing-showcase-cell">
            <DisplayShowcase />
          </div>
          <div className="landing-showcase-cell">
            <FormattingShowcase />
          </div>
          <div className="landing-showcase-cell">
            <RangeShowcase />
          </div>
          <div className="landing-showcase-cell">
            <MenuShowcase />
          </div>
          <div className="landing-showcase-cell">
            <SheetShowcase />
          </div>
          <div className="landing-showcase-cell">
            <DisclosureShowcase />
          </div>
          <div className="landing-showcase-cell">
            <FeedbackShowcase />
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p className="landing-footer-facts">
          <span>{componentCount} components</span>
          <span>v{version}</span>
          <span>{license}</span>
        </p>
        <p className="landing-footer-copyright">© {new Date().getFullYear()} Orkest UI</p>
      </footer>
    </div>
  );
}
