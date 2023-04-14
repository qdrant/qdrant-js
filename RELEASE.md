# Public release guidelines

## Dictionary

-   **AC**: All Contributors - public and private members
-   **RC**: Release Coordinator - solve private member in charge of one-at-a-time releases.

## Release plan

### Manual steps

1. Add new changeset to describe the changes `pnpm changeset` (AC)
2. Decide on a semver release, bump version in package.json file(s) and update the changelog: `pnpm changeset version` (RC)

### Automated steps

1. The [changesets](https://github.com/changesets/action) Github Action within `release.yaml` runs on push to the `master` branch and either.
