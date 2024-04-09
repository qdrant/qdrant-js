<p align="center">
  <img height="100" src="https://github.com/qdrant/qdrant/raw/master/docs/logo.svg" alt="Qdrant"> 
  &nbsp;
  <img height="80" src="./docs/ts-logo-256.svg" alt="Qdrant">
</p>

<p align="center">
    <b>JavaScript/TypeScript library for the <a href="https://github.com/qdrant/qdrant">Qdrant</a> vector search engine.</b>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@qdrant/qdrant-js"><img src="https://badge.fury.io/js/@qdrant%2Fqdrant-js.svg" alt="npm version" height="18"></a>
    <a href="https://qdrant.github.io/qdrant/redoc/index.html"><img src="https://img.shields.io/badge/Docs-OpenAPI%203.0-success" alt="OpenAPI Docs"></a>
    <a href="https://github.com/qdrant/qdrant-client/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-success" alt="Apache 2.0 License"></a>
    <a href="https://qdrant.to/discord"><img src="https://img.shields.io/badge/Discord-Qdrant-5865F2.svg?logo=discord" alt="Discord"></a>
    <a href="https://qdrant.to/roadmap"><img src="https://img.shields.io/badge/Roadmap-2023-bc1439.svg" alt="Roadmap 2023"></a>
</p>

# JavaScript Qdrant SDK

This repository contains packages of the JS SDK for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

There are published 3 packages:

-   [`@qdrant/qdrant-js`](https://www.npmjs.com/package/@qdrant/qdrant-js) [Code](./packages/qdrant-js/)- the main package with the SDK itself.
-   [`@qdrant/js-client-rest`](https://www.npmjs.com/package/@qdrant/js-client-rest) [Code](./packages/qdrant-js/) - lightweight REST client for Qdrant.
-   [`@qdrant/js-client-grpc`](https://www.npmjs.com/package/@qdrant/js-client-grpc) [Code](./packages/qdrant-js/) - gRPC client for Qdrant.

## JS/TS Examples

### Installation

```shell
pnpm i @qdrant/js-client-rest
# or
npm install @qdrant/js-client-rest
# or
yarn add @qdrant/js-client-rest
```

### Usage

Run the Qdrant Docker container:

```shell
docker run -p 6333:6333 qdrant/qdrant
```

### Instantiate a client

```ts
import {QdrantClient} from '@qdrant/js-client-rest';

// TO connect to Qdrant running locally
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

// or connect to Qdrant Cloud
const client = new QdrantClient({
    url: 'https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.us-east-0-1.aws.cloud.qdrant.io',
    apiKey: '<your-api-key>',
});
```

### Make requests

Using one of the available facade methods:

```ts
const result = await client.getCollections();
console.log('List of collections:', result.collections);
```

More examples can be found in the [`examples`](./examples) folder.

## Support

TypeScript types are provided alongside JavaScript sources to be used in:

-   Node.js (ESM and CJS) - `>= 18.0.0`
-   Deno
-   Browser (fetch API)
-   Cloudflare Workers (OpenAPI only)

## Releases

Major and minor versions align with Qdrant's engine releases, whilst patch are reserved for fixes regarding the current minor release. New releases are made from the `master` branch.

## Contributing

In order to [contribute](./CONTRIBUTING.md) there are a couple of things you may need to setup. We make use of [`pnpm`](https://pnpm.io/) instead of `npm` or `yarn` to manage and install packages in this monorepo, make sure it's installed on your local environment.

After checking out the repository and desired branch, run `pnpm install` to install all package's dependencies and run the compilation steps. This will work for the monorepo.

> For anything outside the monorepo, e.g.: [`examples/node-js-basic`](./examples/node-js-basic) feel free to use `npm` for installing packages and running scripts.
