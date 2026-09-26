/**
 * Token sync checker — verifies that lib/tokens.ts mirrors app/globals.css.
 *
 * For each theme mode, parses the variables explicitly defined in the
 * corresponding CSS selector block and compares them (whitespace/case
 * normalized) against `tokensToCssVars(themes[mode])`. Variables not
 * overridden in a mode's CSS block are inherited and therefore skipped.
 *
 * Usage: npm run check:tokens
 * (runs `node --experimental-strip-types scripts/check-tokens.mjs`)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { themes, tokensToCssVars } from "../lib/tokens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "app", "globals.css"), "utf8");

const MODE_SELECTORS = {
  light: /:root\s*\{/,
  dark: /html\.dark\s*\{/,
  "light-hc": /html\.high-contrast\s*\{/,
  "dark-hc": /html\.dark\.high-contrast\s*\{/,
};

/**
 * Extract a CSS selector block body. Matches up to the first `}` because the
 * token blocks in globals.css contain no nested braces.
 */
function extractBlock(source, selectorRegex) {
  const match = selectorRegex.exec(source);
  if (!match) return null;
  const start = match.index + match[0].length;
  const end = source.indexOf("}", start);
  if (end === -1) return null;
  return source.slice(start, end);
}

function parseDeclarations(block) {
  const vars = {};
  const decl = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = decl.exec(block)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

const normalize = (v) => v.replace(/\s+/g, "").toLowerCase();

let errors = 0;
let checked = 0;

for (const [mode, selector] of Object.entries(MODE_SELECTORS)) {
  const block = extractBlock(css, selector);
  if (block === null) {
    console.error(`✗ ${mode}: selector \`${selector.source}\` not found in globals.css`);
    errors++;
    continue;
  }
  const cssVars = parseDeclarations(block);
  const jsVars = tokensToCssVars(themes[mode]);

  for (const [name, cssValue] of Object.entries(cssVars)) {
    if (!(name in jsVars)) continue; // not covered by tokensToCssVars (fonts, spacing, ...)
    checked++;
    if (normalize(cssValue) !== normalize(jsVars[name])) {
      console.error(
        `✗ ${mode} ${name}: globals.css "${cssValue}" != tokens.ts "${jsVars[name]}"`
      );
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\nToken sync check FAILED: ${errors} mismatch(es), ${checked} variables compared.`);
  process.exit(1);
} else {
  console.log(`Token sync check passed: ${checked} variables compared across 4 modes.`);
}
