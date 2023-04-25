# Contributing to Qdrant-JS

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

-   Reporting a bug
-   Discussing the current state of the code
-   Submitting a fix
-   Proposing new features

## We Develop with Github

We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. Make sure your code lints: `pnpm pre-check`. The root package installs a `pre-commit` hook with [husky](https://github.com/typicode/husky/) to automate this check.
4. Ensure the test suite passes: `pnpm test`.
5. When ready, use [Changesets](https://github.com/changesets/changesets): `pnpm changeset` to describe the change(s). The generated markdown files in the `.changeset` directory should be committed to the repository.
6. Issue that pull request!

## Any contributions you make will be under the Apache License 2.0

In short, when you submit code changes, your submissions are understood to be under the same [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/qdrant/qdrant-js/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

-   A quick summary and/or background
-   Steps to reproduce
    -   Be specific!
    -   Give sample code if you can.
-   What you expected would happen
-   What actually happens
-   Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

If you are modifying TypeScript code, make sure it has no warnings from ESLint or Prettier.
The project uses the [eslint](https://eslint.org/) formatter together with prettier. Please ensure your code editor is appropriately configured to handle mono-repo projects.

## License

By contributing, you agree that your contributions will be licensed under its Apache License 2.0.
