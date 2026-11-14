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
        meta={['5 text sizes', '3 weights', '7 tones']}
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
        title="Font stacks"
        description="The host application decides which fonts to load. Orkest UI falls back to the platform UI stack."
      >
        <div className={styles.demoGrid}>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Sans</p>
            <Text size="lg" weight="medium">
              The quick brown fox jumps over the lazy dog.
            </Text>
            <p className={styles.note}>
              <code className={styles.tokenName}>--ok-font-sans</code>
            </p>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Mono</p>
            <p className={styles.mono}>const ui = &quot;orkest&quot;;</p>
            <p className={styles.note}>
              <code className={styles.tokenName}>--ok-font-mono</code>
            </p>
          </div>
        </div>
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
