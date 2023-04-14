# Release guidelines

## Dictionary

-   **AC**: All Contributors - public and private members
-   **RC**: Release Coordinator - solve private member in charge of one-at-a-time releases.

## Release plan

### Manual steps

1. Add new changeset to describe the changes `pnpm changeset` (**AC**)
2. Decide on a semver release, bump version in package.json file(s) and update the changelog: `pnpm changeset version` (**RC**)

> In some cases, you may want to merge a change without doing any releases (such as when you only change tests or build tools). In this case, you can run `pnpm changeset --empty`. This will add a special changeset that does not release anything.

### Automated steps

1. The [changesets](https://github.com/changesets/action) Github Action within `release.yaml` runs on push to the `master` branch and either.
