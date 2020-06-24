# Iconify version 1

This is the repository for Iconify version 1.

Check out [https://github.com/iconify/iconify](Iconify master branch) for the latest version.

# What is Iconify?

Iconify project makes it easy to add SVG icons to websites and offers over 50,000 icons to choose from.

There are many fonts and SVG sets available, but they all have one thing in common: using any font or SVG set limits you
to icons that are included in that set and forces browsers to load entire font or icons set. That limits developers to
one or two fonts or icon sets.

Iconify project uses a new innovative approach to loading icons. Unlike fonts and SVG frameworks, Iconify only loads
icons that are used on the page instead of loading entire fonts. How is it done? By serving icons dynamically from publicly
available JSON API (you can make a copy of script and API if you prefer to keep everything on your servers).

Iconify is designed to be as easy to use as possible.

Add this line to your page to load Iconify (you can add it to ```<head>``` section of page or before ```</body>```):

```html
<script src="https://code.iconify.design/1/1.0.7/iconify.min.js"></script>
```
or
```html
<script src="https://cdn.jsdelivr.net/npm/@iconify/iconify@1.0.7/dist/iconify.min.js"></script>
```
or if you are building project with something like WebPack, you can include script by installing `@iconify/iconify` as dependency and importing it in your project:
```js
import Iconify from '@iconify/iconify';
```


To add any icon, write something like this: 

```html
<span class="iconify" data-icon="fa-home"></span>
```
or this:
```html
<iconify-icon class="iconify" data-icon="mdi-home"></iconify-icon>
```

Sample:
    
&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon2.png)

That is it. Change `data-icon` value to the name of the icon you want to use. There are over 50,000 premade icons to choose from,
including FontAwesome, Material Design Icons, Entypo+, Box Icons, Unicons and even several emoji sets.

Do you want to make your own icon sets? Tools for making custom icon sets are available on GitHub. See documentation.

## Customizing colour, dimensions, transformations

### Color

There are 2 types of icons: monotone and coloured.

* Monotone icons are icons that use only 1 colour. All icons from glyph fonts fall into this category: FontAwesome,
GlyphIcons, Material Design Icons, etc.
* Colored icons are icons that use preset palette. Most emoji icons fall into this category: Noto Emoji, Emoji One,
etc. You cannot change the palette for those icons.

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


### Dimensions

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
<span data-icon="twemoji-ice-cream" data-width="32" data-height="32" class="iconify"></span>
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon-size2.png)


### Vertical alignment

The trouble with using images in the text is they are aligned at baseline. Glyph fonts don't have that issue because
they are rendered as fonts, vertically centred slightly below baseline so they look nicely aligned in text.

To solve that issue Iconify adds vertical alignment to all icons, placing them below baseline, so icons behave
similar to glyph fonts, fitting perfectly into text.

But what if you don't want that behaviour? What if you want Iconify icons to behave like images? There are several
solutions, use whichever you prefer:

1. Using `iconify-icon` tag instead of `span`:
```html
<iconify-icon data-icon="noto-frog-face"></iconify-icon>
```
iconify-icon tag is equal to using class="iconify" on any other element, but by default inline mode is disabled, so icon
will not have preset vertical-alignment style, behaving like a normal image.

2. Adding `data-inline` attribute:
```html
<span class="iconify" data-icon="noto-frog-face" data-inline="false"></span>
```

3. Removing vertical-alignment via CSS:
```css
.iconify {
    vertical-align: baseline !important;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconify.design/samples/icon-baseline.png)


### Transformations

You can rotate and flip icon by adding `data-flip` and `data-rotate` attributes:

```html
<span data-icon="twemoji-helicopter" class="iconify" data-flip="horizontal"></span>
<span data-icon="twemoji-helicopter" class="iconify" data-rotate="90deg"></span>
```
    
Possible values for `data-flip`: horizontal, vertical.
Possible values for `data-rotate`: 90deg, 180deg, 270deg.

If you use both flip and rotation, the icon is flipped first, then rotated.

To use custom transformations use CSS transform rule. Add `!important` after rule to override SVG style.

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


# Using Iconify in stylesheets

One useful feature of glyph fonts is the ease of use in stylesheets. Usually, it is done by adding a pseudo selector like this:

```css
.foo:after {
    content: '\f030';
    font-family: FontAwesome;
}
```

Its a bit harder to do with SVG. There are 2 options:
* Using SVG as pseudo element's content
* Using SVG as a background image

Both options use an external icon generated by Iconify API. Iconify API can create SVG for any available icon. You can use it like this:

```css
.foo {
    background: url('https://api.iconify.design/emojione-ice-skate.svg') no-repeat center center / contain;
}
```

or like this:
```css
.bar:after {
    content: url('https://api.iconify.design/emojione-ice-skate.svg?height=16');
}
```

Notice "height" attribute in the second example. You must specify height if you are using SVG as pseudo element's content, that's the only way to resize it. You can also set width parameter, but it is not needed because if you set height, the width will be calculated by Iconify API using original icon's width to height ratio.

Examples above use emoji that has a preset colour palette. What about monotone icons? SVG cannot inherit colour from DOM when used as an external resource. That means you need to specify the colour value. To specify the colour, add `color` parameter:

```css
.foo {
    background: url("https://api.iconify.design/mdi-account.svg?color=red") no-repeat center center / contain;
}
.bar:after {
    content: url("https://api.iconify.design/fa-home?height=16&color=%23FF8040");
}
```


Where `%23FF8040` is URL version of `#FF8040`. You cannot use `#` in URL, so you need to replace it with `%23`.

