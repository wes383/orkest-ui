import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const prettier = require('prettier');
const prettierConfig = (await import('../prettier.config.mjs')).default;

const root = resolve(import.meta.dirname, '..');
const contentRoot = join(root, 'apps/docs/content');
const fix = process.argv.includes('--fix');

/**
 * Samples that are intentionally a fragment rather than a single parseable
 * module. Keep this list short and specific.
 */
const fragmentSamples = new Set(['components/combobox.mdx :: disabledInvalidAndLargeCode']);

const formatOptions = { ...prettierConfig, parser: 'typescript' };

function collectMdxFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      files.push(...collectMdxFiles(full));
    } else if (full.endsWith('.mdx')) {
      files.push(full);
    }
  }

  return files;
}

function readSample(text, start) {
  let index = start;
  let content = '';
  let escaped = false;

  while (index < text.length) {
    const char = text[index];

    if (char === '\\') {
      const next = text[index + 1];
      escaped = escaped || next === '`' || next === '$';
      content += text.slice(index, index + 2);
      index += 2;
      continue;
    }

    if (char === '`') {
      return { content, end: index, escaped };
    }

    content += char;
    index += 1;
  }

  return undefined;
}

function unescapeSample(content) {
  return content.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
}

function escapeSample(content) {
  return content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function normalize(original, formatted) {
  let next = formatted.replace(/\n$/, '');

  // Prettier parses a bare JSX snippet as an expression statement and appends
  // a semicolon the docs never had.
  if (!original.trimEnd().endsWith(';') && next.trimEnd().endsWith(';')) {
    next = next.replace(/;(\s*)$/, '$1');
  }

  return next;
}

let checked = 0;
let fixed = 0;
const outdated = [];
const unparseable = [];

for (const file of collectMdxFiles(contentRoot)) {
  const relativePath = relative(contentRoot, file).split('\\').join('/');
  const text = readFileSync(file, 'utf8');
  const marker = /export const (\w+Code) = `/g;
  let updated = '';
  let cursor = 0;
  let match;

  while ((match = marker.exec(text))) {
    const name = match[1];
    const start = marker.lastIndex;
    const sample = readSample(text, start);

    if (!sample) {
      break;
    }

    checked += 1;

    const code = unescapeSample(sample.content);
    const key = `${relativePath} :: ${name}`;
    const line = text.slice(0, match.index).split('\n').length;
    let next = code;

    try {
      next = normalize(code, await prettier.format(code, formatOptions));
    } catch (error) {
      if (!fragmentSamples.has(key)) {
        unparseable.push({ key, line, message: error.message.split('\n')[0] });
      }
    }

    if (next !== code) {
      outdated.push({ key, line });

      if (fix) {
        fixed += 1;
      }
    }

    updated += text.slice(cursor, start);
    updated += next === code ? sample.content : sample.escaped ? escapeSample(next) : next;
    cursor = sample.end;
  }

  updated += text.slice(cursor);

  if (fix && updated !== text) {
    writeFileSync(file, updated);
  }
}

if (outdated.length > 0) {
  if (fix) {
    console.log(`Fixed ${fixed} of ${checked} docs samples.`);
  } else {
    console.log(`${outdated.length} of ${checked} docs samples need formatting:`);

    for (const item of outdated) {
      console.log(`  ${item.key} (line ${item.line})`);
    }

    console.log('\nRun "pnpm check:docs-samples --fix" to format them.');
  }
} else {
  console.log(`All ${checked} docs samples are formatted.`);
}

if (unparseable.length > 0) {
  console.log(`\n${unparseable.length} docs samples could not be parsed:`);

  for (const item of unparseable) {
    console.log(`  ${item.key} (line ${item.line}): ${item.message}`);
  }

  console.log('\nMake the sample a parseable module or add it to fragmentSamples.');
}

process.exitCode = outdated.length > 0 && !fix ? 1 : unparseable.length > 0 ? 1 : 0;
