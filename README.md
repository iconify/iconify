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
- [SYM 1F62F](https://zen-arrow-symbols-99.pages.dev/symbol/sym-1f62f/)
- [SYM 1D457](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-1d457/)
- [SYM 1D417](https://dolly-kaomoji-text-94.pages.dev/symbol/sym-1d417/)
- [LEFT MATHEMATICAL WHITE SQUARE BRACKET](https://ribbon-heart-fonts-86.pages.dev/symbol/left-mathematical-white-square-bracket/)
- [SYM 2642](https://pastel-chibi-emotes-23.pages.dev/symbol/sym-2642/)
- [SYM 1D406](https://cyber-clan-tags-23.pages.dev/symbol/sym-1d406/)
- [SYM 2741](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-2741/)
- [SYM 2642](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-2642/)
- [SYM 2764 FE0F 200D 1F525](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-2764-fe0f-200d-1f525/)
- [SPRING TULIP BLOSSOM](https://ribbon-heart-fonts-86.pages.dev/symbol/spring-tulip-blossom/)
- [SYM 1D461](https://kawaii-kaomoji-hub-77.pages.dev/symbol/sym-1d461/)
- [DOLLY KAOMOJI TEXT 94.PAGES.DEV](https://dolly-kaomoji-text-94.pages.dev/)
- [SYM 1F925](https://vintage-scholar-text-15.pages.dev/symbol/sym-1f925/)
- [SYM 1D48E](https://anime-sparkle-text-22.pages.dev/symbol/sym-1d48e/)
- [SYM 1F634](https://gothic-bio-fonts-14.pages.dev/symbol/sym-1f634/)
- [SYM 1D45D](https://pastel-manga-symbols-57.pages.dev/symbol/sym-1d45d/)
- [SYM 1D439](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-1d439/)
- [SYM 1D44A](https://pastel-chibi-emotes-23.pages.dev/symbol/sym-1d44a/)
- [SYM 1F63B](https://kawaii-kaomoji-hub-80.pages.dev/symbol/sym-1f63b/)
- [SYM 1F49D](https://anime-sparkle-text-23.pages.dev/symbol/sym-1f49d/)
- [SYM 1D41C](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-1d41c/)
- [ROBLOX NAMES](https://cyber-clan-tags-75.pages.dev/pt/roblox-names/)
- [HEARTS](https://raven-gothic-kaomoji-25.pages.dev/ja/hearts/)
- [SYM 1D465](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d465/)
- [SYM 26CF](https://vintage-coquette-text-58.pages.dev/symbol/sym-26cf/)
- [SYM 26FD](https://raven-gothic-kaomoji-25.pages.dev/symbol/sym-26fd/)
- [SYM 1F63C](https://pastel-chibi-emotes-23.pages.dev/symbol/sym-1f63c/)
- [SYM 1D45F](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-1d45f/)
- [SYM 1F9D0](https://coquette-aesthetic-symbols-86.pages.dev/symbol/sym-1f9d0/)
- [SYM 1D40A](https://cyber-clan-tags-23.pages.dev/symbol/sym-1d40a/)
- [BOLD TIPPED ARROW](https://vintage-angel-symbols-66.pages.dev/symbol/bold-tipped-arrow/)
- [SYM 1F64A](https://dark-literary-kaomoji-13.pages.dev/symbol/sym-1f64a/)
- [TELUGU RIBBON BOWLET](https://clean-aesthetic-fonts-33.pages.dev/symbol/telugu-ribbon-bowlet/)
- [SYM 2672](https://cyber-clan-tags-75.pages.dev/symbol/sym-2672/)
- [SYM 26B9](https://dark-literary-kaomoji-13.pages.dev/symbol/sym-26b9/)
- [SAGITTARIUS ZODIAC ARCHER](https://vintage-angel-symbols-66.pages.dev/symbol/sagittarius-zodiac-archer/)
- [BORDERS DIVIDERS](https://cyber-clan-tags-75.pages.dev/vi/borders-dividers/)
- [SYM 26F6](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-26f6/)
- [KAOMOJI](https://lace-heart-kaomoji-64.pages.dev/kaomoji/)
- [DISCORD STATUS](https://coquette-aesthetic-symbols-86.pages.dev/discord-status/)
- [TAURUS ZODIAC BULL](https://cyberpunk-clan-tags-43.pages.dev/symbol/taurus-zodiac-bull/)
- [SYM 1D434](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d434/)
- [SYM 1D473](https://sleek-bio-symbols-40.pages.dev/symbol/sym-1d473/)
- [INSTAGRAM BIO](https://neon-futuristic-symbols-58.pages.dev/instagram-bio/)
- [SYM 26F0](https://pearl-girly-fonts-86.pages.dev/symbol/sym-26f0/)
- [SYM 1F62F](https://anime-sparkle-text-73.pages.dev/symbol/sym-1f62f/)
- [SYM 2621](https://angelic-bio-symbols-59.pages.dev/symbol/sym-2621/)
- [SYM 1D42D](https://scholarly-cross-symbols-35.pages.dev/symbol/sym-1d42d/)
- [SYM 26E3](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-26e3/)
- [SYM 1D424](https://kawaii-kaomoji-hub-93.pages.dev/symbol/sym-1d424/)
- [SYM 1D443](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d443/)
- [STAR OPERATOR](https://coquette-aesthetic-symbols-84.pages.dev/symbol/star-operator/)
- [STARS](https://cyber-clan-tags-75.pages.dev/ru/stars/)
- [WHITE STAR](https://lace-heart-kaomoji-64.pages.dev/symbol/white-star/)
- [DISCORD STATUS](https://minimal-star-symbols-87.pages.dev/es/discord-status/)
- [SYM 1D455](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-1d455/)
- [FLUTTERING BUTTERFLY](https://dolly-kaomoji-text-94.pages.dev/symbol/fluttering-butterfly/)
- [DISCORD STATUS](https://cyberpunk-clan-tags-43.pages.dev/ja/discord-status/)
- [SYM 2745](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-2745/)
- [SYM 1D494](https://coquette-aesthetic-symbols-84.pages.dev/symbol/sym-1d494/)
- [SYM 1D491](https://pastel-chibi-emotes-23.pages.dev/symbol/sym-1d491/)
- [HEARTS](https://cyber-clan-tags-75.pages.dev/ru/hearts/)
- [SYM 260B](https://coquette-aesthetic-symbols-86.pages.dev/symbol/sym-260b/)
- [SYM 1D41A](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d41a/)
- [SYM 1D48D](https://pastel-manga-symbols-57.pages.dev/symbol/sym-1d48d/)
- [SYM 1D457](https://angelic-bio-symbols-59.pages.dev/symbol/sym-1d457/)
- [NATURE FLOWERS](https://cyberpunk-clan-tags-43.pages.dev/vi/nature-flowers/)
- [SYM 2633](https://pearl-girly-fonts-86.pages.dev/symbol/sym-2633/)
- [SYM 1D406](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d406/)
- [GAMING WEAPONS](https://coquette-aesthetic-symbols-52.pages.dev/vi/gaming-weapons/)
- [SYM 2671](https://pearl-girly-fonts-86.pages.dev/symbol/sym-2671/)
- [TIKTOK CAPTIONS](https://vintage-coquette-text-58.pages.dev/pt/tiktok-captions/)
- [SYM 1F927](https://anime-sparkle-text-23.pages.dev/symbol/sym-1f927/)
- [SYM 1F917](https://anime-sparkle-text-73.pages.dev/symbol/sym-1f917/)
- [SYM 1D47B](https://cyberpunk-clan-tags-43.pages.dev/symbol/sym-1d47b/)
- [SYM 1D445](https://pastel-moe-emoticons-80.pages.dev/symbol/sym-1d445/)
- [SYM 1F642](https://anime-sparkle-text-23.pages.dev/symbol/sym-1f642/)
- [SYM 1D476](https://anime-sparkle-text-22.pages.dev/symbol/sym-1d476/)
- [STARS](https://raven-gothic-kaomoji-25.pages.dev/pt/stars/)
- [SYM 1D41B](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-1d41b/)
- [BRACKETS](https://anime-sparkle-text-73.pages.dev/ru/brackets/)
- [SYM 1F9D0](https://anime-sparkle-text-73.pages.dev/symbol/sym-1f9d0/)
- [SYM 26F5](https://theeduplaycampen.pages.dev/symbol/sym-26f5/)
- [SYM 1D482](https://anime-sparkle-text-22.pages.dev/symbol/sym-1d482/)
- [FLORAL BRANCH BOUQUET](https://cyberpunk-clan-tags-43.pages.dev/symbol/floral-branch-bouquet/)
- [SYM 1D43C](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d43c/)
- [SYM 1D485](https://sleek-bio-symbols-40.pages.dev/symbol/sym-1d485/)
- [SYM 1F618](https://angelic-bio-symbols-59.pages.dev/symbol/sym-1f618/)
- [SYM 26BE](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-26be/)
- [SYM 1FAE5](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-1fae5/)
- [GAMING WEAPONS](https://anime-sparkle-text-22.pages.dev/ja/gaming-weapons/)
- [TRENDING](https://angelic-bio-symbols-59.pages.dev/trending/)
- [SYM 2745](https://raven-gothic-kaomoji-25.pages.dev/symbol/sym-2745/)
- [SYM 1F921](https://matrix-hacker-text-52.pages.dev/symbol/sym-1f921/)
- [SYM 1F92A](https://mecha-text-vault-91.pages.dev/symbol/sym-1f92a/)
- [SYM 1F9E1](https://matrix-glitch-text-37.pages.dev/symbol/sym-1f9e1/)
- [SYM 1D480](https://sleek-bio-symbols-40.pages.dev/symbol/sym-1d480/)
- [TIBETAN LOTUS BLOSSOM](https://vintage-coquette-text-58.pages.dev/symbol/tibetan-lotus-blossom/)
- [SYM 1F972](https://angelic-bio-symbols-59.pages.dev/symbol/sym-1f972/)
- [LEFT WHITE CORNER BRACKET](https://anime-sparkle-text-73.pages.dev/symbol/left-white-corner-bracket/)
- [DISCORD STATUS](https://dolly-kaomoji-text-94.pages.dev/ru/discord-status/)
- [SYM 26F9](https://neon-futuristic-symbols-58.pages.dev/symbol/sym-26f9/)
- [SYM 1D47E](https://coquette-aesthetic-symbols-84.pages.dev/symbol/sym-1d47e/)
- [SYM 1D420](https://coquette-aesthetic-symbols-86.pages.dev/symbol/sym-1d420/)
- [ARROWS LINES](https://cyberpunk-clan-tags-43.pages.dev/ru/arrows-lines/)
- [SYM 1F47F](https://vintage-coquette-text-58.pages.dev/symbol/sym-1f47f/)
- [SYM 26BF](https://coquette-aesthetic-symbols-52.pages.dev/symbol/sym-26bf/)
- [SYM 1D498](https://coquette-aesthetic-symbols-84.pages.dev/symbol/sym-1d498/)
- [SYM 1D459](https://kawaii-kaomoji-hub-93.pages.dev/symbol/sym-1d459/)
- [SYM 1D429](https://neon-futuristic-symbols-58.pages.dev/symbol/sym-1d429/)
- [SYM 2678](https://theeduplaycampen.pages.dev/symbol/sym-2678/)
- [SYM 1D4A4](https://dark-literary-kaomoji-13.pages.dev/symbol/sym-1d4a4/)
- [SYM 1D472](https://theeduplaycampen.pages.dev/symbol/sym-1d472/)
- [SYM 1D42C](https://coquette-aesthetic-symbols-86.pages.dev/symbol/sym-1d42c/)
- [SYM 2684](https://anime-sparkle-text-22.pages.dev/symbol/sym-2684/)
- [SYM 1F60D](https://minimal-star-symbols-93.pages.dev/symbol/sym-1f60d/)
- [TIKTOK CAPTIONS](https://sleek-bio-symbols-40.pages.dev/tiktok-captions/)
- [SYM 1D4A4](https://ribbon-heart-fonts-86.pages.dev/symbol/sym-1d4a4/)
- [COQUETTE BOW RIBBON](https://sleek-bio-symbols-40.pages.dev/symbol/coquette-bow-ribbon/)
- [RIGHT HEAVY BRACKET BOX](https://soft-bow-fonts-22.pages.dev/symbol/right-heavy-bracket-box/)
- [SYM 1F600](https://coquette-aesthetic-symbols-84.pages.dev/symbol/sym-1f600/)
- [SYM 1D42C](https://kawaii-kaomoji-hub-93.pages.dev/symbol/sym-1d42c/)
- [SYM 1F9E1](https://vintage-angel-symbols-66.pages.dev/symbol/sym-1f9e1/)
- [SYM 1F60E](https://lace-heart-kaomoji-64.pages.dev/symbol/sym-1f60e/)
- [SYM 2679](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-2679/)
- [GOTHIC OBSIDIAN SKULL CREST](https://coquette-aesthetic-symbols-84.pages.dev/symbol/gothic-obsidian-skull-crest/)
- [SYM 1D48D](https://coquette-aesthetic-symbols-84.pages.dev/symbol/sym-1d48d/)
- [HEARTS](https://coquette-aesthetic-symbols-84.pages.dev/pt/hearts/)
- [SYM 26DB](https://coquette-aesthetic-symbols-84.pages.dev/symbol/sym-26db/)
- [SYM 26A2](https://soft-bow-fonts-22.pages.dev/symbol/sym-26a2/)
