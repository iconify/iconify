# Iconify for Tailwind CSS

This plugin creates CSS for over 150k open source icons.

[Browse icons at Iconify](https://icon-sets.iconify.design/) to see all icons.

## Usage

1. Install packages icon sets.
2. In `tailwind.config.js` import `addDynamicIconSelectors` from `@iconify/tailwind`.

## HTML

To use icon in HTML, add class with class name like this: `icon-[mdi-light--home]`

```html
<span class="icon-[mdi-light--home]"></span>
```

Class name has 3 parts:

-   Selectot prefix, which can be set in `prefix` option of plugin. Default value is `icon`.
-   `-` to tell Tailwind that class name is not complete.
-   `[{prefix}--{name}]` for icon name, where `{prefix}` is icon set prefix, `{name}` is icon name.

In Iconify all icon names use the following format: `{prefix}:{name}`. Due to limitations of Tailwind CSS, same format cannot be used with plugin, so instead, prefix and name are separated by double dash: `{prefix}--{name}`.

### Color, size, alignment

Monoton icons can change color! See [Iconify documentation](https://iconify.design/docs/usage/css/#monotone) for longer explanation.

To change icon size or color, change font size or text color, like you would with any text.

Icon color cannot be changed for icons with hardcoded palette, such as most emoji sets or flag icons.

To align icon below baseline, add negative vertical alignment, like this (you can also use Tailwind class for that):

```html
<span class="icon-[mdi--home]" style="vertical-align: -0.125em"></span>
```

## Installing icon sets

Plugin does not include icon sets. You need to install icon sets separately.

To install all 150k+ icons, install `@iconify/json` as a dev dependency.

If you do not want to install big package, install `@iconify-json/` packages for icon sets that you use.

See [Iconify icon sets](https://icon-sets.iconify.design/) for list of available icon sets and icons.

See [Iconify documentation](https://iconify.design/docs/icons/json.html) for list of packages.

## Tailwind config

Add this to `tailwind.config.js`:

```js
const { addDynamicIconSelectors } = require('@iconify/tailwind');
```

Then in plugins section add `addDynamicIconSelectors`.

Example:

```js
module.exports = {
	content: ['./src/*.html'],
	theme: {
		extend: {},
	},
	plugins: [
		// Iconify plugin
		addDynamicIconSelectors(),
	],
	presets: [],
};
```

### Options

Plugin accepts options as a second parameter:

-   `prefix` is class name prefix. Default value is `icon`. Make sure there is no `-` at the end: it is added in classes, but not in plugin parameter.
-   `overrideOnly`: set to `true` to generate rules that override only icon data. See below.
-   `scale`: sets the default icon height/width value. Can be set to 0 which removes the default height/width. Default is 1 (1em).
-   `files`: list of custom files for icon sets. Key is icon set prefix, value is location of `.json` file with icon set in IconifyJSON format.
-   `iconSet`: list of custom icon sets. Key is prefix, value is either icon set data in `IconifyJSON` format or a synchronous callback that returns `IconifyJSON` data.

#### overrideOnly

You can use `overrideOnly` to load some icons without full rules, such as changing icon on hover when main and hover icons are from the same icon set and have same width/height ratio.

Example of config:

```js
plugins: [
	// `icon-`
    addDynamicIconSelectors(),
	// `icon-hover-`
    addDynamicIconSelectors({
      prefix: "icon-hover",
      overrideOnly: true,
    }),
  ],
```

and usage in HTML:

```html
<span class="icon-[mdi--arrow-left] hover:icon-hover-[mdi--arrow-right]"></span>
```

## License

This package is licensed under MIT license.

`SPDX-License-Identifier: MIT`

This license does not apply to icons. Icons are released under different licenses, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free license.

© 2023-PRESENT Vjacheslav Trushkin
