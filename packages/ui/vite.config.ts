import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test'],
      tsconfigPath: './tsconfig.json',
      bundleTypes: {
        invokeOptions: {
          // unplugin-dts points this at the project's `typescript` package. With
          // TypeScript 7 that package is the TS 6 API compatibility shim, which
          // ships no standard lib files, so API Extractor must use its bundled
          // compiler's libs instead.
          typescriptCompilerFolder: undefined,
        },
      },
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        client: fileURLToPath(new URL('./src/client.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        /^@base-ui\/react(\/.*)?$/,
      ],
    },
  },
  test: {
    environment: 'jsdom',
    // Reuse one jsdom per worker rather than creating it per test file; setup cost dominates the run.
    pool: 'vmThreads',
    // Base UI overlays plus jsdom are slow under full-suite parallelism. Keep a generous
    // timeout so the run is deterministic without changing any assertions.
    testTimeout: 15_000,
    hookTimeout: 15_000,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        // Type-only modules compile to nothing, so they would always report zero.
        'src/**/types.ts',
        'src/**/*-types.ts',
        // Barrel modules only re-export, so their coverage says nothing about the code.
        'src/index.ts',
        'src/client.ts',
        'src/**/index.ts',
      ],
      // Held a few points under the current totals so a platform difference in v8
      // branch counting does not fail the build, while a real regression still does.
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 90,
        lines: 85,
      },
    },
  },
});
