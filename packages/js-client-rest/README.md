# JavaScript Qdrant REST Client

This repository contains the REST client for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

## Installation

```shell
npm install @qdrant/js-client-rest
# or
yarn add @qdrant/js-client-rest
# or
pnpm i @qdrant/js-client-rest
```

## Usage

Run the Qdrant Docker container:

```shell
docker run -p 6333:6333 qdrant/qdrant
```

## Instantiate a client

```ts
import {QdrantClient} from '@qdrant/js-client-rest';

const client = new QdrantClient({host: '127.0.0.1', port: 6333});
// or
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});
```

## Make requests

Using one of the available facade methods:

```ts
try {
    const result = await client.getCollections();
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}
```

Or directly using an endpoint from the API:

```ts
await client.api('collections').getCollections();
```

## Releases

Major and minor versions align with Qdrant's engine releases, whilst patch are reserved for fixes regarding the current minor release. Check out [RELEASE.md](../../RELEASE.md) for more info on release guidelines.

## Contributing

These are the most relevant scripts for development:

-   `pnpm build`: builds and bundles from TypeScript sources
-   `pnpm pre-check`: type-checks sources
-   `pnpm pre-commit`: same as pre-check, but for git hooks (husky)
-   `pnpm test`: run unit tests
-   `./tests/integration-tests.sh`: starts local docker container and runs integration tests with: `pnpm test:integration`
-   `pnpm codegen:openapi-typescript`: updates generated TS schema from the latest openapi.json remote
