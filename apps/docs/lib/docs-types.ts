import type { DocsSectionId } from './docs-navigation';

export interface DocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocPage {
  slug: string;
  slugSegments: string[];
  title: string;
  description: string;
  section: DocsSectionId;
  sectionLabel: string;
  order?: number;
  headings: DocHeading[];
  content: string;
  plainText: string;
}

export interface NavItem {
  title: string;
  href: string;
  slug: string;
}

export interface NavGroup {
  id: DocsSectionId;
  label: string;
  description: string;
  items: NavItem[];
}

export interface SearchIndexItem {
  title: string;
  description: string;
  href: string;
  sectionLabel: string;
  headings: DocHeading[];
  content: string;
}

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  sectionLabel: string;
  excerpt: string;
}
