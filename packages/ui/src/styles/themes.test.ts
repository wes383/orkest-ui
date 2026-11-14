import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const themesSource = readFileSync(resolve(process.cwd(), 'src/styles/themes.css'), 'utf8');
const tokensSource = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

const uiTokenPattern = /--ui-[\w-]+(?=\s*:)/g;
const primitiveTokenPattern = /--ok-[\w-]+(?=\s*:)/g;
const primitiveReferencePattern = /--ok-[\w-]+(?=\))/g;

function readBlock(selector: string): string {
  const selectorIndex = themesSource.indexOf(selector);
  expect(selectorIndex, `Missing selector: ${selector}`).toBeGreaterThan(-1);

  const openBrace = themesSource.indexOf('{', selectorIndex);
  const closeBrace = themesSource.indexOf('}', openBrace);
  return themesSource.slice(openBrace + 1, closeBrace);
}

function collect(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].map((match) => match[0]).sort();
}

describe('theme tokens', () => {
  const lightTokens = collect(readBlock(':root,\n[data-orkest-theme="light"]'), uiTokenPattern);
  const darkTokens = collect(readBlock('[data-orkest-theme="dark"]'), uiTokenPattern);
  const systemDarkTokens = collect(
    readBlock(':root:not([data-orkest-theme="light"])'),
    uiTokenPattern,
  );

  it('defines the same semantic tokens in every theme', () => {
    expect(darkTokens).toEqual(lightTokens);
    expect(systemDarkTokens).toEqual(lightTokens);
  });

  it('only references primitive tokens that exist', () => {
    const definedPrimitives = new Set(collect(tokensSource, primitiveTokenPattern));
    const referencedPrimitives = new Set(collect(themesSource, primitiveReferencePattern));

    for (const token of referencedPrimitives) {
      expect(definedPrimitives.has(token), `Undefined primitive token: ${token}`).toBe(true);
    }
  });
});
