# What is Iconify?

Iconify is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 100+ icon sets with more than 100,000 icons.
-   Embed icons in HTML with SVG framework or components for front-end frameworks.
-   Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
-   Add icon search to your applications with Iconify Icon Finder.

For more information visit [https://iconify.design/](https://iconify.design/).

# Iconify SVG framework

There are many fonts and SVG sets available, but they all have one thing in common: using any font or SVG set limits you to icons that are included in that set and forces browsers to load entire font or icons set. That limits developers to one or two fonts or icon sets.

Iconify uses a new innovative approach to loading icons. Unlike fonts and SVG frameworks, Iconify only loads icons that are used on the page instead of loading entire fonts. How is it done? By serving icons dynamically from publicly available JSON API (you can make a copy of script and API if you prefer to keep everything on your servers).

Iconify SVG framework is designed to be as easy to use as possible.

Add this line to your page to load Iconify SVG framework (you can add it to `<head>` section of the page or before `</body>`):

```html
<script src="https://code.iconify.design/2/2.1.2/iconify.min.js"></script>
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/@iconify/iconify@2.1.2/dist/iconify.min.js"></script>
```

or, if you are building a project with something like WebPack or Rollup, you can include the script by installing `@iconify/iconify` as a dependency and importing it in your project:

```js
import Iconify from '@iconify/iconify';
```

To add any icon, write something like this:

```html
<span class="iconify" data-icon="eva:people-outline"></span>
```

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/assets/images/eva-people-outline.svg)

or this:

```html
<span class="iconify-inline" data-icon="fa-solid:home"></span>
<a href="#">Return home!</a>
```

