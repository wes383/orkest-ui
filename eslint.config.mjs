import next from "eslint-config-next";

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "tsconfig.*.tsbuildinfo",
    ],
  },
  ...next,
  {
    rules: {
      // Mount-time sync with external systems (localStorage, matchMedia,
      // theme classes) is the canonical SSR-safe pattern here; keep it
      // visible but non-blocking.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
