# JavaScript Qdrant gRPC Client

This repository contains the gRPC client for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

## Installation

```shell
npm install @qdrant/js-client-grpc
# or
yarn add @qdrant/js-client-grpc
# or
pnpm i @qdrant/js-client-grpc
```

## Usage

Run the Qdrant Docker container:

```shell
docker run -p 6334:6334 qdrant/qdrant
```

## Instantiate a client

```ts
import {QdrantClient} from '@qdrant/js-client-grpc';

const client = new QdrantClient({host: '127.0.0.1', port: 6334});
// or
const client = new QdrantClient({url: 'http://127.0.0.1:6334'});
```

## Make requests

Use an endpoint from `collections` API:

```ts
try {
    const result = await client.api('collections').list({});
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}
```

## Support

The gRPC implementation relies on the native node module `node:https`. For the time being, no JavaScript runtime other than Node / Deno are supported (though support for web may be added). Both Deno and Node support full-duplex, HTTP trailers and all the necessary bits for gRPC. Under the hood, the client uses [`connect-es`](https://github.com/bufbuild/connect-es/) to communicate with the server.

## Releases

Major and minor versions align with Qdrant's engine releases, whilst patch are reserved for fixes regarding the current minor release. Check out [RELEASE.md](../../RELEASE.md) for more info on release guidelines.

## Contributing

These are the most relevant scripts for development:

-   `pnpm build`: builds and bundles from TypeScript sources
-   `pnpm pre-check`: type-checks sources
-   `pnpm pre-commit`: same as pre-check, but for git hooks (husky)
-   `pnpm test`: run unit tests
-   `pnpm test:integration`: runs integration tests against a locally running Qdrant docker container
-   `pnpm codegen:grpc-typescript`: updates generated TS classes and types from the latest remote proto files
