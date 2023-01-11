# Iconify for Tailwind CSS

This plugin creates CSS for over 100k open source icons.

[Browse icons at Iconify](https://icon-sets.iconify.design/) to see all icons.

## Usage

1. Install packages icon sets.
2. In `tailwind.config.js` import plugin and specify list of icons you want to load.

## HTML

To use icon in HTML, it is as easy as adding 2 class names:

-   Class name for icon set.
-   Class name for icon.

```html
<span class="icon--mdi icon--mdi--home"></span>
```

Why 2 class names? It reduces duplication and makes it easy to change all icons from one icon set.

You can change that with options: you can change class names format, you can disable common selector. See [options for function used by plugin](https://docs.iconify.design/tools/utils/get-icons-css.html).

### Color, size, alignment

To change icon size or color, change font size or text color, like you would with any text.

Icon color cannot be changed for icons with hardcoded palette, such as most emoji sets or flag icons.

To align icon below baseline, add negative vertical alignment, like this (you can also use Tailwind class for that):

```html
<span class="icon--mdi icon--mdi--home" style="vertical-align: -0.125em"></span>
```

## Installing icon sets

Plugin does not include icon sets. You need to install icon sets separately.

To install all 100k+ icons, install `@iconify/json` as a dev dependency.

If you do not want to install big package, install `@iconify-json/` packages for icon sets that you use.

See [Iconify icon sets](https://icon-sets.iconify.design/) for list of available icon sets and icons.

See [Iconify documentation](https://docs.iconify.design/icons/json.html) for list of packages.

## Tailwind config

Then you need to add and configure plugin.

Add this to `tailwind.config.js`:

```js
const iconifyPlugin = require('@iconify/tailwind');
```

Then in plugins section add `iconifyPlugin` with list of icons you want to load.

Example:

```js
module.exports = {
	content: ['./src/*.html'],
	theme: {
		extend: {},
	},
	plugins: [
		// Iconify plugin with list of icons you need
		iconifyPlugin(['mdi:home', 'mdi-light:account']),
	],
	presets: [],
};
```

### Icon names

Unfortunately Tailwind CSS cannot dynamically find all icon names. You need to specify list of icons you want to use.

### Options

Plugin accepts options as a second parameter. You can use it to change selectors.

See [documentation for function used by plugin](https://docs.iconify.design/tools/utils/get-icons-css.html) for list of options.

## License

This package is licensed under MIT license.

`SPDX-License-Identifier: MIT`

This license does not apply to icons. Icons are released under different licenses, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free license.

© 2023 Vjacheslav Trushkin / Iconify OÜ