&nbsp;&nbsp;&nbsp; ![Screenshot](https://iconify.design/assets/images/inline-sample.png)

That is it. Change `data-icon` value to the name of the icon you want to use. There are over 100,000 premade icons to choose from, including FontAwesome, Material Design Icons, Tabler Icons, Box Icons, Unicons, Bootstrap Icons and even several emoji sets.

Do you want to make your own icon sets? Everything you need is [available on GitHub](https://github.com/iconify): tools for creating custom icon sets, Iconify API application and documentation to help you.

## Full documentation

Below is a shortened version of documentation.

Full documentation is available on Iconify website:

-   [SVG framework documentation](https://docs.iconify.design/implementations/svg-framework/).
-   [Iconify API documentation](https://docs.iconify.design/sources/api/).
-   [Creating icon bundles](https://docs.iconify.design/sources/bundles/).
-   [Iconify Tools documentation](https://docs.iconify.design/tools/node/).

## How does it work?

The syntax is similar to icon fonts. Instead of inserting `SVG` in the document, you write a placeholder element, such `SPAN` or `I`.

Iconify SVG framework finds those placeholders and uses the following logic to parse them:

1. Retrieves icon name from `data-icon` attribute.
2. Checks if icon exists. If not, it sends a request to Iconify API to retrieve icon data.
3. Replaces placeholder element with `SVG`.

This is done in a fraction of a second. Iconify SVG framework watches DOM for changes, so whenever you add new placeholders, it immediately replaces them with `SVG`, making it easy to use with dynamic content, such as AJAX forms.

### Inline mode

Code examples above use different class names: the first example uses "iconify", the second example uses "iconify-inline".

What is the difference?

-   "iconify" renders icon as is, so it behaves like an image.
-   "iconify-inline" renders adds vertical alignment to the icon, making it behave like text (inline mode).

Usually, icon fonts do not render like normal images, they render like text. Text is aligned slightly below the baseline.

Visual example to show the difference between inline and block modes:

&nbsp;&nbsp;&nbsp; ![Inline icon](https://iconify.design/assets/images/inline.png)

Why is the inline mode needed?

-   To easily align icons within the text, such as emojis.
-   To make the transition from outdated icon fonts to SVG easier.

Use "iconify" for decorations, use "iconify-inline" if you want the icon to behave like an icon font.

#### data-inline attribute

In addition to using "iconify-inline" class, you can toggle inline mode with the `data-inline` attribute.

Set value to "true" to force inline mode, set value to "false" to use block mode.

Different ways to use block mode:

```html
<span class="iconify" data-icon="eva:people-outline"></span>
<span class="iconify" data-icon="eva:people-outline" data-inline="false"></span>
```

Different ways to use inline mode:

```html
<span class="iconify-inline" data-icon="eva:people-outline"></span>
<span class="iconify" data-icon="eva:people-outline" data-inline="true"></span>
<span
	class="iconify"
	data-icon="eva:people-outline"
	style="vertical-align: -0.125em"
></span>
```

## Iconify API

When you use an icon font, each visitor loads an entire font, even if your page only uses a few icons. This is a major downside of using icon fonts. That limits developers to one or two fonts or icon sets.

Unlike icon fonts, Iconify SVG framework does not load the entire icon set. Unlike fonts and SVG frameworks, Iconify only loads icons that are used on the current page instead of loading entire icon sets. How is it done? By serving icons dynamically from publicly available JSON API.

### Custom API

Relying on a third party service is often not an option. Many companies and developers prefer to keep everything on their own servers to have full control.

Iconify API and icon sets are all [available on GitHub](https://github.com/iconify), making it easy to host API on your own server.

For more details see [Iconify API documentation](https://docs.iconify.design/sources/api/).

You can also create custom Iconify API to serve your own icons. For more details see [hosting custom icons in Iconify documentation](https://iconify.design/docs/api-custom-hosting/).

### Using Iconify offline

While the default method of retrieving icons is to retrieve them from API, there are other options. Iconify SVG framework is designed to be as flexible as possible.

Easiest option to serve icons without API is by creating icon bundles.

Icon bundles are small scripts that you can load after Iconify SVG framework or bundle it together in one file.

For more details see [icon bundles in Iconify documentation](https://iconify.design/docs/icon-bundles/).

Another option is to import icons and bundle them with Iconify, similar to React and Vue components. Example:

```js
// Installation: npm install --save-dev @iconify/iconify
import Iconify from '@iconify/iconify/offline';
// Installation: npm install --save-dev @iconify/icons-dashicons
import adminUsers from '@iconify/icons-dashicons/admin-users';

// Unlike React and Vue components, in SVG framework each icon added with addIcon() name must have a
// prefix and a name. In this example prefix is "dashicons" and name is "admin-users".
Iconify.addIcon('dashicons:admin-users', adminUsers);
```

```html
<span class="iconify" data-icon="dashicons:admin-users"></span>
```

See [Iconify for React](http://github.com/iconify/iconify/packages/react) documentation for more details.

## Color

There are 2 types of icons: monotone and coloured.

-   Monotone icons are icons that use only 1 colour and you can change that colour. Most icon sets fall into this category: FontAwesome, Unicons, Material Design Icons, etc.
-   Coloured icons are icons that use the preset palette. Most emoji icons fall into this category: Noto Emoji, Emoji One, etc. You cannot change the palette for those icons.

Monotone icons use font colour, just like glyph fonts. To change colour, you can do this:

```html
<span class="iconify icon-bell" data-icon="vaadin-bell"></span>
```

and add this to CSS:

```css
.icon-bell {
	color: #f80;
}
.icon-bell:hover {
	color: #f00;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon-color.png)

## Dimensions

By default all icons are scaled to 1em height. To control icon height use font-size:

```html
<span class="iconify icon-clipboard" data-icon="emojione-clipboard"></span>
```

and add this to css:

```css
.icon-clipboard {
	font-size: 32px;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon-size.png)

you might also need to set line-height:

```css
.icon-clipboard {
	font-size: 32px;
	line-height: 1em;
}
```

You can also set custom dimensions using `data-width` and `data-height` attributes:

```html
<span
	data-icon="twemoji-ice-cream"
	data-width="32"
	data-height="32"
	class="iconify"
></span>
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon-size2.png)

## Transformations

You can rotate and flip icon by adding `data-flip` and `data-rotate` attributes:

```html
<span
	data-icon="twemoji-helicopter"
	class="iconify"
	data-flip="horizontal"
></span>
<span data-icon="twemoji-helicopter" class="iconify" data-rotate="90deg"></span>
```

Possible values for `data-flip`: horizontal, vertical.
Possible values for `data-rotate`: 90deg, 180deg, 270deg.

If you use both flip and rotation, the icon is flipped first, then rotated.

To use custom transformations use CSS transform rule. Add `!important` after rule to override the SVG inline style (inline style exists to fix an SVG rendering bug in Firefox browser).

```html
<span data-icon="twemoji-helicopter" class="iconify icon-helicopter"></span>
```

```css
.icon-helicopter {
	transform: 45deg !important;
}
```

Samples:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon-transform.png)

## Available icons

There are over 100,000 icons to choose from.

General collections (monotone icons):

-   [Material Design Icons](https://icon-sets.iconify.design/mdi/) (5000+ icons)
-   [Unicons](https://icon-sets.iconify.design/uil/) (1000+ icons)
-   [Jam Icons](https://icon-sets.iconify.design/jam/) (900 icons)
-   [IonIcons](https://icon-sets.iconify.design/ion/) (1200+ icons)
-   [FontAwesome 4](https://icon-sets.iconify.design/fa/) and [FontAwesome 5](https://icon-sets.iconify.design/fa-solid/) (2000+ icons)
-   [Vaadin Icons](https://icon-sets.iconify.design/vaadin/) (600+ icons)
-   [Bootstrap Icons](https://icon-sets.iconify.design/bi/) (500+ icons)
-   [Feather Icons](https://icon-sets.iconify.design/feather/) and [Feather Icon](https://icon-sets.iconify.design/fe/) (500+ icons)
-   [IcoMoon Free](https://icon-sets.iconify.design/icomoon-free/) (400+ icons)
-   [Dashicons](https://icon-sets.iconify.design/dashicons/) (300 icons)

and many others.

Emoji collections (mostly colored icons):

-   [Emoji One](https://icon-sets.iconify.design/emojione/) (1800+ colored version 2 icons, 1400+ monotone version 2 icons, 1200+ version 1 icons)
-   [OpenMoji](https://icon-sets.iconify.design/openmoji/) (3500+ icons)
-   [Noto Emoji](https://icon-sets.iconify.design/noto/) (2000+ icons for version 2, 2000+ icons for version 1)
-   [Twitter Emoji](https://icon-sets.iconify.design/twemoji/) (2000+ icons)
-   [Firefox OS Emoji](https://icon-sets.iconify.design/fxemoji/) (1000+ icons)

Also, there are several thematic collections, such as weather icons, map icons, etc.

You can use browse or search available icons on the Iconify website: https://icon-sets.iconify.design/

Click an icon to get HTML code.

## Iconify vs SVG vs glyph fonts

Why use Iconify instead of fonts or other frameworks?

There is a tutorial that explains all differences. See http://iconify.design/docs/iconify-svg-fonts/

## Browser support

Iconify supports all modern browsers.

Old browsers that are supported:

-   IE 9+
-   iOS Safari for iOS 8+

IE 9, 10 and iOS 8 Safari do not support some modern functions that Iconify relies on. Iconify will automatically
load polyfills for those browsers. All newer browsers do not require those polyfills.

## License

Iconify is dual-licensed under Apache 2.0 and GPL 2.0 license. You may select, at your option, one of the above-listed licenses.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

This license does not apply to icons. Icons are released under different licenses, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free license.

© 2020, 2021 Iconify OÜ
