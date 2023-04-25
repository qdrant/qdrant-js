# JavaScript Qdrant SDK

This repository contains packages of the JS SDK for the [Qdrant](https://github.com/qdrant/qdrant) vector search engine.

The SDK package can be found under [packages/qdrant-js](./packages/qdrant-js).

## Releases

Major and minor versions align with Qdrant's engine releases, whilst patch are reserved for fixes regarding the current minor release. Check out [RELEASE.md](./RELEASE.md) for more info on release guidelines.

For release automation we use [`changesets`](https://github.com/changesets/changesets) both for pull requests and pushes to the master branch, and their [Github Action](https://github.com/changesets/action) to automate changeset steps.

## Contributions

In order to contribute there are a couple of things you may need to do.

We make use of [`pnpm`](https://pnpm.io/) instead of `npm` or `yarn` to manage and install packages in this monorepo, make sure it's installed on your local environment.

After checking out the repository and desired branch, run `pnpm install` to install all package's dependencies and run the compilation steps. This will work for the monorepo.

> For anything outside the monorepo, e.g.: [`examples/node-js-basic`](./examples/node-js-basic) feel free to use `npm` for installing packages and running scripts.
