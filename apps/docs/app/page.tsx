import { Icon, Stack, Text } from '@orkest/ui';
import { ArrowRight, Layers, Palette, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Neutral by default',
    description:
      'Ink, graphite, and a muted slate accent keep attention on content instead of chrome.',
    icon: Palette,
  },
  {
    title: 'Token-driven',
    description:
      'Semantic variables map every surface, border, and text tone across light and dark themes.',
    icon: Layers,
  },
  {
    title: 'Accessible primitives',
    description:
      'Semantic HTML, visible focus, and honest icon labeling are part of the component contract.',
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <p className="landing-eyebrow">React · TypeScript · Design tokens</p>
        <h1 className="landing-title">A quiet foundation for product interfaces.</h1>
        <p className="landing-lede">
          Orkest UI is a small, opinionated component library built around restraint: neutral
          surfaces, precise spacing, and interactions that stay out of the way.
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
      </section>

      <section className="landing-section" aria-labelledby="landing-principles">
        <h2 className="landing-section-title" id="landing-principles">
          Built for calm, dense interfaces
        </h2>
        <div className="landing-grid">
          {features.map((feature) => (
            <article className="landing-card" key={feature.title}>
              <span className="landing-card-icon">
                <Icon icon={feature.icon} size="md" />
              </span>
              <Stack gap={2}>
                <Text as="h3" size="md" weight="semibold">
                  {feature.title}
                </Text>
                <Text as="p" size="sm" tone="muted">
                  {feature.description}
                </Text>
              </Stack>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" aria-labelledby="landing-explore">
        <h2 className="landing-section-title" id="landing-explore">
          Start where you need to
        </h2>
        <div className="landing-links">
          <Link className="landing-link" href="/docs/foundations/colors/">
            <span className="landing-link-title">Foundations</span>
            <span className="landing-link-description">Colors, typography, spacing, and motion.</span>
          </Link>
          <Link className="landing-link" href="/docs/components/box/">
            <span className="landing-link-title">Components</span>
            <span className="landing-link-description">Live examples and API references.</span>
          </Link>
          <Link className="landing-link" href="/docs/guides/theming/">
            <span className="landing-link-title">Guides</span>
            <span className="landing-link-description">Theming, TypeScript, and Next.js setup.</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
