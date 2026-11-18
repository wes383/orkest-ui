/**
 * Serialises a rendered documentation article into Markdown.
 *
 * The article is rendered from MDX, so the richest source of truth is the DOM
 * the reader is looking at: live previews become their example code, the props
 * table becomes a real table, and the wording always matches the page. Reading
 * the MDX file again would mean re-parsing JSX attributes on the server and
 * shipping the duplicate text to the browser.
 */

const SKIP_SELECTOR = [
  'button',
  'svg',
  'script',
  'style',
  '.sr-only',
  '[aria-hidden="true"]',
  '.demo',
  '.prev-next',
  '.copy-button',
  '.heading-anchor',
].join(', ');

const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

function collapse(value: string): string {
  return value.replace(/\s+/g, ' ');
}

function textOf(node: Element): string {
  return collapse(node.textContent ?? '').trim();
}

function inlineChildren(node: Element): string {
  let result = '';

  node.childNodes.forEach((child) => {
    result += inline(child);
  });

  return result;
}

function inline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return collapse(node.textContent ?? '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as HTMLElement;

  if (element.matches(SKIP_SELECTOR)) {
    return '';
  }

  switch (element.tagName) {
    case 'BR':
      return '\n';
    case 'CODE':
    case 'KBD': {
      const code = element.textContent ?? '';
      return code ? `\`${collapse(code).trim()}\`` : '';
    }
    case 'STRONG':
    case 'B': {
      const strong = inlineChildren(element).trim();
      return strong ? `**${strong}**` : '';
    }
    case 'EM':
    case 'I': {
      const emphasis = inlineChildren(element).trim();
      return emphasis ? `*${emphasis}*` : '';
    }
    case 'A': {
      const label = inlineChildren(element).trim();
      const href = element.getAttribute('href') ?? '';

      if (!label) {
        return '';
      }

      return href ? `[${label}](${href})` : label;
    }
    case 'IMG': {
      const alt = element.getAttribute('alt') ?? '';
      const src = element.getAttribute('src') ?? '';
      return src ? `![${alt}](${src})` : '';
    }
    default:
      return inlineChildren(element);
  }
}

function fence(code: string, language: string): string {
  const body = code.replace(/\s+$/, '');
  const ticks = body.includes('```') ? '````' : '```';

  return `${ticks}${language}\n${body}\n${ticks}`;
}

function quote(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) => (line ? `> ${line}` : '>'))
    .join('\n');
}

function tableCell(cell: Element): string {
  return inlineChildren(cell)
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function tableRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

function genericTable(element: Element): string | null {
  const headCells = Array.from(element.querySelectorAll('thead th')).map(tableCell);
  const bodyRows = Array.from(element.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('th, td')).map(tableCell),
  );

  if (headCells.length === 0 && bodyRows.length === 0) {
    return null;
  }

  const columnCount = Math.max(headCells.length, ...bodyRows.map((row) => row.length));

  if (columnCount === 0) {
    return null;
  }

  const header = headCells.length > 0 ? headCells : new Array(columnCount).fill('');
  const pad = (cells: string[]) => [
    ...cells,
    ...new Array(Math.max(columnCount - cells.length, 0)).fill(''),
  ];

  return [
    tableRow(pad(header)),
    tableRow(new Array(columnCount).fill('---')),
    ...bodyRows.map((row) => tableRow(pad(row))),
  ].join('\n');
}

/**
 * The props table renders each prop as two rows: values, then a full-width
 * description. Folding those pairs back into one row gives a table that stays
 * readable once the styling is gone.
 */
function propsTable(element: Element): string | null {
  const rows = Array.from(element.querySelectorAll('tbody tr')).filter(
    (row) => !row.classList.contains('props-description'),
  );

  if (rows.length === 0) {
    return null;
  }

  const body = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll('th, td')).map(tableCell);
    const descriptionRow = row.nextElementSibling;
    const description =
      descriptionRow?.classList.contains('props-description') === true
        ? tableCell(descriptionRow)
        : '';

    return [cells[0] ?? '', cells[1] ?? '', cells[2] ?? '', description];
  });

  return [
    tableRow(['Prop', 'Type', 'Default', 'Description']),
    tableRow(new Array(4).fill('---')),
    ...body.map((cells) => tableRow(cells)),
  ].join('\n');
}

