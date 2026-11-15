export const docsSections = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    description: 'Purpose, installation, and your first Orkest UI interface.',
  },
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Design tokens and the visual rules shared by every component.',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Live examples, APIs, and accessibility guidance for shipped components.',
  },
  {
    id: 'guides',
    label: 'Guides',
    description: 'Theming, TypeScript, accessibility, and framework integration.',
  },
] as const;

export type DocsSectionId = (typeof docsSections)[number]['id'];
export type DocsSection = (typeof docsSections)[number];

export function getSection(id: DocsSectionId): DocsSection {
  const section = docsSections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`Unknown documentation section: ${id}`);
  }
  return section;
}
