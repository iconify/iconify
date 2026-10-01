Iconify is the most versatile icon framework.

- Unified icon framework that can be used with any icon library.
- Out of the box includes 200+ icon sets with more than 250,000 icons.
- Embed icons in HTML with Iconify Icon web component or components for front-end frameworks.
- Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
- Add icon search to your applications with Iconify Icon Finder.

For more information visit [https://iconify.design/](https://iconify.design/).

## Iconify parts

There are several parts of project, some are in this repository, some are in other repositories.

What is included in this repository?

- Directory `packages` contains reusable packages: types, utilities, functions used by various components.
- Directory `iconify-icon` contains `iconify-icon` web component that renders icons. It also contains wrappers for various frameworks that cannot handle web components.
- Directory `components` contains older version of icon components that are native to various frameworks, which do not use web component.
- Directory `components-css` contains components for rendering SVG with CSS, with Iconify API fallback for Safari browser.

Other repositories you might want to look at:

- Data for all icons is available in [`iconify/icon-sets`](https://github.com/iconify/icon-sets) repository.
- Tools for parsing icons and generating icon sets are available in [`iconify/tools`](https://github.com/iconify/tools) repository.

## Iconify icon components

Main packages in this repository are various icon components.

Why are those icon components needed? Iconify icon components are not just yet another set of icon components. Unlike other icon components, Iconify icon components do not include icon data. Instead, icon data is loaded on demand from Iconify API.

Iconify API provides data for over 200,000 open source icons! API is hosted on publicly available servers, spread out geographically to make sure visitors from all over the world have the fastest possible connection with redundancies in place to make sure it is always online.

### Types of components

There are currently 2 types of components:

- Iconify icon components. These components render icon by name, loading icon data from Iconify API. They are very easy to use, but they do not work without API. You'll find them in `iconify-icon` (web component) and `components` directories.
- Iconify CSS icon components (in development). These components render SVG with CSS, which unfortunately is not supported by Safari browser, so for Safari it uses Iconify API as a fallback, loading icon data when needed and rendering it. You'll find them in `components-css` directory.

#### Why is API needed?

API is needed to load data for icons that you use.

For Iconify icon components, this means you don't need to worry about bundling all possible icons during development, component will load icons that are rendered.

For CSS icon components, this means fallback SVGs for Safari browser will be loaded only for users that use Safari browser (components check for feature support, not browser id), so you can move path data to CSS without worrying about visitors with old browsers.

You can also use API if you don't know what icons user will need, while offering thousands of icons to choose from. This is perfect for applications that can be customised by user.

## Packages in this repository

There are several types of packages, split in their own directories.

### Main packages

Directory `packages` contains main packages that are reusable by all other packages in this repository as well as third party components.

Main packages:

- [Iconify types](./packages/types/) - TypeScript types.
- [Iconify utils](./packages/utils/) - common files used by various Iconify projects (including tools, API, etc...).

Packages used by Iconify icon components:

- [API redundancy](./packages/api-redundancy/) - library for managing redundancies for loading data from API: handling timeouts, rotating hosts. It provides fallback for loading icons if main API host is unreachable (will be deprecated in future, replaced by "Fetch" package).
- [Iconify core](./packages/core/) - common files used by icon components (will be deprecated in future, replaced by "Component Utils" package).

Packages used by Iconify CSS icon components, will also be used in future by new versions of Iconify icon components:

- [Fetch](./packages/fetch/) - Fetch wrapper with built in redundancy, allowing to use multiple hosts for request. Modern replacement of outdated "API redundancy" package.
- [Component Utils](./packages/component-utils/) - common files used by icon components, modern version of "Iconify core" package.

### Web component

Directory `iconify-icon` contains `iconify-icon` web component and wrappers for various frameworks.

| Package                                  | Usage      |
| ---------------------------------------- | ---------- |
| [Web component](./iconify-icon/icon/)    | Everywhere |
| [React wrapper](./iconify-icon/react/)   | React      |
| [SolidJS wrapper](./iconify-icon/solid/) | SolidJS    |

Frameworks that are confirmed to work with web components without custom wrappers:

- Svelte.
- Lit.
- Ember.
- Vue 2 and Vue 3, but requires custom config when used in Nuxt (see below).
- React, but with small differences, such as using `class` instead of `className`. Wrapper fixes it and provides types.

#### Demo

Directory `iconify-icon-demo` contains demo packages that show usage of `iconify-icon` web component.

- [React demo](./iconify-icon-demo/react-demo/) - demo using web component with React. Run `npm run dev` to start demo.
- [Next.js demo](./iconify-icon-demo/nextjs-demo/) - demo for web component with Next.js. Run `npm run dev` to start demo.
- [Svelte demo with Vite](./iconify-icon-demo/svelte-demo/) - demo for web component with Svelte using Vite. Run `npm run dev` to start demo.
- [SvelteKit demo](./iconify-icon-demo/sveltekit-demo/) - demo for web component with SvelteKit. Run `npm run dev` to start the demo.
- [Vue 3 demo](./iconify-icon-demo/vue-demo/) - demo for web component with Vue 3. Run `npm run dev` to start demo.
- [Nuxt 3 demo](./iconify-icon-demo/nuxt3-demo/) - demo for web component with Nuxt 3. Run `npm run dev` to start demo. Requires custom config, see below.
- [SolidJS demo](./iconify-icon-demo/solid-demo/) - demo using web component with SolidJS. Run `npm run dev` to start demo.

#### Nuxt 3 usage

When using web component with Nuxt 3, you need to tell Nuxt that `iconify-icon` is a custom element. Otherwise it will show few warnings in dev mode.

Example `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag === 'iconify-icon',
		},
	},
});
```

This configuration change is not needed when using Vue with `@vitejs/plugin-vue`.

### Iconify icon components

Directory `components` contains native components for several frameworks:

| Package                                  | Usage  |
| ---------------------------------------- | ------ |
| [React component](./components/react/)   | React  |
| [Vue component](./components/vue/)       | Vue    |
| [Svelte component](./components/svelte/) | Svelte |

### Iconify CSS icon components

Directory `components-css` contains native components for several frameworks:

| Package                                      | Usage  |
| -------------------------------------------- | ------ |
| [React component](./components-css/react/)   | React  |
| [Vue component](./components-css/vue/)       | Vue    |
| [Svelte component](./components-css/svelte/) | Svelte |

Unlike Iconify icon components, these components are intended to be used for rendering SVG + CSS,
loading icon data from API only as a fallback option for Safari users.

#### Deprecation notice

Components in directory `components` are slowly phased out in favor of `iconify-icon` web component.
Components are still maintained and supported, but it is better to switch to web component.

Functionality is identical, but web component has some advantages:

- No framework specific shenanigans. Events and attributes are supported for all frameworks.
- Works better with SSR (icon is rendered only in browser, but because icon is contained in shadow DOM, it does not cause hydration problems).
- Better interoperability. All parts of applicaiton reuse same web component, even if those parts are written in different frameworks.

Packages that have been deprecated, removed from this repository and are no longer maintained:

- SVG Framework: can be replaced with `iconify-icon`.
- Vue 2 component: can be replaced with `iconify-icon`, does not require Vue specific wrapper. Make sure you are not using Webpack older than version 5.
- Ember component: can be replaced with `iconify-icon`, does not require Ember specific wrapper.

Packages that are still available, but should be avoided:

- React component: can be replaced with `iconify-icon` using `@iconify-icon/react` wrapper.
- Svelte component: can be replaced with `iconify-icon`, does not require Svelte specific wrapper.
- Vue 3 component: can be replaced with `iconify-icon`, does not require Vue specific wrapper.

To import web component, just import it once in your script, as per [`iconify-icon` README file](./iconify-icon/icon/README.md).

#### Demo

Directory `components-demo` contains demo packages that show usage of icon components.

- [React demo](./components-demo/react-demo/) - demo for React component. Run `npm run dev` to start demo.
- [Next.js demo](./components-demo/nextjs-demo/) - demo for React component with Next.js. Run `npm run dev` to start demo.
- [Vue demo](./components-demo/vue-demo/) - demo for Vue component. Run `npm run dev` to start demo.
- [Nuxt demo](./components-demo/nuxt3-demo/) - demo for Vue component with Nuxt. Run `npm run dev` to start demo.
- [Svelte demo with Vite](./components-demo/svelte-demo-vite/) - demo for Svelte component using Vite. Run `npm run dev` to start demo.
- [SvelteKit demo](./components-demo/sveltekit-demo/) - demo for SvelteKit, using Svelte component on the server and in the browser. Run `npm run dev` to start the demo.

### Plugins

Plugin for Tailwind CSS has been rewritten and moved to [a separate repository](https://github.com/iconify/iconify-tailwind).

## Installation, debugging and contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/cyberalien">
    <img src='https://cyberalien.github.io/static/sponsors.svg'/>
  </a>
</p>

## Documentation

Documentation for all packages is available on [Iconify documentation website](https://iconify.design/docs/):

- [Types documentation](https://iconify.design/docs/types/).
- [Utilities documentation](https://iconify.design/docs/libraries/utils/).
- [Icon components documentation](https://iconify.design/docs/icon-components/).
- [Tailwind CSS plugin documentation](https://iconify.design/docs/usage/css/tailwind/).

## Licence

Iconify is licensed under MIT license.

`SPDX-License-Identifier: MIT`

Some packages of this monorepo in previous versions were dual-licensed under Apache 2.0 and GPL 2.0 licence, which was messy and confusing. This was later changed to MIT for simplicity.

This licence does not apply to icons. Icons are released under different licences, see each icon set for details.
Icons available by default are all licensed under various open-source licences.

© 2020-PRESENT Vjacheslav Trushkin


## 🌐 Web Resources & Aesthetic Symbols Index
- [CYBER CLAN TAGS 85.PAGES.DEV](https://cyber-clan-tags-85.pages.dev/)
- [ANGEL WINGS HEART](https://vintage-lace-kaomoji-97.pages.dev/symbol/angel-wings-heart/)
- [SLEEK LINE UNICODE 29.PAGES.DEV](https://sleek-line-unicode-29.pages.dev/)
- [CROSSED SWORDS](https://tech-glitch-symbols-36.pages.dev/symbol/crossed-swords/)
- [GLITCH MATRIX FONTS 28.PAGES.DEV](https://glitch-matrix-fonts-28.pages.dev/)
- [MECHA CROSSHAIR SYMBOLS 40.PAGES.DEV](https://mecha-crosshair-symbols-40.pages.dev/)
- [COQUETTE BOW RIBBON](https://anime-sparkle-text-45.pages.dev/symbol/coquette-bow-ribbon/)
- [COQUETTE BOW RIBBON](https://anime-sparkle-text-81.pages.dev/symbol/coquette-bow-ribbon/)
- [PASTEL MANGA SYMBOLS 57.PAGES.DEV](https://pastel-manga-symbols-57.pages.dev/)
- [ANGEL WINGS HEART](https://gothic-bio-fonts-69.pages.dev/symbol/angel-wings-heart/)
- [BLACK STAR](https://mecha-gamer-fonts-53.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://vintage-angel-text-38.pages.dev/symbol/crossed-swords/)
- [MECHA HACKER KAOMOJI 26.PAGES.DEV](https://mecha-hacker-kaomoji-26.pages.dev/)
- [ZEN UNICODE SYMBOLS 89.PAGES.DEV](https://zen-unicode-symbols-89.pages.dev/)
- [ANGEL WINGS HEART](https://ethereal-goth-symbols-29.pages.dev/symbol/angel-wings-heart/)
- [ANGEL WINGS HEART](https://cute-chibi-emoticons-70.pages.dev/symbol/angel-wings-heart/)
- [ANGEL WINGS HEART](https://baroque-symbol-vault-99.pages.dev/symbol/angel-wings-heart/)
- [COQUETTE BOW RIBBON](https://matrix-hacker-fonts-85.pages.dev/symbol/coquette-bow-ribbon/)
- [COQUETTE BOW RIBBON](https://vintage-academic-symbols-10.pages.dev/symbol/coquette-bow-ribbon/)
- [CROSSED SWORDS](https://pastel-chibi-kaomoji-14.pages.dev/symbol/crossed-swords/)
- [CROSSED SWORDS](https://dark-poetry-symbols-18.pages.dev/symbol/crossed-swords/)
- [BLACK STAR](https://soft-pastel-bio-39.pages.dev/symbol/black-star/)
- [CYBERPUNK CLAN TAGS 49.PAGES.DEV](https://cyberpunk-clan-tags-49.pages.dev/)
- [CROSSED SWORDS](https://glitch-text-generator-65.pages.dev/symbol/crossed-swords/)
- [BLACK STAR](https://coquette-heart-text-40.pages.dev/symbol/black-star/)
- [BLACK STAR](https://vintage-lace-fonts-63.pages.dev/symbol/black-star/)
- [BLACK STAR](https://sleek-arrow-symbols-42.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://minimal-star-symbols-40.pages.dev/symbol/crossed-swords/)
- [MANGA SPEECH SYMBOLS 65.PAGES.DEV](https://manga-speech-symbols-65.pages.dev/)
- [ANGELIC SOFT TEXT 23.PAGES.DEV](https://angelic-soft-text-23.pages.dev/)
- [BLACK STAR](https://kawaii-kaomoji-hub-17.pages.dev/symbol/black-star/)
- [SOFT ANGEL SYMBOLS 61.PAGES.DEV](https://soft-angel-symbols-61.pages.dev/)
- [COQUETTE BOW RIBBON](https://neon-hacker-fonts-72.pages.dev/symbol/coquette-bow-ribbon/)
- [CROSSED SWORDS](https://clean-unicode-text-68.pages.dev/symbol/crossed-swords/)
- [CROSSED SWORDS](https://zen-arrow-text-26.pages.dev/symbol/crossed-swords/)
- [COQUETTE BOW RIBBON](https://cyber-clan-tags-65.pages.dev/symbol/coquette-bow-ribbon/)
- [BLACK STAR](https://mystic-rune-text-88.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://kawaii-kaomoji-hub-51.pages.dev/symbol/crossed-swords/)
- [CROSSED SWORDS](https://vintage-scholar-text-78.pages.dev/symbol/crossed-swords/)
- [COQUETTE BOW RIBBON](https://minimal-star-symbols-28.pages.dev/symbol/coquette-bow-ribbon/)
- [ZEN DOT CHARACTERS 20.PAGES.DEV](https://zen-dot-characters-20.pages.dev/)
- [SOFT PASTEL BIO 39.PAGES.DEV](https://soft-pastel-bio-39.pages.dev/)
- [CROSSED SWORDS](https://soft-angel-symbols-33.pages.dev/symbol/crossed-swords/)
- [BLACK STAR](https://vintage-script-symbols-65.pages.dev/symbol/black-star/)
- [ANGEL WINGS HEART](https://gothic-bio-fonts-14.pages.dev/symbol/angel-wings-heart/)
- [BLACK STAR](https://vintage-bow-text-15.pages.dev/symbol/black-star/)
- [BLACK STAR](https://vintage-academic-symbols-10.pages.dev/symbol/black-star/)
- [BLACK STAR](https://zen-aesthetic-fonts-87.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://theeduplaycampen.pages.dev/symbol/crossed-swords/)
- [BLACK STAR](https://matrix-glitch-symbols-43.pages.dev/symbol/black-star/)
- [CYBER CLAN TAGS 68.PAGES.DEV](https://cyber-clan-tags-68.pages.dev/)
- [BLACK STAR](https://baroque-fancy-letters-84.pages.dev/symbol/black-star/)
- [BLACK STAR](https://neon-hacker-text-25.pages.dev/symbol/black-star/)
- [PASTEL MOE EMOTICONS 55.PAGES.DEV](https://pastel-moe-emoticons-55.pages.dev/)
- [COQUETTE BOW RIBBON](https://kawaii-kaomoji-hub-95.pages.dev/symbol/coquette-bow-ribbon/)
- [BLACK STAR](https://kawaii-kaomoji-hub-80.pages.dev/symbol/black-star/)
- [BLACK STAR](https://mech-gaming-fonts-34.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://vintage-manuscript-symbols-37.pages.dev/symbol/crossed-swords/)
- [ANGEL WINGS HEART](https://zen-dot-symbols-91.pages.dev/symbol/angel-wings-heart/)
- [ANGEL WINGS HEART](https://mecha-terminal-text-63.pages.dev/symbol/angel-wings-heart/)
- [COQUETTE HEART TEXT 40.PAGES.DEV](https://coquette-heart-text-40.pages.dev/)
- [CROSSED SWORDS](https://zen-dot-characters-20.pages.dev/symbol/crossed-swords/)
- [BLACK STAR](https://gothic-bio-fonts-39.pages.dev/symbol/black-star/)
- [ANGEL WINGS HEART](https://chibi-heart-fonts-41.pages.dev/symbol/angel-wings-heart/)
- [COQUETTE BOW RIBBON](https://sleek-line-unicode-29.pages.dev/symbol/coquette-bow-ribbon/)
- [BLACK STAR](https://clean-aesthetic-fonts-74.pages.dev/symbol/black-star/)
- [ANGEL WINGS HEART](https://gothic-bio-fonts-81.pages.dev/symbol/angel-wings-heart/)
- [VINTAGE LACE FONTS 79.PAGES.DEV](https://vintage-lace-fonts-79.pages.dev/)
- [CROSSED SWORDS](https://minimal-star-symbols-37.pages.dev/symbol/crossed-swords/)
- [ANGEL WINGS HEART](https://minimal-star-symbols-40.pages.dev/symbol/angel-wings-heart/)
- [BLACK STAR](https://coquette-aesthetic-symbols-65.pages.dev/symbol/black-star/)
- [COQUETTE BOW RIBBON](https://dolly-angel-fonts-14.pages.dev/symbol/coquette-bow-ribbon/)
- [ANGEL WINGS HEART](https://cyber-clan-tags-69.pages.dev/symbol/angel-wings-heart/)
- [CROSSED SWORDS](https://cyber-clan-tags-75.pages.dev/symbol/crossed-swords/)
- [COQUETTE AESTHETIC SYMBOLS 29.PAGES.DEV](https://coquette-aesthetic-symbols-29.pages.dev/)
- [BLACK STAR](https://angelic-bio-symbols-59.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://vintage-bow-symbols-47.pages.dev/symbol/crossed-swords/)
- [BALLETCORE CUTE FONTS 43.PAGES.DEV](https://balletcore-cute-fonts-43.pages.dev/)
- [ANGEL WINGS HEART](https://minimal-star-symbols-31.pages.dev/symbol/angel-wings-heart/)
- [ANGEL WINGS HEART](https://neon-matrix-symbols-87.pages.dev/symbol/angel-wings-heart/)
- [SCHOLAR TEXT REALM 40.PAGES.DEV](https://scholar-text-realm-40.pages.dev/)
- [CYBER CLAN TAGS 90.PAGES.DEV](https://cyber-clan-tags-90.pages.dev/)
- [CROSSED SWORDS](https://aesthetic-bullet-points-76.pages.dev/symbol/crossed-swords/)
- [SOFT ANGEL SYMBOLS 21.PAGES.DEV](https://soft-angel-symbols-21.pages.dev/)
- [COQUETTE BOW RIBBON](https://vintage-coquette-text-58.pages.dev/symbol/coquette-bow-ribbon/)
- [ANGEL WINGS HEART](https://minimal-star-symbols-28.pages.dev/symbol/angel-wings-heart/)
- [ANGEL WINGS HEART](https://pastel-princess-fonts-68.pages.dev/symbol/angel-wings-heart/)
- [CROSSED SWORDS](https://angel-core-bios-50.pages.dev/symbol/crossed-swords/)
- [NEON FUTURISTIC SYMBOLS 20.PAGES.DEV](https://neon-futuristic-symbols-20.pages.dev/)
- [BLACK STAR](https://mecha-terminal-text-63.pages.dev/symbol/black-star/)
- [COQUETTE BOW RIBBON](https://simple-line-symbols-28.pages.dev/symbol/coquette-bow-ribbon/)
- [COQUETTE AESTHETIC SYMBOLS 62.PAGES.DEV](https://coquette-aesthetic-symbols-62.pages.dev/)
- [GOTHIC BIO FONTS 50.PAGES.DEV](https://gothic-bio-fonts-50.pages.dev/)
- [CROSSED SWORDS](https://anime-sparkle-text-91.pages.dev/symbol/crossed-swords/)
- [COQUETTE BOW RIBBON](https://kawaii-kaomoji-hub-15.pages.dev/symbol/coquette-bow-ribbon/)
- [SCHOLARLY UNICODE VAULT 92.PAGES.DEV](https://scholarly-unicode-vault-92.pages.dev/)
- [CROSSED SWORDS](https://baroque-font-vault-96.pages.dev/symbol/crossed-swords/)
- [RIBBON HEART SYMBOLS 17.PAGES.DEV](https://ribbon-heart-symbols-17.pages.dev/)
- [CROSSED SWORDS](https://gothic-bio-fonts-39.pages.dev/symbol/crossed-swords/)
- [CROSSED SWORDS](https://cyber-clan-tags-63.pages.dev/symbol/crossed-swords/)
- [ANGEL WINGS HEART](https://sparkly-chibi-symbols-47.pages.dev/symbol/angel-wings-heart/)
- [GOTHIC BIO FONTS 14.PAGES.DEV](https://gothic-bio-fonts-14.pages.dev/)
- [COQUETTE BOW RIBBON](https://coquette-aesthetic-symbols-84.pages.dev/symbol/coquette-bow-ribbon/)
- [COQUETTE BOW RIBBON](https://clean-unicode-text-68.pages.dev/symbol/coquette-bow-ribbon/)
- [ANGEL WINGS HEART](https://cyber-clan-tags-90.pages.dev/symbol/angel-wings-heart/)
- [ANGEL WINGS HEART](https://gothic-bio-fonts-70.pages.dev/symbol/angel-wings-heart/)
- [BLACK STAR](https://soft-angel-symbols-21.pages.dev/symbol/black-star/)
- [COQUETTE BOW RIBBON](https://clean-aesthetic-fonts-74.pages.dev/symbol/coquette-bow-ribbon/)
- [BLACK STAR](https://neon-tech-unicode-43.pages.dev/symbol/black-star/)
- [COQUETTE BOW RIBBON](https://balletcore-bio-symbols-63.pages.dev/symbol/coquette-bow-ribbon/)
- [ANGEL WINGS HEART](https://coquette-heart-text-40.pages.dev/symbol/angel-wings-heart/)
- [BLACK STAR](https://balletcore-bio-symbols-63.pages.dev/symbol/black-star/)
- [ANGEL WINGS HEART](https://synthwave-fancy-text-33.pages.dev/symbol/angel-wings-heart/)
- [CROSSED SWORDS](https://mystic-rune-text-88.pages.dev/symbol/crossed-swords/)
- [BLACK STAR](https://anime-sparkle-text-81.pages.dev/symbol/black-star/)
- [COQUETTE BOW RIBBON](https://glitch-text-generator-65.pages.dev/symbol/coquette-bow-ribbon/)
- [ANGEL WINGS HEART](https://minimal-star-symbols-37.pages.dev/symbol/angel-wings-heart/)
- [COQUETTE BOW RIBBON](https://sleek-mono-symbols-75.pages.dev/symbol/coquette-bow-ribbon/)
- [CROSSED SWORDS](https://kawaii-kaomoji-hub-95.pages.dev/symbol/crossed-swords/)
- [ANGEL WINGS HEART](https://pastel-manga-symbols-57.pages.dev/symbol/angel-wings-heart/)
- [SCHOLARLY RUNES TEXT 68.PAGES.DEV](https://scholarly-runes-text-68.pages.dev/)
- [SYNTHWAVE GLITCH TEXT 94.PAGES.DEV](https://synthwave-glitch-text-94.pages.dev/)
- [CYBER CLAN TAGS 63.PAGES.DEV](https://cyber-clan-tags-63.pages.dev/)
- [ANGEL WINGS HEART](https://soft-angel-symbols-33.pages.dev/symbol/angel-wings-heart/)
- [GOTHIC BIO FONTS 39.PAGES.DEV](https://gothic-bio-fonts-39.pages.dev/)
- [COQUETTE BOW RIBBON](https://vintage-script-symbols-65.pages.dev/symbol/coquette-bow-ribbon/)
- [COQUETTE BOW RIBBON](https://baroque-font-vault-96.pages.dev/symbol/coquette-bow-ribbon/)
- [BLACK STAR](https://mecha-hacker-kaomoji-26.pages.dev/symbol/black-star/)
- [CROSSED SWORDS](https://vintage-scholar-text-15.pages.dev/symbol/crossed-swords/)
- [COQUETTE BOW RIBBON](https://occult-aesthetic-symbols-26.pages.dev/symbol/coquette-bow-ribbon/)
