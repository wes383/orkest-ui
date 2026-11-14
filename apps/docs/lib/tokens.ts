import { readFileSync } from 'node:fs';
import path from 'node:path';

import { cache } from 'react';

export interface TokenRecord {
  name: string;
  value: string;
  light?: string;
  dark?: string;
}

export interface TokenGroup {
  title: string;
  tokens: TokenRecord[];
}

export type ColorFamily = 'neutral' | 'accent' | 'green' | 'amber' | 'red';

export interface ColorTokenGroup extends TokenGroup {
  family: ColorFamily;
}

const stylesDirectory = path.resolve(process.cwd(), '../../packages/ui/src/styles');

const semanticTokenGroups = [
  {
    title: 'Surfaces',
    tokens: [
      '--ui-background',
      '--ui-surface',
      '--ui-surface-raised',
      '--ui-surface-sunken',
      '--ui-overlay',
    ],
  },
  {
    title: 'Text',
    tokens: ['--ui-foreground', '--ui-muted-foreground', '--ui-subtle-foreground'],
  },
  {
    title: 'Actions',
    tokens: [
      '--ui-primary',
      '--ui-primary-hover',
      '--ui-primary-active',
      '--ui-primary-foreground',
      '--ui-secondary',
      '--ui-secondary-hover',
      '--ui-secondary-active',
      '--ui-secondary-foreground',
    ],
  },
  {
    title: 'Destructive action',
    tokens: [
      '--ui-danger-solid',
      '--ui-danger-solid-hover',
      '--ui-danger-solid-active',
      '--ui-danger-solid-foreground',
    ],
  },
  {
    title: 'Disabled states',
    tokens: ['--ui-disabled-surface', '--ui-disabled-foreground'],
  },
  {
    title: 'Accent',
    tokens: [
      '--ui-accent',
      '--ui-accent-hover',
      '--ui-accent-surface',
      '--ui-accent-surface-foreground',
    ],
  },
  {
    title: 'Borders and focus',
    tokens: ['--ui-border-subtle', '--ui-border', '--ui-border-strong', '--ui-focus-ring'],
  },
  {
    title: 'Status',
    tokens: [
      '--ui-success',
      '--ui-success-surface',
      '--ui-success-surface-foreground',
      '--ui-warning',
      '--ui-warning-surface',
      '--ui-warning-surface-foreground',
      '--ui-danger',
      '--ui-danger-surface',
      '--ui-danger-surface-foreground',
    ],
  },
  {
    title: 'Selection',
    tokens: ['--ui-selection-background'],
  },
] as const;

const colorFamilies: Array<{ family: ColorFamily; title: string }> = [
  { family: 'neutral', title: 'Neutral' },
  { family: 'accent', title: 'Accent' },
  { family: 'green', title: 'Success' },
  { family: 'amber', title: 'Warning' },
  { family: 'red', title: 'Danger' },
];

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function extractBlock(css: string, pattern: RegExp, label: string): string {
  const match = pattern.exec(css);

  if (!match?.[1]) {
    throw new Error(`Unable to locate the ${label} token block in the design system source.`);
  }

  return match[1];
}

function readDeclarations(block: string): Map<string, string> {
  const declarations = new Map<string, string>();

  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const name = match[1];
    const value = match[2]?.trim().replace(/\s+/g, ' ');

    if (name && value) {
      declarations.set(name, value);
    }
  }

  return declarations;
}

function resolveValue(value: string, primitives: Map<string, string>): string {
  return value.replace(/var\((--ok-[\w-]+)\)/g, (_, name: string) => {
    const resolved = primitives.get(name);

    if (!resolved) {
      throw new Error(`Semantic token references an unknown primitive: ${name}`);
    }

    return resolved;
  });
}

const getCssVariables = cache(() => {
  const tokensCss = stripComments(readFileSync(path.join(stylesDirectory, 'tokens.css'), 'utf8'));
  const themesCss = stripComments(readFileSync(path.join(stylesDirectory, 'themes.css'), 'utf8'));

  const primitives = readDeclarations(
    extractBlock(tokensCss, /:root\s*\{([\s\S]*?)\n\}/, 'primitive'),
  );
  const light = readDeclarations(
    extractBlock(
      themesCss,
      /:root,\s*\[data-orkest-theme="light"\]\s*\{([\s\S]*?)\n\}/,
      'light theme',
    ),
  );
  const dark = readDeclarations(
    extractBlock(themesCss, /\[data-orkest-theme="dark"\]\s*\{([\s\S]*?)\n\}/, 'dark theme'),
  );

  return { primitives, light, dark };
});

export function getPrimitiveTokensByPrefix(prefix: string): TokenRecord[] {
  return [...getCssVariables().primitives.entries()]
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}

export function getPrimitiveToken(name: string): TokenRecord {
  const value = getCssVariables().primitives.get(name);

  if (!value) {
    throw new Error(`Unknown primitive token: ${name}`);
  }

  return { name, value };
}

export function getPrimitiveColorGroups(): ColorTokenGroup[] {
  return colorFamilies.map(({ family, title }) => ({
    family,
    title,
    tokens: getPrimitiveTokensByPrefix(`--ok-color-${family}-`),
  }));
}

export function getSemanticTokenGroups(): TokenGroup[] {
  const { primitives, light, dark } = getCssVariables();

  return semanticTokenGroups.map((group) => ({
    title: group.title,
    tokens: group.tokens.map((name) => {
      const lightValue = light.get(name);
      const darkValue = dark.get(name);

      if (!lightValue || !darkValue) {
        throw new Error(`Semantic token "${name}" must be defined in both light and dark themes.`);
      }

      return {
        name,
        value: resolveValue(lightValue, primitives),
        light: resolveValue(lightValue, primitives),
        dark: resolveValue(darkValue, primitives),
      };
    }),
  }));
}
