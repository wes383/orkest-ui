import type { Meta, StoryObj } from '@storybook/react-vite';

import { controlSizes, durations, radiusTokens, shadowTokens } from './data';
import { Page, PageHeader, Section, SpacingRows } from './parts';
import styles from './foundations.module.css';

function LayoutPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Foundations · Layout"
        title="Order through rhythm."
        description="Spacing, radius, borders, and elevation stay on one system. Structure comes from alignment and whitespace before decoration."
        meta={['4px base', '6 radii', '4 elevations']}
      />

      <Section
        first
        title="Spacing"
        description="Use spacing tokens for gaps and padding. Avoid arbitrary pixel values between components."
      >
        <SpacingRows />
      </Section>

      <Section
        title="Radius"
        description="Small radii keep controls precise. Larger radii are reserved for surfaces and overlays."
      >
        <div className={styles.tileGrid}>
          {radiusTokens.map((item) => (
            <div
              key={item.name}
              className={styles.tile}
              style={{ borderRadius: `var(${item.token})` }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Elevation"
        description="Shadows are subtle and never carry meaning on their own. Borders remain the primary separator."
      >
        <div className={styles.tileGrid}>
          {shadowTokens.map((item) => (
            <div
              key={item.name}
              className={`${styles.tile} ${styles.shadowTile}`}
              style={{ boxShadow: `var(${item.token})` }}
            >
              shadow {item.name}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Control heights"
        description="Shared control heights keep buttons, inputs, and selects aligned when they sit side by side."
      >
        <div className={styles.controlRow}>
          {controlSizes.map((item) => (
            <div
              key={item.name}
              className={styles.controlTile}
              style={{ height: `var(${item.token})` }}
            >
              {item.name} · {item.px}px
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Borders"
        description="Border strength communicates structure, not status. Status always pairs color with text or icon."
      >
        <div className={styles.borderList}>
          <div className={styles.borderRow}>
            <span className={styles.borderLabel}>subtle</span>
            <div className={`${styles.borderSample} ${styles.borderSampleSubtle}`} />
          </div>
          <div className={styles.borderRow}>
            <span className={styles.borderLabel}>default</span>
            <div className={styles.borderSample} />
          </div>
          <div className={styles.borderRow}>
            <span className={styles.borderLabel}>strong</span>
            <div className={`${styles.borderSample} ${styles.borderSampleStrong}`} />
          </div>
        </div>
      </Section>

      <Section
        title="Motion"
        description="Motion supports state changes and never delays the user."
      >
        <div className={styles.motionList}>
          {durations.map((item) => (
            <div key={item.token} className={styles.motionRow}>
              <code className={styles.motionToken}>{item.token.replace('--ok-', '')}</code>
              <span className={styles.motionValue}>{item.value}</span>
              <span className={styles.motionUsage}>{item.usage}</span>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          All durations collapse to zero when the user prefers reduced motion.
        </p>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Foundations/Layout',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <LayoutPage />,
};
