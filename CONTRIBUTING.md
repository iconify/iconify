# Iconify Contributing Guide

Thank you for considering contributing to Iconify!

This guide should help you understand how repository is setup.

## Repository

This repository is a monorepo using `pnpm` workspaces.

Why `pnpm`? Because, unlike `npm`, it can handle multiple versions of the same dependency in one monorepo, which is required when using multiple versions of the same framework, such as Vue 2 and Vue 3.

### Installation, build and tests

To install dependencies in all packages, run

```bash
pnpm install
```

This will install all dependencies and create symbolic links to packages.

To build everything, run `pnpm run build` (this excludes demo packages).

To run unit tests, run `pnpm run test` (this excludes demo packages).

### Working with specific package

You can run any commands on any package from that package's directory.

For example, to build only `@iconify/utils` package, you can either:

-   Change directory to `packages/utils`
-   Run `pnpm build`

or you can use pnpm filters from root directory:

`pnpm --filter @iconify/utils run build`

or

`pnpm --filter ./packages/utils run build`

### NI

Consider installing [NI](https://github.com/antfu/ni), it makes it easy to work with any repository regardless of what package manager it uses.

Instead of figuring out if you should run `npm install` or `pnpm install` or `yarn install`, just run `ni` and it will execute current package manager, `nr build` to build, `nr test` to run tests test.

It is automatically installed if you are using Dev Container.

## Branches

There are several main branches:

-   `main` contains stable version of packages.
-   `next`, if exists, contains next major version.

There are also various archive and experimental branches.

## Dependencies

Please avoid adding new dependencies.

If a feature requires new dependency, first check if dependency you want to add is actively maintained and doesn't have many dependencies.
