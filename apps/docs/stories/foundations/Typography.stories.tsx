import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '@orkest/ui';

import { tones, typeSizes, weights } from './data';
import { Page, PageHeader, Section, TypeRow } from './parts';
import styles from './foundations.module.css';

function TypographyPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Foundations · Typography"
        title="Hierarchy without noise."
        description="A compact type scale keeps dense product interfaces readable. Weight and tone carry emphasis before size does."
        meta={['5 text sizes', '3 weights', '4 font tokens']}
      />

      <Section
        first
        title="Type scale"
        description="Text defaults to md at 16px with a comfortable line height for body copy."
      >
        <div className={styles.typeList}>
          {typeSizes.map((item) => (
            <TypeRow
              key={item.size}
              meta={`${item.size} · ${item.px}px`}
              token={item.token}
              size={item.size}
              sample={item.sample}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Weight"
        description="Three weights are enough. Regular for reading, medium for labels, semibold for emphasis and headings."
      >
        <div className={styles.typeList}>
          {weights.map((item) => (
            <TypeRow
              key={item.weight}
              meta={`${item.weight} · ${item.value}`}
              token={item.token}
              size="md"
              weight={item.weight}
              sample="Quiet interfaces depend on carefully chosen emphasis."
            />
          ))}
        </div>
      </Section>

      <Section
        title="Tone"
        description="Tone is semantic. Components never select raw text colors directly."
      >
        <div className={styles.typeList}>
          {tones.map((item) => (
            <TypeRow
              key={item.tone}
              meta={item.tone}
              token={item.token}
              size="md"
              tone={item.tone}
              sample={item.sample}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Font families"
        description="Inter carries UI text, Plus Jakarta Sans is an optional display face for large headings, and JetBrains Mono is reserved for code. CJK glyphs fall back to Noto Sans."
      >
        <div className={styles.demoGrid}>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Sans · Inter</p>
            <Text size="lg" weight="medium">
              The quick brown fox jumps over the lazy dog.
            </Text>
            <p className={styles.note}>
              <Text size="md" tone="muted">
                统一字体，清晰克制。
              </Text>
            </p>
            <p className={styles.note}>
              <code className={styles.tokenName}>--ok-font-sans</code>
            </p>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Display · Plus Jakarta Sans</p>
            <Text
              font="display"
              size="xl"
              weight="semibold"
              style={{
                fontSize: 'var(--ok-font-size-4xl)',
                lineHeight: 'var(--ok-line-height-tight)',
              }}
            >
              Build with clarity.
            </Text>
            <p className={styles.note}>
              <code className={styles.tokenName}>--ok-font-display</code>
            </p>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Mono · JetBrains Mono</p>
            <Text font="mono" size="md">
              const ui = &quot;orkest&quot;;
            </Text>
            <p className={styles.note}>
              <code className={styles.tokenName}>--ok-font-mono</code>
            </p>
          </div>
        </div>
        <p className={styles.note}>
          The host application loads the font files. Orkest UI only defines the family stacks and
          the Noto Sans CJK fallback.
        </p>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TypographyPage />,
};
