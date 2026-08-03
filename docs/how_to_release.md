# This is an instruction of how to release a new version on Qdrant JS SDK

## Pre-requisites

-   Install Node.js 18 or higher
-   Install `pnpm` 10

Install dependencies using `pnpm`:

```bash
pnpm install
```

## Generate gRPC client

Go to grpc client directory, and run the following command:

```bash
cd packages/js-client-grpc

pnpm codegen:grpc-typescript
```

The source of the gRPC schema is defined in `packages/js-client-grpc/scripts/generate-grpc-sources.sh`
and uses the `dev` branch of the Qdrant repository.

> Warn: If there are new `*.proto` files are added, we need to make decision if we want to include them or not.

## Generate REST client

The source of the OpenAPI schema itself is defined in `packages/js-client-rest/package.json`

```json
"config": {
    "openapi_schema_remote": "https://raw.githubusercontent.com/qdrant/qdrant/dev/docs/redoc/master/openapi.json"
},
```

By default, it is pointing to the `dev` branch of the Qdrant repository.
Change it, if you want to point to the `master` or some other branch.

To generate the REST client, run the following command:

```bash
cd packages/js-client-rest

pnpm codegen:openapi-typescript
```

You should see changes in one or multiple of the following files:

```
src/openapi/generated_schema.ts
src/openapi/generated_client_type.ts
src/openapi/genetated_api_client.ts
```

> Pro tip: if there are some problems with the generated code, our custom script `scripts/generate_client_construction.ts` might require some changes

### Why `openapi-typescript` is pinned to `6.2.6`

Two independent things break when it is bumped. Both were measured against the v1.19 `dev` schema.

**1. v7 is incompatible with our fork of the fetch wrapper.** For every parameter slot an operation does not
use, v7 emits a placeholder — `query?: never`, `path?: never`. An optional property typed `never` has type
`undefined`, and `OpArgType` in `@qdrant/openapi-typescript-fetch@1.2.6` intersects the inferred slots:
`{collection_name: string} & undefined` is `never`. Of 67 operations, 16 become uncallable (`never`) and 11
more become `undefined`, which rejects the `f({})` calls used throughout `qdrant-client.ts`.

`requestBody?: never` is _not_ part of this — it infers harmlessly.

Upstream `openapi-typescript-fetch` fixed exactly this in 2.x by wrapping each slot in
`type NonNever<T> = [T] extends [never | undefined] ? unknown : T`. With that guard, all 67 operations
resolve correctly against v7 output. Our fork is at 1.2.6 (March 2024) and predates it. The fork exists for
`JSON.rawJSON`-based BigInt point ids, which upstream does not have, so the fix is to port `NonNever` into
`qdrant/openapi-typescript-fetch` and release it — not to switch to upstream.

**2. `6.7.2` and later erase nullable types.** Qdrant's spec expresses nullable fields as
`anyOf: [{$ref: ...}, {nullable: true}]`. That second branch has no `type`, so it means "any type" and newer
generators render it as `unknown` — and `X | unknown` collapses to `unknown`. `6.2.6` instead guessed
`Record<string, unknown> | null`, which is what preserves the union. The spec has 260 such branches, and 260
fields lose their types from `6.7.2` onward (`ScoredPoint.payload` becomes plain `unknown`). `6.7.1` is the
last good version, but it also drops `| undefined` from index signatures, which weakens types for users.

The durable fix here is on the Qdrant side: emit a typed null branch rather than a bare `{nullable: true}`.
Until then, the pin is what keeps the response types meaningful.

### Endpoints removed from the OpenAPI spec

Qdrant sometimes stops documenting an endpoint before it stops serving it. The generated client follows the
spec, so such an endpoint disappears from `generated_client_type.ts` and its request types disappear from
`Schemas`, which breaks every method in `qdrant-client.ts` that used them.

