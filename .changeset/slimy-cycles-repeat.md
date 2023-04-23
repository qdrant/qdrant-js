---
'@qdrant/js-client-rest': patch
'@qdrant/qdrant-js': patch
---

- Fixes issue on Webpack and potentially other bundles to target ESM files when bundling.
- Fixes default parameter host=localhost resolving to ipv6 ::1 since Node 17 by using 127.0.0.1 instead.
