import { Icon } from '@orkest/ui';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const exploreLinks = [
  {
    index: '01',
    href: '/docs/foundations/colors/',
    title: 'Foundations',
    description: 'Colors, typography, spacing, radius, and motion.',
  },
  {
    index: '02',
    href: '/docs/components/box/',
    title: 'Components',
    description: 'Live examples, API references, and accessibility guidance.',
  },
  {
    index: '03',
    href: '/docs/guides/theming/',
    title: 'Guides',
    description: 'Theming, TypeScript, and Next.js integration.',
  },
];

export default function HomePage() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <h1 className="landing-title">
            Thoughtfully crafted components for{' '}
            <span className="landing-title-accent">modern interfaces.</span>
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

      <section className="landing-explore" aria-labelledby="landing-explore">
        <div className="landing-explore-heading">
          <p className="landing-kicker">Explore</p>
          <h2 className="landing-explore-title" id="landing-explore">
            Start where you need to.
          </h2>
        </div>
        <div className="landing-links">
          {exploreLinks.map((link) => (
            <Link className="landing-link" href={link.href} key={link.href}>
              <span className="landing-link-index">{link.index}</span>
              <span className="landing-link-copy">
                <span className="landing-link-title">{link.title}</span>
                <span className="landing-link-description">{link.description}</span>
              </span>
              <span className="landing-link-arrow">
                <Icon icon={ArrowUpRight} size="sm" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
