# What is SimpleSVG?

SimpleSVG is framework for adding SVG icons to website pages.

SimpleSVG is designed to be as simple to use as possible. Add this line to your page to load SimpleSVG: 

```
<script src="//code.simplesvg.com/1/1.0.0-beta3/simple-svg.min.js"></script>
```
    
you can add it to ```<head>``` section of page or before ```</body>```. 

To add any icon, write something like this: 

```
<span class="simple-svg" data-icon="fa-home"></span>
```
or this:
```
<simple-svg data-icon="mdi-home"></simple-svg>
```

Sample:
    
&nbsp;&nbsp;&nbsp; ![Sample](https://simplesvg.com/samples/icon2.png)

That is it. Change data-icon value to name of icon you want to use. There are over 20,000 premade icons to choose from,
including FontAwesome, Material Design Icons, Entypo+ and even several emoji sets.

Do you want to make your own icon sets? Tools for making custom icon sets are available on GitHub. See documentation.

## Customizing color, dimensions, transformations

### Color

There are 2 types of icons: monotone and colored.

* Monotone icons are icons that use only 1 color. All icons from glyph fonts fall into this category: FontAwesome,
GlyphIcons, Material Design Icons, etc.
* Colored icons are icons that use preset palette. Most emoji icons fall into this category: Noto Emoji, Emoji One,
etc. You cannot change palette for those icons.

Monotone icons use font color, just like glyph fonts. To change color you can do this:

```
<span class="simple-svg icon-bell" data-icon="vaadin-bell"></span>
```
    
and add this to css:

```
.icon-bell {
    color: #f80;
}
.icon-bell:hover {
    color: #f00;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://simplesvg.com/samples/icon-color.png)


### Dimensions

By default all icons are scaled to 1em height. To control icon height use font-size:

```
<span class="simple-svg icon-clipboard" data-icon="emojione-clipboard"></span>
```
    
and add this to css:

```
.icon-clipboard {
    font-size: 32px;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://simplesvg.com/samples/icon-size.png)
    
    
you might also need to set line-height:

```
.icon-clipboard {
    font-size: 32px / 1em;
}
```

You can also set custom dimensions using data-width and data-height attributes:

```
<span data-icon="twemoji-ice-cream" data-width="32" data-height="32" class="simple-svg"></span>
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://simplesvg.com/samples/icon-size2.png)


### Vertical alignment

Trouble with using images in text is they are aligned at baseline. Glyph fonts don't have that issue because
they are rendered as fonts, vertically centered slightly below baseline so they look nicely aligned in text.

To solve that issue SimpleSVG adds vertical alignment to all icons, placing them below baseline, so icons behave
similar to glyph fonts, fitting perfectly into text.

But what if you don't want that behavior? What if you want SimpleSVG icons to behave like images? There are several
solutions, use whichever you prefer:

1. Using simple-svg tag instead of span:
```
<simple-svg data-icon="noto-frog-face"></simple-svg>
```
simple-svg tag same as using class="simple-svg" on any other element, but by default inline mode is disabled.

2. Adding data-icon-inline attribute:
```
<span class="simple-svg" data-icon="noto-frog-face" data-icon-inline="false"></span>
```

3. Removing vertical-alignment via css:
```
.simple-svg {
    vertical-align: baseline !important;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://simplesvg.com/samples/icon-baseline.png)


### Transformations

You can rotate and flip icon by adding data-flip and data-rotate attributes:

```
<span data-icon="twemoji-helicopter" class="simple-svg" data-flip="horizontal"></span>
<span data-icon="twemoji-helicopter" class="simple-svg" data-rotate="90deg"></span>
```
    
Possible values for data-flip: horizontal, vertical.
Possible values for data-rotate: 90deg, 180deg, 270deg.

If you use both flip and rotation, icon is flipped first, then rotated.

To use custom transformations use css transform rule. Add !important after rule to override svg style.

```
<span data-icon="twemoji-helicopter" class="simple-svg icon-helicopter"></span>
```
```
.icon-helicopter {
    transform: 45deg !important;
}
```

Samples:

&nbsp;&nbsp;&nbsp; ![Sample](https://simplesvg.com/samples/icon-transform.png)


# Using SimpleSVG in stylesheets

One useful feature of glyph fonts is ease of use in stylesheets. Usually it is done by adding pseudo selector like this:

```
.foo:after {
    content: '\f030';
    font-family: FontAwesome;
}
```

That cannot be done with SVG. What you can do instead is use SVG as background. SimpleSVG CDN includes SVG generator
that creates background images for any icon. You can use it like this:

```
.foo {
    background: url('https://icons.simplesvg.com/emojione-ice-skate.svg') no-repeat center center / contain;
}
```

That example uses emoji that has preset color palette. What about monotone icons? SVG cannot inherit color from DOM when
used as background image. That means you need to specify color value. To specify color, add color parameter:

```
.foo {
    background: url("https://icons.simplesvg.com/mdi-account.svg?color=red") no-repeat center center / contain;
}
.bar {
    background: url("https://icons.simplesvg.com/fa-home?color=%23FF8040") no-repeat center center / contain;
}
```


Where %23FF8040 is URL version of #FF8040. You cannot use # in URL, so you need to replace it with %23

Optional parameters:

* width and height - width and height in pixels. If you set it to "auto", original SVG dimensions will be used.
It is enough to set only 1 dimension to "auto", other dimension will be set to "auto" automatically:

```
https://icons.simplesvg.com/noto-stars.svg?height=auto
```

* align - alignment, used when custom width/height ratio does not match original SVG width/height ratio. Values are the
same as in data-align attribute mentioned above.
* flip, rotate - transformations. Same as data-flip and data-rotate mentioned above.


# Available icons

There are over 20,000 icons to choose from.

General collections (monotone icons):
* Material Design Icons (2000+ icons)
* Material Design Iconic Font (700+ icons)
* IconIcons (700+ icons)
* FontAwesome 4 and FontAwesome 5 (1000+ icons)
* Vaadin Icons (600+ icons)
* PrestaShop Icons (400+ icons)
* IcoMoon Free (400+ icons)
* WebHostingHub Glyphs (2000+ icons)
and many others.

Emoji collections (mostly colored icons):
* Emoji One (1800+ colored version 2 icons, 1400+ monotone version 2 icons, 1200+ version 1 icons)
* Firefox OS Emoji (1000+ icons)
* Noto Emoji (2000+ icons for version 2, 2000+ icons for version 1)
* Twitter Emoji (800+ icons)

Also there are several thematic collections, such as weather icons, map icons, etc.

You can use icon finder to browse or search available icons: https://simplesvg.com/test/search.html

Click any icon to get HTML code. Right-click icon and copy icon URL to get SVG image. 


# SimpleSVG vs SVG vs glyph fonts

Why use SimpleSVG instead of fonts or other frameworks?

There is a tutorial that explains all differences. See http://simplesvg.com/docs/simplesvg-svg-fonts/



# Plugins to make migration easier

Some icon sets used in SimpleSVG are imported from glyph fonts. SimpleSVG includes plugins for some of those collections
that make it easier to migrate from font library.

By default SimpleSVG is searching for items with simple-svg class and uses data-icon attribute to get icon name:

    <span class="simple-svg" data-icon="mdi-home"></span>

Plugins make SimpleSVG search for other selectors, so you can keep using old library syntax:

    <i class="fa fa-arrow-left"></i>

How to use plugins? Include plugin script:

    <script src="//code.simplesvg.com/1/1.0.0-beta3/plugin-fa.min.js"></script>

Here is FontAwesome example page without using FontAwesome:

Original page that uses FontAwesome: http://fontawesome.io/examples/
SimpleSVG page: http://simplesvg.com/test/fa-examples.html

SimpleSVG page is identical, except that I removed FontAwesome code, added SimpleSVG code + FontAwesome plugin,
removed ads and few sections. All icons on that page are SVG. Pages look almost identical, but SimpleSVG copy should
look a bit sharper in some browsers.



# Browser support

SimpleSVG supports all modern browsers.

Old browsers that are supported:
- IE 9+
- iOS Safari for iOS 8+

IE 9, 10 and iOS 8 Safari do not support some modern functions that SimpleSVG relies on. SimpleSVG will automatically
load polyfills for those browsers. All newer browsers do not require those polyfills.


# License

SimpleSVG is released with MIT license.

This license does not apply to icons. Icons are released under different licenses, see each icons set for details.
Icons available by default are all licensed under some kind of open source or free license. 

© 2016, 2017 Vjacheslav Trushkin
