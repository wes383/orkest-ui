import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const contentDirectory = fileURLToPath(new URL('../apps/docs/content/components', import.meta.url));

// Every component ships a documentation page, so deriving the list from the content
// directory keeps the suites in step with the library instead of drifting behind a
// hand-written list.
export const componentPages = readdirSync(contentDirectory)
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => {
    const name = path.basename(file, '.mdx');

    return { name, path: `/docs/components/${name}/` };
  })
  .sort((left, right) => left.name.localeCompare(right.name));
