import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Snapshots are only comparable inside the Playwright image: the renderer, fonts and system
// libraries are what keep subpixel layout identical to CI. The tag has to match the installed
// Playwright version, whose bundled browser produced the snapshots.
const playwrightVersion = JSON.parse(
  readFileSync(resolve('node_modules/@playwright/test/package.json'), 'utf8'),
).version;

const image =
  process.env.PLAYWRIGHT_IMAGE ?? `mcr.microsoft.com/playwright:v${playwrightVersion}-noble`;

if (!existsSync(resolve('apps/docs/out/index.html'))) {
  throw new Error('Build the site first: pnpm e2e:build');
}

const forwarded = process.argv.slice(2).filter((argument) => argument !== '--');
const workdir = process.cwd().replace(/\\/g, '/');

// Only Playwright runs in the container; the site is served from the already-built `out`.
execFileSync(
  'docker',
  [
    'run',
    '--rm',
    '-v',
    `${workdir}:/work`,
    '-w',
    '/work',
    image,
    'npx',
    'playwright',
    'test',
    'tests/visual.spec.ts',
    ...forwarded,
  ],
  { stdio: 'inherit' },
);