function listBlock(element: Element, depth: number): string {
  const ordered = element.tagName === 'OL';
  const start = Number(element.getAttribute('start') ?? '1');

  return Array.from(element.children)
    .filter((child) => child.tagName === 'LI')
    .map((item, index) => {
      const marker = ordered ? `${start + index}.` : '-';
      const nested: Element[] = [];
      let content = '';

      item.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const nestedElement = child as Element;

          if (nestedElement.tagName === 'UL' || nestedElement.tagName === 'OL') {
            nested.push(nestedElement);
            return;
          }
        }

        content += inline(child);
      });

      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const first = lines.shift() ?? '';
      const continuation = `${'  '.repeat(depth)}${' '.repeat(marker.length + 1)}`;
      const parts = [`${'  '.repeat(depth)}${marker} ${first}`];

      lines.forEach((line) => parts.push(`${continuation}${line}`));
      nested.forEach((child) => parts.push(listBlock(child, depth + 1)));

      return parts.filter(Boolean).join('\n');
    })
    .join('\n');
}

function callout(element: Element): string | null {
  const title = element.querySelector('.callout-title');
  const body = element.querySelector('.callout-body');
  const titleText = title ? textOf(title) : '';
  const bodyMarkdown = body ? blocks(body) : '';
  const parts: string[] = [];

  if (titleText) {
    parts.push(quote(`**${titleText}**`));
  }

  if (bodyMarkdown) {
    parts.push(quote(bodyMarkdown));
  }

  return parts.length > 0 ? parts.join('\n>\n') : null;
}

function previewLabel(element: Element): string | null {
  const label = element.querySelector('.preview-label');

  if (!label) {
    return null;
  }

  const text = textOf(label);
  return text ? `**${text}**` : null;
}

function block(element: Element): string | null {
  if (element.matches(SKIP_SELECTOR)) {
    return null;
  }

  if (HEADING_TAGS.has(element.tagName)) {
    const level = Number(element.tagName.slice(1));
    const text = inlineChildren(element).trim();

    return text ? `${'#'.repeat(level)} ${text}` : null;
  }

  if (element.tagName === 'P') {
    const text = inlineChildren(element).trim();
    return text ? text : null;
  }

  if (element.tagName === 'UL' || element.tagName === 'OL') {
    return listBlock(element, 0);
  }

  if (element.classList.contains('code-block')) {
    const code = element.querySelector('pre');
    const language =
      code?.getAttribute('data-language') ?? element.getAttribute('data-language') ?? 'tsx';

    return code ? fence(code.textContent ?? '', language) : null;
  }

  if (element.tagName === 'PRE') {
    const code = element.textContent ?? '';
    const language = element.getAttribute('data-language') ?? 'tsx';

    return code.trim() ? fence(code, language) : null;
  }

  if (element.tagName === 'BLOCKQUOTE') {
    const body = blocks(element);
    return body ? quote(body) : null;
  }

  if (element.tagName === 'HR') {
    return '---';
  }

  if (element.classList.contains('props-table')) {
    return propsTable(element);
  }

  if (element.tagName === 'TABLE') {
    return genericTable(element);
  }

  if (element.classList.contains('callout')) {
    return callout(element);
  }

  if (element.classList.contains('component-preview')) {
    return previewLabel(element);
  }

  const nested = blocks(element);
  return nested || null;
}

function blocks(parent: Element): string {
  const parts: string[] = [];

  parent.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = collapse(child.textContent ?? '').trim();

      if (text) {
        parts.push(text);
      }

      return;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const markdown = block(child as Element);

    if (markdown) {
      parts.push(markdown);
    }
  });

  return parts.join('\n\n');
}

export function articleToMarkdown(article: HTMLElement): string {
  const title = article.querySelector('.page-title');
  const description = article.querySelector('.page-description');
  const prose = article.querySelector('.prose');
  const parts: string[] = [];
  const titleText = title ? textOf(title) : '';

  if (titleText) {
    parts.push(`# ${titleText}`);
  }

  const descriptionText = description ? textOf(description) : '';

  if (descriptionText) {
    parts.push(descriptionText);
  }

  const body = prose ? blocks(prose) : '';

  if (body) {
    parts.push(body);
  }

  return `${parts.join('\n\n')}\n`;
}
