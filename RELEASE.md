# Release guidelines

New releases are made from the `master` branch following semver. Major and minor versions align with Qdrant's engine releases, whilst patch are reserved for fixes regarding the current minor release.

## Dictionary

-   **AC**: All Contributors - public and private members
-   **RC**: Release Coordinator - solve private member in charge of one-at-a-time releases.

## Manual steps

1. (**AC**) Add new changeset to describe the changes `pnpm changeset`. _In some cases, you may want to merge a change without doing any releases (such as when you only change tests or build tools). In this case, you can run `pnpm changeset --empty`. This will add a special changeset that does not release anything._

2. (**AC**) Then open a pull request.

3. (**RC**) verifies the **semver** version commitment and turns it into a bump with `pnpm ci:version` on the root directory. This updates the versions on package.json files and updates the CHANGELOG.md files.

> This last step if skipped could result in an outdated pnpm lock file, and if so, update it manually with: `pnpm install --lockfile-only`.

## Automation

The [changesets](https://github.com/changesets/action) Github Action within `release.yaml` will run on push to the `master` branch and match against the `baseBranch` specified in [`.changeset/config.json`](./.changeset/config.json). This does two possible things:

1. Finds a `changeset`, in which case it will:

    - open a pull request with the branch `changeset-release/master` against the `baseBranch` containing the automatic versioning and changelog changes.

> the opened pull request will have the result of running `changeset version`, but could have a pnpm lock file out-of-date, please run `pnpm install --lockfile-only` locally and push the updated pnpm lock file to this branch.

2. Finds a new version, in which case it will release using these steps:

    - commit the version and changelog changes to the `baseBranch`
    - create the relevant `git tag`(s) for the packages
    - push the changes including the tags
    - create a GitHub release with the updated changelog and artifacts
    - publish the package(s) to npmjs.com

Learn more about `changeset` by heading to their [documentation](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).
