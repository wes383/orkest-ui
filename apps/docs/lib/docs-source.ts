import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { cache } from 'react';

import { docsSections, type DocsSectionId } from './docs-navigation';
import type { DocHeading, DocPage, NavGroup, NavItem, SearchIndexItem } from './docs-types';

const contentDirectory = path.join(process.cwd(), 'content');

export function getDocHref(slug: string): string {
  return `/docs/${slug}/`;
}

function listMdxFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listMdxFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.mdx') ? [fullPath] : [];
  });
}

function requireString(value: unknown, field: string, file: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing or invalid "${field}" frontmatter in ${file}`);
  }

  return value.trim();
}

function requireSection(value: unknown, file: string): DocsSectionId {
  const section = docsSections.find((item) => item.id === value);

  if (!section) {
    throw new Error(`Unknown documentation section "${String(value)}" in ${file}`);
  }

  return section.id;
}

function requireOrder(value: unknown, file: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`Missing or invalid "order" frontmatter in ${file}`);
  }

  return value;
}

function compareDocs(a: DocPage, b: DocPage): number {
  if (a.section === 'components' && b.section === 'components') {
    return a.title.localeCompare(b.title);
  }

  return (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title);
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~]/g, '')
    .trim();
}

function extractHeadings(source: string): DocHeading[] {
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);

    if (!match) {
      continue;
    }

    const level = match[1];
    const rawText = match[2];

    if (!level || !rawText) {
      continue;
    }

    const text = stripInlineMarkdown(rawText);

    headings.push({
      id: slugger.slug(text),
      text,
      level: level.length as 2 | 3,
    });
  }

  return headings;
}

function toPlainText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import\s.+$/gm, ' ')
    .replace(/^export\s.+$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDoc(filePath: string): DocPage {
  const relativePath = path.relative(contentDirectory, filePath).replace(/\\/g, '/');
  const slug = relativePath.replace(/\.mdx$/, '');
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const section = requireSection(data.section, relativePath);
  const sectionMeta = docsSections.find((item) => item.id === section);

  if (!sectionMeta) {
    throw new Error(`Unknown documentation section "${section}" in ${relativePath}`);
  }

  return {
    slug,
    slugSegments: slug.split('/'),
    title: requireString(data.title, 'title', relativePath),
    description: requireString(data.description, 'description', relativePath),
    section,
    sectionLabel: sectionMeta.label,
    // Component pages are alphabetical; every other section uses an explicit order.
    order: section === 'components' ? undefined : requireOrder(data.order, relativePath),
    headings: extractHeadings(content),
    content,
    plainText: toPlainText(content),
  };
}

export const getDocs = cache((): DocPage[] => {
  return listMdxFiles(contentDirectory).map(parseDoc).sort(compareDocs);
});

export const getDocBySlug = cache((slug: string): DocPage | undefined => {
  return getDocs().find((doc) => doc.slug === slug);
});

export const getNavigation = cache((): NavGroup[] => {
  const docs = getDocs();

  return docsSections
    .map((section) => ({
      id: section.id,
      label: section.label,
      description: section.description,
      items: docs
        .filter((doc) => doc.section === section.id)
        .sort(compareDocs)
        .map<NavItem>((doc) => ({
          title: doc.title,
          href: getDocHref(doc.slug),
          slug: doc.slug,
        })),
    }))
    .filter((group) => group.items.length > 0);
});

export function getAdjacentDocs(slug: string): {
  previous: NavItem | null;
  next: NavItem | null;
} {
  const items = getNavigation().flatMap((group) => group.items);
  const index = items.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? (items[index - 1] ?? null) : null,
    next: index < items.length - 1 ? (items[index + 1] ?? null) : null,
  };
}

export const getSearchIndex = cache((): SearchIndexItem[] => {
  return getDocs().map((doc) => ({
    title: doc.title,
    description: doc.description,
    href: getDocHref(doc.slug),
    sectionLabel: doc.sectionLabel,
    headings: doc.headings,
    content: doc.plainText.slice(0, 2400),
  }));
});
