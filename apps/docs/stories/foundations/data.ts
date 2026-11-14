export const neutralScale = [
  0, 50, 100, 150, 200, 300, 400, 450, 500, 600, 700, 800, 850, 900, 925, 950, 975,
] as const;

export const accentScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export const successScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export const warningScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export const dangerScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export const semanticGroups = [
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
      '--ui-secondary',
      '--ui-secondary-hover',
      '--ui-secondary-active',
    ],
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
    tokens: [
      '--ui-border-subtle',
      '--ui-border',
      '--ui-border-strong',
      '--ui-focus-ring',
    ],
  },
  {
    title: 'Status',
    tokens: [
      '--ui-success',
      '--ui-success-surface',
      '--ui-warning',
      '--ui-warning-surface',
      '--ui-danger',
      '--ui-danger-surface',
    ],
  },
] as const;

export const spacingTokens = [
  { token: '--ok-space-1', px: 4 },
  { token: '--ok-space-2', px: 8 },
  { token: '--ok-space-3', px: 12 },
  { token: '--ok-space-4', px: 16 },
  { token: '--ok-space-5', px: 20 },
  { token: '--ok-space-6', px: 24 },
  { token: '--ok-space-8', px: 32 },
  { token: '--ok-space-10', px: 40 },
  { token: '--ok-space-12', px: 48 },
  { token: '--ok-space-16', px: 64 },
  { token: '--ok-space-20', px: 80 },
] as const;

export const radiusTokens = [
  { name: 'sm', token: '--ok-radius-sm' },
  { name: 'md', token: '--ok-radius-md' },
  { name: 'lg', token: '--ok-radius-lg' },
  { name: 'xl', token: '--ok-radius-xl' },
  { name: '2xl', token: '--ok-radius-2xl' },
  { name: 'full', token: '--ok-radius-full' },
] as const;

export const shadowTokens = [
  { name: 'xs', token: '--ok-shadow-xs' },
  { name: 'sm', token: '--ok-shadow-sm' },
  { name: 'md', token: '--ok-shadow-md' },
  { name: 'lg', token: '--ok-shadow-lg' },
] as const;

export const controlSizes = [
  { name: 'sm', token: '--ok-control-height-sm', px: 28 },
  { name: 'md', token: '--ok-control-height-md', px: 36 },
  { name: 'lg', token: '--ok-control-height-lg', px: 44 },
] as const;

export const typeSizes = [
  { size: 'xs', token: '--ok-font-size-xs', px: 13, sample: 'Compact captions and metadata' },
  { size: 'sm', token: '--ok-font-size-sm', px: 14, sample: 'Supporting body copy and labels' },
  { size: 'md', token: '--ok-font-size-md', px: 16, sample: 'Default body text for most interfaces' },
  { size: 'lg', token: '--ok-font-size-lg', px: 18, sample: 'Lead paragraphs and section intros' },
  { size: 'xl', token: '--ok-font-size-xl', px: 20, sample: 'Quiet headings with clear hierarchy' },
] as const;

export const weights = [
  { weight: 'regular', token: '--ok-font-weight-regular', value: 400 },
  { weight: 'medium', token: '--ok-font-weight-medium', value: 500 },
  { weight: 'semibold', token: '--ok-font-weight-semibold', value: 600 },
] as const;

export const tones = [
  { tone: 'default', token: '--ui-foreground', sample: 'Primary reading text' },
  { tone: 'muted', token: '--ui-muted-foreground', sample: 'Secondary supporting text' },
  { tone: 'subtle', token: '--ui-subtle-foreground', sample: 'Tertiary metadata' },
  { tone: 'accent', token: '--ui-accent', sample: 'Links and quiet emphasis' },
  { tone: 'success', token: '--ui-success', sample: 'Completed or healthy state' },
  { tone: 'danger', token: '--ui-danger', sample: 'Errors and destructive intent' },
] as const;

export const durations = [
  { token: '--ok-duration-instant', value: '60ms', usage: 'Pressed feedback' },
  { token: '--ok-duration-fast', value: '120ms', usage: 'Hover and focus' },
  { token: '--ok-duration-normal', value: '180ms', usage: 'Small transitions' },
  { token: '--ok-duration-slow', value: '280ms', usage: 'Overlay entry' },
] as const;
