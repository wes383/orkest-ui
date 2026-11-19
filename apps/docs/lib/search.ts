import type { SearchIndexItem, SearchResult } from './docs-types';

const MAX_RESULTS = 8;

export function searchDocs(index: SearchIndexItem[], rawQuery: string): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return [];
  }

  const terms = query.split(/\s+/).filter(Boolean);
  const matches: Array<{ score: number; result: SearchResult }> = [];

  for (const item of index) {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const headings = item.headings.map((heading) => heading.text.toLowerCase());
    const content = item.content.toLowerCase();
    const haystack = [title, description, ...headings, content].join(' ');

    if (!terms.every((term) => haystack.includes(term))) {
      continue;
    }

    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 100;
      if (description.includes(term)) score += 40;
      if (headings.some((heading) => heading.includes(term))) score += 20;
      if (content.includes(term)) score += 5;
    }

    const headingMatch = item.headings.find((heading) =>
      terms.every((term) => heading.text.toLowerCase().includes(term)),
    );
    const hasTitleMatch = terms.every((term) => title.includes(term));
    const anchor = headingMatch && !hasTitleMatch ? `#${headingMatch.id}` : '';

    matches.push({
      score,
      result: {
        title: item.title,
        description:
          headingMatch && !hasTitleMatch ? `Section: ${headingMatch.text}` : item.description,
        href: `${item.href}${anchor}`,
        sectionLabel: item.sectionLabel,
        excerpt: makeExcerpt(item.content, terms[0] ?? query, 150),
      },
    });
  }

  return matches
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .slice(0, MAX_RESULTS)
    .map((match) => match.result);
}

function makeExcerpt(content: string, term: string, maxLength: number): string {
  const matchIndex = content.toLowerCase().indexOf(term);
  if (matchIndex === -1) {
    return content.length > maxLength ? `${content.slice(0, maxLength).trim()}…` : content;
  }

  const start = Math.max(0, matchIndex - Math.floor(maxLength / 3));
  const end = Math.min(content.length, start + maxLength);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < content.length ? '…' : '';

  return `${prefix}${content.slice(start, end).trim()}${suffix}`;
}
