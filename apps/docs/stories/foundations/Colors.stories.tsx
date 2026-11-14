import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '@orkest/ui';

import {
  accentScale,
  dangerScale,
  neutralScale,
  semanticGroups,
  successScale,
  warningScale,
} from './data';
import { ColorSwatch, Page, PageHeader, Section } from './parts';
import styles from './foundations.module.css';

const palettes = [
  { title: 'Neutral', prefix: 'neutral', steps: neutralScale },
  { title: 'Accent', prefix: 'accent', steps: accentScale },
  { title: 'Success', prefix: 'green', steps: successScale },
  { title: 'Warning', prefix: 'amber', steps: warningScale },
  { title: 'Danger', prefix: 'red', steps: dangerScale },
] as const;

function ColorsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Foundations · Color"
        title="Neutral first, color with intent."
        description="Neutral surfaces carry the interface. The muted accent and desaturated status colors appear only where meaning or interaction requires them."
        meta={['Primitive palettes', 'Semantic mapping', 'Light and dark']}
      />

      <Section
        first
        title="Primitive palettes"
        description="Raw scales are implementation details. Components should consume the semantic tokens below instead."
      >
        <Stack gap={8}>
          {palettes.map(({ title, prefix, steps }) => (
            <div key={prefix}>
              <h3 className={styles.subTitle}>{title}</h3>
              <div className={styles.grid}>
                {steps.map((step) => (
                  <ColorSwatch
                    key={step}
                    token={`--ok-color-${prefix}-${step}`}
                    label={String(step)}
                  />
                ))}
              </div>
            </div>
          ))}
        </Stack>
      </Section>

      <Section
        title="Semantic tokens"
        description="Theme switching only remaps these tokens. Component styles never change between light and dark."
      >
        <Stack gap={8}>
          {semanticGroups.map((group) => (
            <div key={group.title}>
              <h3 className={styles.subTitle}>{group.title}</h3>
              <div className={styles.grid}>
                {group.tokens.map((token) => (
                  <ColorSwatch key={token} token={token} />
                ))}
              </div>
            </div>
          ))}
        </Stack>
      </Section>
    </Page>
  );
}

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ColorsPage />,
};
