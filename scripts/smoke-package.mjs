import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const work = mkdtempSync(join(tmpdir(), 'orkest-ui-smoke-'));

function run(command, cwd) {
  console.log(`\n$ ${command}`);
  execSync(command, { cwd, stdio: 'inherit' });
}

try {
  const packDir = join(work, 'pack');
  mkdirSync(packDir);

  run(`pnpm --filter @orkest/ui pack --pack-destination "${packDir}"`, root);

  const tarball = readdirSync(packDir).find((file) => file.endsWith('.tgz'));

  if (!tarball) {
    throw new Error('The package tarball was not produced.');
  }

  const consumer = join(work, 'consumer');
  mkdirSync(join(consumer, 'src'), { recursive: true });
  cpSync(join(packDir, tarball), join(consumer, 'orkest-ui.tgz'));

  writeFileSync(
    join(consumer, 'package.json'),
    `${JSON.stringify(
      {
        name: 'orkest-ui-smoke-consumer',
        private: true,
        type: 'module',
        dependencies: {
          '@orkest/ui': 'file:./orkest-ui.tgz',
          react: '^19.3.1',
          'react-dom': '^19.3.1',
        },
        devDependencies: {
          '@types/react': '^19.3.0',
          '@types/react-dom': '^19.3.0',
          '@vitejs/plugin-react': '^6.3.0',
          typescript: '^5.9.3',
          vite: '^8.3.8',
        },
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(
    join(consumer, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          types: ['vite/client'],
        },
        include: ['src'],
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(
    join(consumer, 'vite.config.ts'),
    `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
});
`,
  );

  writeFileSync(
    join(consumer, 'index.html'),
    `<!doctype html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  );

  writeFileSync(
    join(consumer, 'src/main.tsx'),
    `import { createRoot } from 'react-dom/client';

import {
  Button,
  Card,
  CardContent,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@orkest/ui';
import { Input } from '@orkest/ui/client';
import '@orkest/ui/style.css';

function App() {
  return (
    <Card>
      <CardContent>
        <Input placeholder="Email" />
        <Button loading>Save</Button>
        <Spinner label="Loading" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Orkest</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
`,
  );

  run('npm install --no-audit --no-fund --loglevel=error', consumer);
  run('npm exec -- tsc --noEmit', consumer);

  writeFileSync(
    join(consumer, 'cjs-check.cjs'),
    `const assert = require('node:assert');

// The package ships a CJS build as well, so a CommonJS consumer must resolve the
// same public surface without an ESM loader.
const ui = require('@orkest/ui');
const client = require('@orkest/ui/client');

assert.ok(ui.Button, 'Button is missing from the CJS entry');
assert.ok(ui.Table, 'Table is missing from the CJS entry');
assert.ok(client.Dialog, 'Dialog is missing from the CJS client entry');
assert.ok(client.Select, 'Select is missing from the CJS client entry');

console.log('CJS entry resolved.');
`,
  );
  run('node cjs-check.cjs', consumer);

  run('npm exec -- vite build', consumer);

  console.log('\nPackage smoke test passed.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
