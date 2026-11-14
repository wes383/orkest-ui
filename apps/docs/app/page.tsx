import { Icon, Stack, Text } from '@orkest/ui';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
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
          <p className="landing-eyebrow">
            <span className="landing-eyebrow-dot" aria-hidden="true" />
            Orkest UI · Preview
          </p>
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
          <div className="landing-meta">
            <span>React 19</span>
            <span>TypeScript</span>
            <span>4 primitives</span>
          </div>
        </div>

        <div className="landing-stage">
          <div className="stage-window">
            <div className="stage-toolbar">
              <span className="stage-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="stage-file">orkest-ui / preview</span>
              <span className="stage-state">Tokens</span>
            </div>

            <div className="stage-body">
              <div className="stage-header">
                <div>
                  <p className="stage-eyebrow">Design system</p>
                  <Text as="p" size="lg" weight="semibold">
                    Quiet by default.
                  </Text>
                </div>
                <span className="stage-badge">
                  <span className="stage-badge-dot" aria-hidden="true" />
                  Stable
                </span>
              </div>

              <div className="stage-grid">
                <div className="stage-panel">
                  <span className="stage-label">Display</span>
                  <span className="stage-display" aria-hidden="true">
                    Aa
                  </span>
                  <Text size="xs" tone="muted">
                    Plus Jakarta Sans
                  </Text>
                </div>

                <div className="stage-panel">
                  <span className="stage-label">Palette</span>
                  <div className="stage-swatches" aria-hidden="true">
                    {[
                      '--ui-background',
                      '--ui-surface-sunken',
                      '--ui-border-strong',
                      '--ui-accent',
                      '--ui-primary',
                    ].map((token) => (
                      <span key={token} style={{ backgroundColor: `var(${token})` }} />
                    ))}
                  </div>
                  <Text size="xs" tone="muted">
                    Semantic tokens
                  </Text>
                </div>

                <div className="stage-panel">
                  <span className="stage-label">Rhythm</span>
                  <div className="stage-spacing" aria-hidden="true">
                    {[2, 4, 6, 8].map((step) => (
                      <span key={step} style={{ width: `var(--ok-space-${step})` }} />
                    ))}
                  </div>
                  <Text size="xs" tone="muted">
                    4px base
                  </Text>
                </div>

                <div className="stage-panel">
                  <span className="stage-label">Status</span>
                  <Stack direction="row" align="center" gap={2}>
                    <Icon icon={Check} size="sm" />
                    <Text size="sm">All systems calm</Text>
                  </Stack>
                  <Text size="xs" tone="muted">
                    Text and icon, never color alone
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <p className="stage-caption">
            Rendered with the same primitives and tokens as the library.
          </p>
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
