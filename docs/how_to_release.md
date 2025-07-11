
# This is an instruction of how to release a new version on Qdrant JS SDK


## Pre-requisites


- Install Node.js 18 or higher
- Insall `pnpm` 9. With never versions, it won't work! Download the binary directly from here: https://github.com/pnpm/pnpm/releases/tag/v9.15.9


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

You should changes in one or multiple of the following files:

```
src/openapi/generated_schema.ts
src/openapi/generated_client_type.ts
src/openapi/genetated_api_client.ts
```

> Pro tip: if there are some problems with the generated code, our custom script `scripts/generate_client_construction.ts` might require some changes


### Modify `packages/js-client-rest/src/qdrant-client.ts` according to generated changes


- Inspect what changed in `src/openapi/generated_schema.ts` and modify `qdrant-client.ts` according to the changes:

    - [ ] Make sure to add new API methods to `qdrant-client.ts`, if they are added in `src/openapi/generated_schema.ts`. This can be easily checked for by looking at the `operations` interface in `generated_schema.ts`.
          If there is a new API function defined, we also need to create a corresponding API function inside `qdrant-client.ts`!
    - [ ] Make sure that top-level arguments in `qdrant-client.ts` are aligned with the `src/openapi/generated_schema.ts`. This is similar to the previous step, but here you need to adjust the existing API-functions' parameters inside `qdrant-client.ts`.

- [ ] If needed, create tests for the new API methods

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
