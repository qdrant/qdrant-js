# Release guidelines

New releases are made from the `master` branch following semver. Major and minor versions align with Qdrant's engine releases, whilst patch are reserved for fixes regarding the current minor release.

## Dictionary

-   **AC**: All Contributors - public and private members
-   **RC**: Release Coordinator - solve private member in charge of one-at-a-time releases.

## Manual steps

1. Add new changeset to describe the changes `pnpm changeset` (**AC**)
2. Decide on a semver release, bump version in package.json file(s) and update the changelog: `pnpm changeset version` (**RC**)

> In some cases, you may want to merge a change without doing any releases (such as when you only change tests or build tools). In this case, you can run `pnpm changeset --empty`. This will add a special changeset that does not release anything.

## Automation

The [changesets](https://github.com/changesets/action) Github Action within `release.yaml` will run on push to the `master` branch and match against the `baseBranch` specified in [`.changeset/config.json`](./.changeset/config.json). This does two possible things:

1. Finds a `changeset`, in which case it will:

    - open a pull request with the branch `changeset-release/master` against the `baseBranch` containing the automatic versioning and changelog changes.

2. Finds a new changeset version, in which case it will:

    - commit the version and changelog changes, push the changes to the `baseBranch`
    - create the relevant `git tag`(s) for the packages
    - create a GitHub release with the changelog and artifacts
    - publish the package(s) to npmjs.com

Learn more about `changeset` by heading to their [documentation](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).