Optional parameters:

* width and height - width and height in pixels. If you set it to "auto", original SVG dimensions will be used. It is enough to set only 1 dimension to "auto", another dimension will be set to "auto" automatically:

```
https://api.iconify.design/fxemoji-star.svg?height=auto
```

* align - alignment, used when custom width/height ratio does not match original SVG width/height ratio. Values are the
same as in data-align attribute mentioned above.
* flip, rotate - transformations. Same as `data-flip` and `data-rotate` mentioned above.


# Available icons

There are over 50,000 icons to choose from.

General collections (monotone icons):
* [Material Design Icons](https://iconify.design/icon-sets/mdi/) (5000+ icons)
* [Unicons](https://iconify.design/icon-sets/uil/) (1000+ icons)
* [Jam Icons](https://iconify.design/icon-sets/jam/) (900 icons)
* [IonIcons](https://iconify.design/icon-sets/ion/) (1200+ icons)
* [FontAwesome 4](https://iconify.design/icon-sets/fa/) and [FontAwesome 5](https://iconify.design/icon-sets/fa-solid/) (2000+ icons)
* [Vaadin Icons](https://iconify.design/icon-sets/vaadin/) (600+ icons)
* [Feather Icon(s)](https://iconify.design/icon-sets/feather/) (500+ icons)
* [IcoMoon Free](https://iconify.design/icon-sets/icomoon-free/) (400+ icons)
* [Dashicons](https://iconify.design/icon-sets/dashicons/) (300 icons)
and many others.

Emoji collections (mostly colored icons):
* [Emoji One](https://iconify.design/icon-sets/emojione/) (1800+ colored version 2 icons, 1400+ monotone version 2 icons, 1200+ version 1 icons)
* [Firefox OS Emoji](https://iconify.design/icon-sets/fxemoji/) (1000+ icons)
* [Noto Emoji](https://iconify.design/icon-sets/noto/) (2000+ icons for version 2, 2000+ icons for version 1)
* [Twitter Emoji](https://iconify.design/icon-sets/twemoji/) (2000+ icons)

Also, there are several thematic collections, such as weather icons, map icons, etc.

You can use browse or search available icons on the Iconify website: https://iconify.design/icon-sets/

Click an icon to get HTML code.


# Iconify vs SVG vs glyph fonts

Why use Iconify instead of fonts or other frameworks?

There is a tutorial that explains all differences. See http://iconify.design/docs/iconify-svg-fonts/


# Plugins to make migration easier

Some icon sets used in Iconify are imported from glyph fonts. Iconify includes plugins for some of those collections
that make it easier to migrate from the font library.

By default Iconify is searching for items with "iconify" class and uses data-icon attribute to get icon name:

```html
<span class="iconify" data-icon="mdi-home"></span>
```

Plugins make Iconify search for other selectors, so you can keep using old library syntax:

```html
<i class="fa fa-arrow-left"></i>
```

How to use plugins? Include plugin script:

```html
<script src="https://code.iconify.design/1/1.0.7/plugin-fa.min.js"></script>
```

Replace link to FontAwesome with link to Iconify and link to FontAwesome plugin and you can keep using old FontAwesome
syntax in your pages.

However, it is better to not use plugins for cleaner code.


# Browser support

Iconify supports all modern browsers.

Old browsers that are supported:
- IE 9+
- iOS Safari for iOS 8+

IE 9, 10 and iOS 8 Safari do not support some modern functions that Iconify relies on. Iconify will automatically
load polyfills for those browsers. All newer browsers do not require those polyfills.


# License

Iconify is dual-licensed under Apache 2.0 and GPL 2.0 license. You may select, at your option, one of the above-listed licenses.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

This license does not apply to icons. Icons are released under different licenses, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free license. 

© 2016 - 2020 Vjacheslav Trushkin
