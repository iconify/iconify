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

There are several types of packages, split in their own directories.

### Main packages

Directory `packages` contains main packages that are reusable by all other packages in this repository as well as third party components.

Main packages:

-   [Iconify types](./packages/types/) - TypeScript types.
-   [Iconify utils](./packages/utils/) - common files used by various Iconify projects (including tools, API, etc...).
-   [Iconify core](./packages/core/) - common files used by various icon components.
-   [API redundancy](./packages/api-redundancy/) - library for managing redundancies for loading data from API: handling timeouts, rotating hosts.

### Web component

Directory `iconify-icon` contains `iconify-icon` web component and wrappers for various frameworks.

| Package                                | Usage      |
| -------------------------------------- | ---------- |
| [Web component](./iconify-icon/icon/)  | Everywhere |
| [React wrapper](./iconify-icon/react/) | React      |

#### Demo

Directory `iconify-icon-demo` contains demo packages that show usage of `iconify-icon` web component.

-   [Ember demo](./iconify-icon-demo/ember-icon-demo/) - demo using web component with Ember. Run `npm run build` to build demo and `npm run start` to start it.
-   [React demo](./iconify-icon-demo/react-demo/) - demo using web component with React. Run `npm run dev` to start demo.

### Iconify icon components

Directory `components` contains Iconify icon components and SVG framework.

| Package                                  | Usage  |
| ---------------------------------------- | ------ |
| [SVG Framework](./components/iconify/)   | HTML   |
| [React component](./components/react/)   | React  |
| [Vue 3 component](./components/vue/)     | Vue 3  |
| [Vue 2 component](./components/vue2/)    | Vue 2  |
| [Svelte component](./components/svelte/) | Svelte |
| [Ember component](./components/ember/)   | Ember  |

#### Deprecation notice

Components in directory `components` are slowly phased out in favor of `iconify-icon` web component. Components are still maintained and supported, but it is better to switch to web component.

Functionality is identical, but web component has some advantages:

-   No framework specific shenanigans. Events and attributes are supported for all frameworks.
-   Works better with SSR (icon is rendered only in browser, but because icon is contained in shadow DOM, it does not cause hydration problems).
-   Better interoperability. All parts of applicaiton reuse same web component, even if those parts are written in different frameworks.

Deprecation status:

-   SVG Framework: can be replaced with `iconify-icon`.
-   React component: can be replaced with `iconify-icon` using `@iconify-icon/react` wrapper.
-   Ember component: can be replaced with `iconify-icon`, does not require Ember specific wrapper.

To import web component, just import it once in your script, as per [`iconify-icon` README file](./iconify-icon/icon/README.md).

#### Demo

Directory `components-demo` contains demo packages that show usage of icon components.

-   [React demo](./components-demo/react-demo/) - demo for React component. Run `npm run dev` to start demo.
-   [Next.js demo](./components-demo/nextjs-demo/) - demo for React component with Next.js. Run `npm run dev` to start demo.
-   [Vue 3 demo](./components-demo/vue-demo/) - demo for Vue 3 component. Run `npm run dev` to start demo.
-   [Nuxt 3 demo](./components-demo/nuxt3-demo/) - demo for Vue 3 component with Nuxt. Run `npm run dev` to start demo.
-   [Vue 2 demo](./components-demo/vue2-demo/) - demo for Vue 2 component. Run `npm run build` to build demo and `npm run serve` to start it.
-   [Svelte demo](./components-demo/svelte-demo/) - demo for Svelte component. Run `npm run dev` to start demo.
-   [Svelte demo with Vite](./components-demo/svelte-demo-vite/) - demo for Svelte component using Vite. Run `npm run dev` to start demo.
-   [Sapper demo](./components-demo/sapper-demo/) - demo for Sapper, using Svelte component on the server and in the browser. Run `npm run dev` to start the demo (deprecated, use SvelteKit instead of Sapper).
-   [SvelteKit demo](./components-demo/sveltekit-demo/) - demo for SvelteKit, using Svelte component on the server and in the browser. Run `npm run dev` to start the demo.
-   [Ember demo](./components-demo/ember-demo/) - demo for Ember component. Run `npm run build` to build demo and `npm run start` to start it.

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
-   Treat each package as a separate package, without links to other packages. All packages do have correct dependencies, so you will be able to use most packages, but you will not be able to work on multiple packages at the same time.

## Documentation

Documentation for all packages is available on [Iconify documentation website](https://docs.iconify.design/icon-components/):

-   [SVG framework documentation](https://docs.iconify.design/icon-components/svg-framework/index.html).
-   [Components documentation](https://docs.iconify.design/icon-components/components/index.html).

## Licence

Iconify is licensed under MIT license.

`SPDX-License-Identifier: MIT`

Some packages of this monorepo in previous versions were dual-licensed under Apache 2.0 and GPL 2.0 licence, which was messy and confusing. This was later changed to MIT for simplicity.

This licence does not apply to icons. Icons are released under different licences, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free licence.

© 2020 - 2022 Vjacheslav Trushkin / Iconify OÜ
