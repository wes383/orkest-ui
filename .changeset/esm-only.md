---
'@orkest/ui': minor
---

BREAKING: ship ESM only. The CommonJS build is gone, so `require('@orkest/ui')` no longer
resolves to a dedicated bundle. Bundlers and native ESM loaders are unaffected; CommonJS
scripts need `await import('@orkest/ui')` instead.
