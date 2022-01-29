# Monorepo

This package was created to manage Iconify monorepo.

Iconify monorepo used to be managed by Lerna. Unfortunately, Lerna has been abandoned and has a lot of issues. One of those issues is inability to create symblic links for local packages that depend on other local packages, which makes it unusable for monorepos like Iconify.

## What does it do?

This is a simple script to manage multiple packages, placed in the same monorepo.

### Symbolic links

Main feature is symbolic links. It creates links between all local packages, so when you can work on multiple packages at the same time.

Unlike Lerna, currently this sctipt is very basic: it does not check dependencies, does not check versions, does not mess with `package.json`.

## Requirements

Script requires NPM. It was not designed to work with other package managers yet.

## Config file

This script uses `lerna.json`, where the only property that matters is `packages`.

Order of packages in `packages` property affects execution order, so if execution order (such as build order) matters, list most important packages first. Basic wildcards are supported, such as `packages/*`.

## Symbolic links

Script creates symbolic links for all local packages, except:

-   Packages with `private` set to `true`.
-   Packages without version number (assumed to be private).

## Commands

-   `install`: runs `npm install` for all packages, then creates symbolic links.
-   `link`: creates symbolic links (can be used to fix links after messing with packages).
-   `unlink`: removes local symbolic links.
-   `clean`: removes `node_modules` in all packages.
-   `run <command>`: runs command specified in next parameter (also `run-script <command>`).

## Options

Options for all commands:

-   `--if-present` will check if command is present before running it, used for `run` command.
-   `--public` will execute command for public packages.
-   `--private` will execute command only for private packages.
-   `--silent` will execute command silently.
-   `--workspace <workspace>` or `-w=<workspace>` filters by workspace directory, such as `-w=packages/core`. You can use this option several times to specify multiple workspaces.
-   `--package <package>` or `-p=<package>` filter by package name, such as `-p=@iconify/core`. You can use this option several times to specify multiple packages.

You can add custom parameters for `run` or `run-script` commands by listing them after `--` argument: `run <command> -- <param1> <param2>`. Everything after `--` argument is treated as parameters for `run` command, so you need to specify other options before it.
