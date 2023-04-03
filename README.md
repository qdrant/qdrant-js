# Node.js Qdrant client library

Client library for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

## Installation

```shell
npm install qdrant-ts-js
# or
yarn add npm install qdrant-js
# or
pnpm i qdrant-ts-js
```

## Examples

Instance a client

```ts
import {QdrantClient} from 'qdrant-js';

client = new QdrantClient({host = 'localhost', port = 6333});
// or
client = new QdrantClient({url: 'http://localhost:6333'});
```
