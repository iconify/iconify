# Fix links

Unfortunately, Lerna is not being actively developed and it has a lot of issues.

One of those issues is inability to create links for local dependencies that depend on other local dependencies.

This is a basic script does the same as Lerna, but with few differences:

-   It links everything, so dependencies of dependencies are correctly linked (broken in Lerna). For simplicity, it links everything.
-   It does not check versions. This means if you have multiple versions of the same package in monorepo, this script is not for you.

## Requirements

Script requires:

-   NPM (not tested with other package managers)
-   Unix file system (TODO: test on Windows)

## Links

Script creates symbolic links for all local packages, except:

-   Packages with `private` set to `true`.
-   Packages without version number (assumed to be private).

## Commands

-   `bootstrap`: runs `npm install` for all packages, then creates symbolic links.
-   `link`: creates symbolic links (can be used to fix links after messing with packages).
-   `unlink`: removes local symbolic links.
-   `clean`: removes `node_modules` in all packages.

## Config file

This script usese `lerna.json`, where the only property that matters is `packages`.
