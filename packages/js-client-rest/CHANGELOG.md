# @qdrant/js-client-rest

## v1.17.0

### Minor Changes

-   Qdrant v1.17.0 API
-   Added `listShardKeys` method
-   Added `clusterTelemetry` method
-   Added `getOptimizations` method
-   Added `timeout` parameter to write operations: `updateVectors`, `deleteVectors`, `setPayload`, `overwritePayload`, `deletePayload`, `clearPayload`, `batchUpdate`

## v1.16.2

### Patch Changes

-   Add provenance statement for this package

## v1.16.1

### Patch Changes

-   Patch update for Qdrant v1.16.0 API
-   Use `Schemas["MyType"]` in arguments for better navigability.

## 1.16.0

### Minor Changes

-   Qdrant v1.16.0 API
-   Breaking: removed `/locks` API
-   Breaking: removed `init_from` parameter from collection creation
-   Breaking: removed `vectors_count` from collection info
-   Added explicit return types for all API methods

## 1.15.1

### Minor Changes

-   Implement missing `updateCollectionCluster` API

## 1.15.0

### Minor Changes

-   Qdrant v1.15.0 API

## 1.14.1

### Minor Changes

-   Update undici to ^6.0.0
-   Drop support for Node.js < 18.17.0 (because of undici)

## 1.14.0

### Minor Changes

-   Qdrant v1.14.0 API

## 1.13.0

### Minor Changes

-   Qdrant v1.13.0 API

## 1.12.0

### Minor Changes

-   Qdrant v1.12.0 API

## 1.11.0

### Minor Changes

-   Qdrant v1.11.0 API

## 1.10.0

### Minor Changes

-   Qdrant v1.10.0 API

## 1.9.0

### Minor Changes

-   Qdrant v1.9.0 API

## 1.8.2

### Patch Changes

-   [#70](https://github.com/qdrant/qdrant-js/pull/70) Bump undici from 5.28.3 to 5.28.4

## 1.8.1

### Patch Changes

-   [#67](https://github.com/qdrant/qdrant-js/pull/67) Update dependencies for @qdrant/openapi-typescript-fetch to 1.2.6

## 1.8.0

### Minor Changes

-   Qdrant v1.8.0 API
-   [#62](https://github.com/qdrant/qdrant-js/pull/62) Thanks [@Rendez](https://github.com/Rendez) and [@kartik-gupta-ij](https://github.com/kartik-gupta-ij)! - Implement BigInt support

## 1.7.0

### Minor Changes

-   Qdrant v1.7.0 API
-   [#54](https://github.com/qdrant/qdrant-js/pull/54) Thanks Mohamed Morad (Morad-m11)! - recommendBatch mispell

## 1.6.0

### Minor Changes

-   Qdrant v1.6.0 API

## 1.5.0

### Minor Changes

-   Qdrant v1.5.0 API

## 1.4.0

### Minor Changes

-   Qdrant v1.4.0 API

## 1.3.0

### Minor Changes

-   Qdrant v1.3.0 API

## 1.2.2

### Patch Changes

-   [#27](https://github.com/qdrant/qdrant-js/pull/27) [`1e849ae`](https://github.com/qdrant/qdrant-js/commit/1e849aea8596c2f972ee602f604fe77adf136dbf) Thanks [@Rendez](https://github.com/Rendez)! - gRPC with direct NPM dependency to avoid local .tgz problems

## 1.2.1

### Patch Changes

-   [#24](https://github.com/qdrant/qdrant-js/pull/24) [`fb009e1`](https://github.com/qdrant/qdrant-js/commit/fb009e1efec42b6383a6f0e764312a39808ee932) Thanks [@Rendez](https://github.com/Rendez)! - Added gRPC client

-   [`38419ae`](https://github.com/qdrant/qdrant-js/commit/38419ae6b030f0535c74050cc73bd4a02f755028) Thanks [@Rendez](https://github.com/Rendez)! - Re-export custom errors on entry files

## 1.2.0

### Minor Changes

-   [`5413e88`](https://github.com/qdrant/qdrant-js/commit/5413e887a687c90cdc53569207f9fee616552e0c) Thanks [@IvanPleshkov](https://github.com/IvanPleshkov)! - v1.2.0 API (#18)

## 1.1.6

### Patch Changes

-   [`1f0605a`](https://github.com/qdrant/qdrant-js/commit/1f0605ab455d4dadf5940dbe2760c5d4092fddd6) Thanks [@Rendez](https://github.com/Rendez)! - Use @qdrant/openapi-typescript-fetch as dependency

## 1.1.5

### Patch Changes

-   [#13](https://github.com/qdrant/qdrant-js/pull/13) [`a483121`](https://github.com/qdrant/qdrant-js/commit/a483121091a36bffa9b5b894a7e7aa0c2ad66e0b) Thanks [@Rendez](https://github.com/Rendez)! - Fix npm install script of dependency for Windows envs

## 1.1.4

### Patch Changes

-   [#10](https://github.com/qdrant/qdrant-js/pull/10) [`cbc27fa`](https://github.com/qdrant/qdrant-js/commit/cbc27fa3b75b5ff81effa8e0170e4ecc76fa5ea6) Thanks [@generall](https://github.com/generall)! - Add missing offset param in scroll

## 1.1.2

### Patch Changes

-   [#6](https://github.com/qdrant/qdrant-js/pull/6) [`4420c5f`](https://github.com/qdrant/qdrant-js/commit/4420c5f5bb2a8f2cebc56b34c80c003ad77f5805) Thanks [@Rendez](https://github.com/Rendez)! - Move examples into another folder and expanded documentation

-   [#6](https://github.com/qdrant/qdrant-js/pull/6) [`4420c5f`](https://github.com/qdrant/qdrant-js/commit/4420c5f5bb2a8f2cebc56b34c80c003ad77f5805) Thanks [@Rendez](https://github.com/Rendez)! - Fixes issue on Webpack and potentially other bundles to target ESM files when bundling.

-   [#6](https://github.com/qdrant/qdrant-js/pull/6) [`4420c5f`](https://github.com/qdrant/qdrant-js/commit/4420c5f5bb2a8f2cebc56b34c80c003ad77f5805) Thanks [@Rendez](https://github.com/Rendez)! - Fixes default parameter host=localhost resolving to ipv6 ::1 since Node 17 by using 127.0.0.1 instead.
