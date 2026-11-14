import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, Circle, Sparkles } from 'lucide-react';

import { Box, Icon, Stack, Text } from '@orkest/ui';

import { tones } from './data';
import { Page, PageHeader, Section, TypeRow } from './parts';
import styles from './foundations.module.css';

const iconSizes = [
  { size: 'sm', px: 16 },
  { size: 'md', px: 20 },
  { size: 'lg', px: 24 },
] as const;

function PrimitivesPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Foundations · Primitives"
        title="Small pieces, composed with care."
        description="Box, Stack, Text, and Icon provide just enough structure to build consistent interfaces without a layout DSL."
        meta={['Polymorphic', 'Token-driven', 'Accessible']}
      />

      <Section
        first
        title="Stack"
        description="One-dimensional flex layout with token-based gaps. Direction, alignment, and wrapping cover most composition needs."
      >
        <div className={styles.demoGrid}>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Stack · column</p>
            <Stack gap={3}>
              {['One', 'Two', 'Three'].map((item) => (
                <div className={styles.layoutBox} key={item}>
                  {item}
                </div>
              ))}
            </Stack>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelEyebrow}>Stack · row</p>
            <Stack direction="row" gap={3} wrap>
              {['One', 'Two', 'Three'].map((item) => (
                <div className={styles.layoutBox} key={item}>
                  {item}
                </div>
              ))}
            </Stack>
          </div>
        </div>
      </Section>

      <Section
        title="Text"
        description="Size, weight, and tone are explicit props. Text renders a span by default and accepts any element through as."
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
        title="Icon"
        description="Icons inherit the current text color. Decorative icons are hidden from assistive technology unless a label is provided."
      >
        <div className={styles.iconGrid}>
          {iconSizes.map((item) => (
            <div className={styles.iconSample} key={item.size}>
              <span className={styles.iconBox}>
                <Icon icon={Circle} size={item.size} label={`${item.size} icon`} />
              </span>
              <span className={styles.iconLabel}>
                {item.size} · {item.px}px
              </span>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          Pass label when an icon conveys meaning on its own; omit it when nearby text already
          describes the action.
        </p>
      </Section>

      <Section
        title="Composition"
        description="A surface assembled only from primitives, semantic tokens, and documentation-level layout styles."
      >
        <Box as="article" className={styles.panel}>
          <Stack gap={5}>
            <div className={styles.exampleHeader}>
              <div className={styles.exampleIdentity}>
                <span className={`${styles.iconBox} ${styles.iconBoxLarge}`}>
                  <Icon icon={Sparkles} size="md" />
                </span>
                <div>
                  <Text as="h3" size="md" weight="semibold">
                    Composable surface
                  </Text>
                  <Text as="p" size="sm" tone="muted">
                    Box, Stack, Text, and Icon working together.
                  </Text>
                </div>
              </div>
              <span className={styles.status}>
                <span className={styles.statusDot} />
                Ready
              </span>
            </div>
            <Text as="p" size="sm" tone="muted">
              The example introduces no new component API. Every visual decision maps back to a
              token, so the composition follows the active theme automatically.
            </Text>
            <div className={styles.featureRow}>
              <span className={styles.feature}>
                <Icon icon={Check} size="sm" />
                <Text size="xs" tone="muted">
                  Semantic tokens
                </Text>
              </span>
              <span className={styles.feature}>
                <Icon icon={Check} size="sm" />
                <Text size="xs" tone="muted">
                  Native semantics
                </Text>
              </span>
            </div>
          </Stack>
        </Box>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Foundations/Primitives',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PrimitivesPage />,
};
