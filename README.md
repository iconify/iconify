### What is Iconify?

Iconify is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 100+ icon sets with more than 100,000 icons.
-   Embed icons in HTML with SVG framework or components for front-end frameworks.
-   Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
-   Add icon search to your applications with Iconify Icon Finder.

For more information visit [https://iconify.design/](https://iconify.design/).

## Iconify version 1

If you are looking for Iconify version 1, check out https://github.com/iconify/iconify/tree/iconify1

This repository contains the new version, completely rewritten using modern development process.

## Iconify monorepo

This repository is a big monorepo that contains several icon components for various frameworks and several packages that are reused by all those components.

## Iconify icon components

Iconify icon components are not just yet another set of icon components. Unlike other icon components, Iconify icon components do not include icon data. They load icon data on demand from Iconify API.

Iconify API provides data for over 100,000 icons! API is hosted on publicly available servers, spread out geographically to make sure visitors from all over the world have the fastest possible connection with redundancies in place to make sure it is always online.

#### Why is API needed?

When you use an icon font, each visitor loads an entire font, even if your page only uses a few icons. This is a major downside of using icon fonts. That limits developers to one or two fonts or icon sets.

If you are using typical icon set that is not a font, you still need to bundle all icons used in your application, even ones that visitor does not need.

Unlike icon fonts and components for various icon sets, Iconify icon components dynamically load icon data from Iconify API whenever it is needed.

This makes it possible to have an unlimited choice of icons!

## Available packages

There are several Iconify components included in this repository:

| Implementation                         | Usage                     |
| -------------------------------------- | ------------------------- |
| [SVG Framework](./packages/iconify/)   | HTML                      |
| [React component](./packages/react/)   | React, Next.js            |
| [Vue 3 component](./packages/vue/)     | Vue 3                     |
| [Vue 2 component](./packages/vue2/)    | Vue 2                     |
| [Svelte component](./packages/svelte/) | Svelte, SvelteKit, Sapper |
| [Ember component](./packages/ember/)   | Ember                     |

Other packages:

-   [Iconify types](./packages/types/) - TypeScript types.
-   [Iconify utils](./packages/utils/) - common files used by various Iconify projects (including tools, API, etc...).
-   [Iconify core](./packages/core/) - common files used by various components.
-   [API redundancy](./packages/api-redundancy/) - library for managing redundancies for loading data from API: handling timeouts, rotating hosts.
-   [Library builder](./packages/library-builder/) - build scripts for packages that do not require bundling, similar to `tsup`, but without bundler. Used by Utils, Core and API Redundancy packages. Builds ES and CommonJS modules, type definition files and updates exports in `package.json`.
-   [React demo](./demo/react-demo/) - demo for React component. Run `npm start` to start demo.
-   [Next.js demo](./demo/nextjs-demo/) - demo for React component with Next.js. Run `npm run build` to build it and `npm start` to start demo.
-   [Vue 3 demo](./demo/vue-demo/) - demo for Vue component. Run `npm run dev` to start demo.
-   [Vue 2 demo](./demo/vue2-demo/) - demo for Vue component. Run `npm run dev` to start demo.
-   [Svelte demo](./demo/svelte-demo/) - demo for Svelte component. Run `npm run dev` to start demo.
-   [Svelte demo with Vite](./demo/svelte-demo-vite/) - demo for Svelte component using Vite. Run `npm run dev` to start demo.
-   [Sapper demo](./demo/sapper-demo/) - demo for Sapper, using Svelte component on the server and in the browser. Run `npm run dev` to start the demo (deprecated, use SvelteKit instead of Sapper).
-   [SvelteKit demo](./demo/sveltekit-demo/) - demo for SvelteKit, using Svelte component on the server and in the browser. Run `npm run dev` to start the demo.
-   [Ember demo](./demo/ember-demo/) - demo for Ember component. Run `npm run start` to start demo.
-   [Browser tests](./demo/browser-tests/) - unit tests for SVG framework. Run `npm run build` to build it. Open test.html in browser (requires HTTP server).

## Installation

This monorepo used Lerna to manage packages, but due to several bugs in Lerna and Lerna development being abandoned, it was replaced with custom manager.

To install dependencies in all packages, run

```bash
npm install
```

This will install all dependencies and create symbolic links to packages.

If links stop working for some reason, run `npm run link` to fix links.

If you want to remove `node_modules` for all packages, run `npm run clean`.

If you want to re-install dependencies, run `npm run reinstall`.

To build everything, run `npm run build` (this excludes demo packages).

To run tests, run `npm run test` (this excludes demo packages).

### Other commands

You can run any commands on any package from that package's directory.

Commands that modify `node_modules` might break symlinks. To fix it, run `npm run link` from monorepo directory.

### Commands for all packages

If you want to run a command on all packages, run `node monorepo run your_command --if-present`.

There are several options to filter packages, see [monorepo/README.md](monorepo/README.md).

### Monorepo on Windows

This monorepo uses symbolic links to create links between packages. This allows development of multiple packages at the same time.

When using Windows, symbolic links require setting up extra permissions. If you are using Windows and cannot set permissions for symbolic links, there are several options:

-   Use Windows Subsystem for Linux (WSL).
-   Treat each package as a separate package, without links to other packages. All packages do have correct dependencies, so you will be able to use most packages (except for `browser-tests` that requires links to access directory `lib` from `iconify` package), but you will not be able to work on multiple packages at the same time.

## Documentation

Documentation for all packages is available on [Iconify documentation website](https://docs.iconify.design/icon-components/):

-   [SVG framework documentation](https://docs.iconify.design/icon-components/svg-framework/index.html).
-   [Components documentation](https://docs.iconify.design/icon-components/components/index.html).

## Licence

Iconify is dual-licensed under Apache 2.0 and GPL 2.0 licence. You may select, at your option, one of the above-listed licences.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

This licence does not apply to icons. Icons are released under different licences, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free licence.

© 2020, 2021 Iconify OÜ
