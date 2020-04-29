### What is Iconify?

Iconify is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 60+ icon sets with 50,000 icons.
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

Iconify API provides data for over 50,000 icons! API is hosted on publicly available servers, spread out geographically to make sure visitors from all over the world have the fastest possible connection with redundancies in place to make sure it is always online.

#### Why is API needed?

When you use an icon font, each visitor loads an entire font, even if your page only uses a few icons. This is a major downside of using icon fonts. That limits developers to one or two fonts or icon sets.

Unlike icon fonts, Iconify implementations that use API do not load the entire icon set. Iconify only loads icons that are used on the current page.

This makes it possible to have an unlimited choice of icons!

Iconify API provides icon data to Iconify SVG framework and other implementations that rely on Iconify API.

## Available packages

There are several Iconify implementations included in this repository:

| Implementation                         | Usage  | with API | without API |
| -------------------------------------- | ------ | :------: | :---------: |
| [SVG Framework](./packages/iconify/)   | HTML   |    +     |      +      |
| [React component](./packages/react/)   | React  |    -     |      +      |
| [Vue component](./packages/vue/)       | Vue    |    -     |      +      |
| [Svelte component](./packages/svelte/) | Svelte |    -     |      +      |

Other packages:

-   [Iconify types](./packages/types/) - TypeScript types used by various implementations.
-   [Iconify core](./packages/core/) - common files used by various implementations.
-   [React demo](./packages/react-demo/) - demo for React component. Run `npm start` to start demo.
-   [Vue demo](./packages/vue-demo/) - demo for Vue component. Run `npm serve` to start demo.
-   [Svelte demo](./packages/svelte-demo/) - demo for Svelte component. Run `npm run dev` to start demo.
-   [Sapper demo](./packages/sapper-demo/) - demo for Sapper, using Svelte component on server side and client side. Run `npm run dev` to start demo.
-   [Browser tests](./packages/browser-tests/) - unit tests for SVG framework. Must be ran in browser.

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

## License

Iconify is dual-licensed under Apache 2.0 and GPL 2.0 license. You may select, at your option, one of the above-listed licenses.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

This license does not apply to icons. Icons are released under different licenses, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free license.

© 2020 Vjacheslav Trushkin
