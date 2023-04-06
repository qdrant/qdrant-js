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

## Private distribution

1. Check out this repo: `git clone --depth 1 https://github.com/qdrant/qdrant-js.git`
2. Go to the directory: `cd qdrant-js`
3. Use NPM to obtain a tarball from this package: `npm pack # outputs qdrant-js-0.0.x.tgz`
4. Send it to the tester, they will be able to install it with: `npm install qdrant-js-0.0.x.tgz`

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