We follow the spec rather than the running server: drop the corresponding methods from `qdrant-client.ts`,
migrate the tests and `examples/`, and record it under `### Breaking Changes` in the changelog with a mapping
to the replacement API. This is what v1.19 did with the eight search/recommend/discover endpoints
(qdrant/qdrant#9982) — note it breaks semver, so it needs to be agreed on before the release.

### Modify `packages/js-client-rest/src/qdrant-client.ts` according to generated changes

-   Inspect what changed in `src/openapi/generated_schema.ts` and modify `qdrant-client.ts` according to the changes:

    -   [ ] Make sure to add new API methods to `qdrant-client.ts`, if they are added in `src/openapi/generated_schema.ts`. This can be easily checked for by looking at the `operations` interface in `generated_schema.ts`.
            If there is a new API function defined, we also need to create a corresponding API function inside `qdrant-client.ts`!
    -   [ ] Make sure that top-level arguments in `qdrant-client.ts` are aligned with the `src/openapi/generated_schema.ts`. This is similar to the previous step, but here you need to adjust the existing API-functions' parameters inside `qdrant-client.ts`.

-   [ ] If needed, create tests for the new API methods

To run the tests:

```bash
# Run qdrant of the desired version
docker run --rm -it --network=host qdrant/qdrant:dev

# From the rest client directory run the tests
cd packages/js-client-rest
pnpm test:integration
```

## Update version

We need to update all the Qrant versions. We can easily list them by running the `grep` command below.

```
grep -rn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git '1\.15\.0'
```

If you're confident with using vim or nano for that, you can easily run the command below to edit all files:

```
for i in $(grep -rn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git '1\.15\.0' | cut -d ':'  -f1 | uniq); do vi $i;done
```

The output of the `grep` should look like this:

```
packages/js-client-grpc/package.json:3:    "version": "1.15.0"                            -- YES
packages/js-client-grpc/src/client-version.ts:1:export const PACKAGE_VERSION = '1.15.0';  -- YES
packages/js-client-grpc/CHANGELOG.md:3:## 1.15.0                                          -- Add new entry to the changelog
packages/js-client-grpc/CHANGELOG.md:7:-   Qdrant v1.15.0 API                             -- Add new entry to the changelog
packages/js-client-rest/package.json:3:    "version": "1.15.0",                           -- YES
packages/js-client-rest/src/client-version.ts:1:export const PACKAGE_VERSION = '1.15.0';  -- YES
packages/js-client-rest/CHANGELOG.md:3:## 1.15.0                                          -- Add new entry to the changelog
packages/js-client-rest/CHANGELOG.md:7:-   Qdrant v1.15.0 API                             -- Add new entry to the changelog
packages/qdrant-js/package.json:3:    "version": "1.15.0",                                -- YES
packages/qdrant-js/package.json:60:        "@qdrant/js-client-rest": "workspace:1.15.0",  -- YES
packages/qdrant-js/package.json:61:        "@qdrant/js-client-grpc": "workspace:1.15.0"   -- YES
packages/qdrant-js/CHANGELOG.md:3:## 1.15.0                                               -- Add new entry to the changelog
packages/qdrant-js/CHANGELOG.md:7:-   Qdrant v1.15.0 API                                  -- Add new entry to the changelog
packages/qdrant-js/CHANGELOG.md:12:    -   @qdrant/js-client-grpc@1.15.0                  -- Add new entry to the changelog
packages/qdrant-js/CHANGELOG.md:13:    -   @qdrant/js-client-rest@1.15.0                  -- Add new entry to the changelog
packages/qdrant-js/scripts/integration-tests.sh:12:QDRANT_LATEST="v1.15.0"                -- Update the version in the integration tests (CI might be broken before we officially release)
pnpm-lock.yaml:134:        specifier: workspace:1.15.0                                    -- NO, automatically updated by pnpm
pnpm-lock.yaml:137:        specifier: workspace:1.15.0                                    -- NO, automatically updated by pnpm
examples/node-js-basic/package.json:18:        "@qdrant/qdrant-js": "^1.15.0"             -- YES
package.json        "@qdrant/js-client-rest": "workspace:1.15.0",                         -- YES
package.json        "@qdrant/js-client-grpc": "workspace:1.15.0"                          -- YES
```

### Update dependencies

We need to also update the dependencies (`.lock` file), when releasing. This can be done by running `pnpm install` from the git root.

## Final step: Committing changes

If something goes wrong, pre-commit hook might complain.

To debug this, you can run the commands below manually inside the `js-client-rest` folder, to find where it fails. These are the commands
invoked by the pre-commit hook.

```
pnpm tsc:check
pnpm tsc:deadcode
pnpm lint
pnpm test run
```

The linter includes a format checker. To run it, use this command inside the `js-client-rest` directory:

```
pnpm prettier -w .
```

### Make PR with the changes

Like in other clients, new version is published by adding new tag.
