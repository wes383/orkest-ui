import { Icon } from '@orkest/ui';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const principles = [
  {
    number: '01',
    title: 'Neutral by default',
    description:
      'Ink, graphite, and a muted slate accent keep attention on content instead of chrome.',
  },
  {
    number: '02',
    title: 'Token-driven',
    description:
      'Semantic variables map every surface, border, and text tone across light and dark themes.',
  },
  {
    number: '03',
    title: 'Accessible primitives',
    description:
      'Semantic HTML, visible focus, and honest icon labeling are part of the component contract.',
  },
];

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
            Interfaces that stay <span className="landing-title-accent">quiet,</span> by design.
          </h1>
          <p className="landing-lede">
            A small, opinionated React component library built around restraint: neutral surfaces,
            precise spacing, and interactions that stay out of the way.
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

      <section className="landing-principles" aria-labelledby="landing-principles">
        <h2 className="sr-only" id="landing-principles">
          Principles
        </h2>
        {principles.map((principle) => (
          <article className="landing-principle" key={principle.number}>
            <span className="landing-principle-number">{principle.number}</span>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </article>
        ))}
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
