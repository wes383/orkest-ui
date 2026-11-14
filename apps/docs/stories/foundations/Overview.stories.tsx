import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, Layers, SlidersHorizontal } from 'lucide-react';

import { Box, Icon, Stack, Text } from '@orkest/ui';

import { ColorSwatch, Page, PageHeader, Section, SpacingRows, TypeRow } from './parts';
import styles from './foundations.module.css';

const surfaceTokens = [
  '--ui-background',
  '--ui-surface-sunken',
  '--ui-primary',
  '--ui-accent',
  '--ui-border',
  '--ui-success',
];

const overviewSpacing = [
  { token: '--ok-space-1', px: 4 },
  { token: '--ok-space-2', px: 8 },
  { token: '--ok-space-3', px: 12 },
  { token: '--ok-space-4', px: 16 },
  { token: '--ok-space-6', px: 24 },
  { token: '--ok-space-8', px: 32 },
];

function OverviewPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Orkest UI · Foundations"
        title="Quiet, precise, built to last."
        description="A neutral-first design language for Orkest UI. Content leads while color, depth, and motion stay restrained."
        meta={['Modern minimalism', 'Light and dark', 'Token-driven']}
      />

      <Section
        first
        title="Semantic surfaces"
        description="Components consume semantic tokens rather than raw colors, so every surface responds to the active theme."
      >
        <div className={styles.grid}>
          {surfaceTokens.map((token) => (
            <ColorSwatch key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="A compact scale with clear hierarchy. Body copy stays comfortable while headings tighten slightly."
      >
        <div className={styles.typeList}>
          <TypeRow
            meta="xl · 20px"
            token="--ok-font-size-xl"
            size="xl"
            weight="semibold"
            sample="Design that stays out of the way."
          />
          <TypeRow
            meta="md · 16px"
            token="--ok-font-size-md"
            size="md"
            sample="Clear content, restrained chrome, and a consistent visual rhythm."
          />
          <TypeRow
            meta="sm · 14px · muted"
            token="--ui-muted-foreground"
            size="sm"
            tone="muted"
            sample="Supporting details use quieter tones to keep the primary message in focus."
          />
        </div>
      </Section>

      <Section
        title="Spacing rhythm"
        description="A four-pixel base keeps dense interfaces aligned without feeling cramped."
      >
        <SpacingRows tokens={overviewSpacing} />
      </Section>

      <Section
        title="Surfaces and depth"
        description="Borders define structure first; shadows are reserved for subtle separation."
      >
        <div className={styles.tileGrid}>
          <div className={styles.tile} style={{ borderRadius: 'var(--ok-radius-lg)' }}>
            radius lg
          </div>
          <div className={styles.tile} style={{ borderRadius: 'var(--ok-radius-xl)' }}>
            radius xl
          </div>
          <div
            className={`${styles.tile} ${styles.shadowTile}`}
            style={{ boxShadow: 'var(--ok-shadow-sm)' }}
          >
            shadow sm
          </div>
          <div
            className={`${styles.tile} ${styles.shadowTile}`}
            style={{ boxShadow: 'var(--ok-shadow-md)' }}
          >
            shadow md
          </div>
        </div>
      </Section>

      <Section
        title="Primitives in use"
        description="Box, Stack, Text, and Icon compose the layout. No component-specific colors are introduced."
      >
        <div className={styles.demoGrid}>
          <Box as="article" className={styles.panel}>
            <Stack gap={4}>
              <div className={styles.exampleHeader}>
                <div className={styles.exampleIdentity}>
                  <span className={styles.iconBox}>
                    <Icon icon={Layers} size="sm" />
                  </span>
                  <div>
                    <Text as="h3" size="sm" weight="semibold">
                      Token-driven layout
                    </Text>
                    <Text as="p" size="xs" tone="muted">
                      Spacing stays on a fixed rhythm.
                    </Text>
                  </div>
                </div>
                <span className={styles.status}>
                  <span className={styles.statusDot} />
                  Stable
                </span>
              </div>
              <Text as="p" size="sm" tone="muted">
                Primitives compose without custom CSS. Every value resolves through a semantic
                token.
              </Text>
              <div className={styles.featureRow}>
                <span className={styles.feature}>
                  <Icon icon={Check} size="sm" />
                  <Text size="xs" tone="muted">
                    Consistent spacing
                  </Text>
                </span>
                <span className={styles.feature}>
                  <Icon icon={Check} size="sm" />
                  <Text size="xs" tone="muted">
                    Theme aware
                  </Text>
                </span>
              </div>
            </Stack>
          </Box>

          <Box as="article" className={styles.panel}>
            <Stack gap={4}>
              <Stack direction="row" align="center" gap={3}>
                <span className={styles.iconBox}>
                  <Icon icon={SlidersHorizontal} size="sm" />
                </span>
                <div>
                  <Text as="h3" size="sm" weight="semibold">
                    Theme-aware by default
                  </Text>
                  <Text as="p" size="xs" tone="muted">
                    Switch the toolbar to preview dark mode.
                  </Text>
                </div>
              </Stack>
              <div className={styles.tokenRow}>
                {['--ui-background', '--ui-surface-sunken', '--ui-border', '--ui-accent'].map(
                  (token) => (
                    <span className={styles.tokenChip} key={token}>
                      <span
                        className={styles.tokenChipSwatch}
                        style={{ background: `var(${token})` }}
                      />
                      {token.replace('--ui-', '')}
                    </span>
                  ),
                )}
              </div>
              <Text as="p" size="sm" tone="muted">
                Semantic tokens keep surfaces, borders, and text in balance across both themes.
              </Text>
            </Stack>
          </Box>
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Foundations/Overview',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <OverviewPage />,
};
