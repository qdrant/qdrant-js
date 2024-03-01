# Qdrant-JS: JavaScript Qdrant SDK

This package represents the JS SDK for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

The next packages are re-exported from it:

-   [JS Client REST](../js-client-rest)
-   [JS Client gRPC](../js-client-grpc)

## Installation

```shell
pnpm i @qdrant/qdrant-js
# or
npm install @qdrant/qdrant-js
# or
yarn add @qdrant/qdrant-js
```

## Usage

The REST client is imported from the root path; the gRPC is imported from the `/grpc` subpath:

```js
import {QdrantClient} from '@qdrant/qdrant-js'; // REST client
```

```js
import {QdrantClient} from '@qdrant/qdrant-js/grpc'; // gRPC client
```

It is recommended to use the REST (OpenAPI-based) client initially, since REST tends to be easier to debug. Switch to gRPC when you're APIs are working for increase performance. Bear in mind that for small-size request, REST may be of equal if not more performance than gRPC. gRPC incurs a tiny conversion cost but goes easier on the wire, which makes a difference with big data chunks.

## Contributing

These are the most relevant scripts for development:

-   `pnpm build`: builds and bundles from TypeScript sources
-   `pnpm pre-check`: type-checks sources
-   `pnpm pre-commit`: same as pre-check, but for git hooks (husky)
