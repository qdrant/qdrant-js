# JS Qdrant client library

Fully-typed openAPI-based client library for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

## Installation

```shell
npm install qdrant-js
# or
yarn add npm install qdrant-js
# or
pnpm i qdrant-js
```

## Examples

Instance a client

```ts
import {QdrantClient} from 'qdrant-js';

const client = new QdrantClient({host: 'localhost', port: 6333, apiKey: '<token>'});
// or
const client = new QdrantClient({url: 'http://localhost:6333', apiKey: '<token>'});
```

Call an endpoint via its API

```ts
const result = await client.api('service').telemetry({anonymize: true});
```
