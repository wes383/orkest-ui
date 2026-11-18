/**
 * Example sources are authored as `export const name = `...`;` near the preview
 * that uses them. Keeping the template literal out of a JSX attribute avoids
 * MDX's attribute indentation stripping, which otherwise eats the leading two
 * spaces of every line of example code.
 *
 * next-mdx-remote removes ESM exports from the compiled MDX, so the constants
 * are read here and handed back through its `scope` option instead.
 */

const DECLARATION = /^export const ([\w$]+) = `/gm;

/** Resolves the escape sequences a template literal would evaluate. */
function cookTemplate(raw: string): string {
  return raw.replace(/\\([`$nrt\\])/g, (_, char: string) => {
    switch (char) {
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      default:
        return char;
    }
  });
}

export function collectExampleCode(source: string): Record<string, string> {
  const examples: Record<string, string> = {};
  let match: RegExpExecArray | null;
  const pattern = new RegExp(DECLARATION.source, DECLARATION.flags);

  while ((match = pattern.exec(source)) !== null) {
    const name = match[1];
    const end = findLiteralEnd(source, pattern.lastIndex);

    if (name && end !== -1) {
      examples[name] = cookTemplate(source.slice(pattern.lastIndex, end));
      pattern.lastIndex = end + 2;
    }
  }

  return examples;
}

/** Returns the index of the closing backtick, skipping escaped characters. */
function findLiteralEnd(source: string, start: number): number {
  let index = start;

  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2;
      continue;
    }

    if (source[index] === '`' && source[index + 1] === ';') {
      return index;
    }

    index += 1;
  }

  return -1;
}
