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
<simple-svg data-icon="fci-alarm-clock"></simple-svg>
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
<span class="simple-svg icon-clipboard" data-icon="emoji1-clipboard"></span>
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
    background: url("https://icons.simplesvg.com/emoji1/emoji1-ice-skate.svg") left center no-repeat;
}
```

That example uses emoji that has preset color palette. What about monotone icons? SVG cannot inherit color from DOM when
used as background image. That means you need to specify color value. To specify color, add color parameter:

```
.foo {
    background: url("https://icons.simplesvg.com/mdi/mdi-account.svg?color=red") left center no-repeat;
}
.bar {
    background: url("https://icons.simplesvg.com/fa/fa-home?color=%23FF8040") left center no-repeat;
}
```


Where %23FF8040 is URL version of #FF8040. You cannot use # in URL, so you need to replace it with %23

Optional parameters:

* width and height - width and height in pixels. If you set it to "auto", original SVG dimensions will be used.
It is enough to set only 1 dimension to "auto", other dimension will be set to "auto" automatically:

```
https://icons.simplesvg.com/noto/noto-stars.svg?height=auto
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
* FontAwesome (600+ icons)
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

Many icon sets listed above are probably familiar to you. You have most likely used FontAwesome, maybe GlyphIcons on
your website.

They are all popular and awesome, but there are downsides to using glyph fonts:

* Visitors need to load entire fonts. You cannot just select which icons to load, entire font has to be loaded. Because
of that choice of icons is limited to 1-2 fonts.
* Rendering issues. Fonts are rendered differently on different operating systems and even in different browsers on same
operating system. Using font to display icons means icons will not be shown the same way for all clients.

When I was working on styles for XenForo forum software I wanted to find a solution to allow forum owners select more
icons. XenForo includes only FontAwesome by default and heavily relies on it, thus limiting choices to only 1 font.
Including more fonts just for few glyphs seems like a waste of resources.

All glyphs are vector icons, so displaying them as SVG should not be hard, right? Wrong. There are bunch of issues with
SVG icons:

* Using SVG icons as external images, like PNG/JPG/GIF, has some downsides, that make external SVG images very hard to 
use:
    * Images cannot inherit document color. That means loading different images for each color. If image color is
    supposed to match parent element's color, like when you are using glyph fonts, it won't work.
    * SVG sprites are not supported by some browsers, making them completely useless for anything other than 
    experimenting. They are also not trivial to build. That means each SVG image has to be stored separately.
* Inserting SVG into pages? Every image will be loaded on each page load, often multiple times per page (not all
browsers support sprites). That is waste of bandwidth.
* SVG images are not easy to prepare. Glyph fonts are - just plug it in, write few lines of code and that's all.

SimpleSVG solves all those issues.


## Advantages of using SimpleSVG instead of glyph fonts

* Icons are loaded on demand. Glyph fonts load entire fonts, SimpleSVG loads only icons that are used on page, so
resources are not wasted. That means you can mix icons from different collections. You are no longer limited to
1 or 2 collections.
* Over 20,000 premade icons to choose from.
* Emojis! Default collection includes several emoji sets (see above). Using SimpleSVG you can use any or all of those
emoji sets on same page. Icons will be displayed exactly the same for all visitors, regardless of their browser and
operating system.
* Icons are rendered as images, not as glyphs, so no more rendering differences. Icons are rendered exactly the same
in all browsers on all operating systems.


## What makes SimpleSVG better than inserting SVG into document

* Icons are loaded in bulk from CDN as JSON data, which contains only shapes, width and height. One HTTP(S) request can
load several icons at the same time without SVG overhead, so it loads fast and uses less bandwidth. 100 icons takes only
15-20kb (sometimes more, sometimes less - depends on complexity of shapes of those icons).
* No need to host SVG icons set. Icons are loaded dynamically from CDN. Though if you want to host icons yourself for
some reason (total control over images, full privacy that some companies demand or any other reason), tools for creating
custom server are available.
* Monotone icons inherit color from stylesheet. It works just like glyph fonts: to change color you need to set color in
stylesheet using something like ```color: red```.
* Icons are automatically scaled down to current font size and aligned to baseline, just like glyph fonts. To change
icon height you need to set different font-size. You don't need to worry about dimensions of original SVG icon,
SimpleSVG will take care of everything for you. There is also option to set custom dimensions using width and height
attributes. More details on that will be posted later.


Other stuff:

* Migrating from glyph font? There are several plugins available that lets you use SimpleSVG without changing code.
Currently plugins are available for FontAwesome, Icalicons and PrestaShop icons.
* Want to use SVG as backgrounds? It is possible. CDN can generate SVG images that you can use as background in
stylesheet. Downside is you need to specify color in URL because backgrounds cannot inherit color from DOM element.
* Want to create your own icons set? It is possible. Tools for creating custom sets are available on GitHub.
Tools for hosting custom CDN are also available on GitHub. Or instead of hosting, you can append icons to page as
script. For more details see documentation on website.
* Can SimpleSVG be used with premium icon sets? Yes. All you need to do is host your own CDN for your icons and add one
line of code to make SimpleSVG load icons with your custom prefix from your server.
* What if you change document after page load? SimpleSVG observes DOM for changes, replacing all new span tags with
SVG images. AJAX forms and anything else that adds content to page will work fine.
* Browser support. SimpleSVG works with all modern browsers. From old browsers it supports old WebKit (Safari,
Chrome used on outdated phones), Internet Explorer 9 and newer versions.
* Script does not have any dependencies. Support for old Internet Explorer requires several polyfills (WeakMaps,
Observer, ClassList), but SimpleSVG will load them automatically.


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
SimpleSVG page: https://simplesvg.com/test/fa-examples.html

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
