### What is Iconify?

Iconify is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 80+ icon sets with more than 70,000 icons.
-   Embed icons in HTML with SVG framework or components for front-end frameworks.
-   Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
-   Add icon search to your applications with Iconify Icon Finder.

For more information visit [https://iconify.design/](https://iconify.design/).

## Iconify version 1

If you are looking for Iconify version 1, check out https://github.com/iconify/iconify/tree/iconify1

This repository contains the new version, completely rewritten using modern development process.

## Iconify monorepo

This repository is a big monorepo that contains several implementations of Iconify icon framework.

There are two types of Iconify implementations:

-   Implementations that rely on icon packages.
-   Implementations that rely on Iconify API.

### Implementations: without API

These Iconify implementations require the developer to provide icon data and expect that icon data to be included in the bundle.

Examples: Iconify for React, Iconify for Vue.

They are easy to use and do not require an internet connection to work, similar to other React/Vue components.

### Implementations: with API

Iconify is designed to be easy to use. One of the main features is the Iconify API.

Iconify API provides data for over 70,000 icons! API is hosted on publicly available servers, spread out geographically to make sure visitors from all over the world have the fastest possible connection with redundancies in place to make sure it is always online.

#### Why is API needed?

When you use an icon font, each visitor loads an entire font, even if your page only uses a few icons. This is a major downside of using icon fonts. That limits developers to one or two fonts or icon sets.

Unlike icon fonts, Iconify implementations that use API do not load the entire icon set. Iconify only loads icons that are used on the current page.

This makes it possible to have an unlimited choice of icons!

Iconify API provides icon data to Iconify SVG framework and other implementations that rely on Iconify API.

## Available packages

There are several Iconify implementations included in this repository:

| Implementation                         | Usage         | with API | without API |
| -------------------------------------- | ------------- | :------: | :---------: |
| [SVG Framework](./packages/iconify/)   | HTML          |    +     |      +      |
| [React component](./packages/react/)   | React         |    +     |      +      |
| [Vue component](./packages/vue/)       | Vue           |    +     |      +      |
| [Svelte component](./packages/svelte/) | Svelte/Sapper |    +     |      +      |

Other packages:

-   [Iconify types](./packages/types/) - TypeScript types used by various implementations.
-   [Iconify core](./packages/core/) - common files used by various implementations.
-   [React demo](./packages/react-demo/) - demo for React component. Run `npm start` to start demo.
-   [Next.js demo](./packages/nextjs-demo/) - demo for React component with Next.js. Run `npm run build` to build it and `npm start` to start demo.
-   [Vue demo](./packages/vue-demo/) - demo for Vue component. Run `npm run dev` to start demo.
-   [Svelte demo](./packages/svelte-demo/) - demo for Svelte component. Run `npm run dev` to start demo.
-   [Sapper demo](./packages/sapper-demo/) - demo for Sapper, using Svelte component on the server and in the browser. Run `npm run dev` to start the demo.
-   [Browser tests](./packages/browser-tests/) - unit tests for SVG framework. Run `npm run build` to build it. Open test.html in browser (requires HTTP server).

### Legacy packages

Unfortunately Lerna does not support several versions of the same package. Because of that, some packages were moved from "packages" to "archive". This applies only to packages that were replaced by newer packages that aren't backwards compatible (and packages that rely on those packages).

Legacy packages:

-   [Vue 2 component](./archive/vue2/) - Vue 2 component. It has been replaced by [Vue 3 component](./packages/vue/).
-   [Vue 2 demo](./archive/vue2-demo/) - demo for Vue 2 component. Run `npm serve` to start demo.
-   [React with API](./archive/react-with-api/) - React component with API support. It has been merged with [`react` package](./packages/react/) in newer version.
-   [React with API demo](./archive/react-demo-with-api/) - demo for legacy `react-with-api` package. Run `npm start` to start demo.

## Installation

This monorepo uses Lerna to manage packages.

First you need to install Lerna:

```bash
npm run install
```

To install dependencies in all packages, run

```bash
npm run bootstrap
```

This will install all dependencies and create symbolic links to packages.

If links stop working for some reason, run `npm run link` to fix links.

If you want to re-install dependencies, run `npm run clean` to clear all repositories (press "Y" to continue), then `npm run bootstrap` to install everything again.

## Documentation

Documentation for all packages is available on [Iconify documentation website](https://docs.iconify.design/implementations/):

-   [SVG framework documentation](https://docs.iconify.design/implementations/svg-framework/).
-   [Components documentation](https://docs.iconify.design/implementations/components/).

## Licence

Iconify is dual-licensed under Apache 2.0 and GPL 2.0 licence. You may select, at your option, one of the above-listed licences.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

This licence does not apply to icons. Icons are released under different licences, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free licence.

© 2020 Iconify OÜ
