# Simple SVG

This is a preview version. Description will be here later.

It is basically like FontAwesome, but instead of using web font, it uses SVG.

There are over 20,000 icons to choose from, including icons from popular web fonts, such as Font Awesome, Material Design
and multiple emoji libraries: Emoji One, Firefox OS Emoji, Noto Emoji and few other libraries.
 
You can use this library to load emoji from 4 different libraries, rendering them identically in all browsers on all
operating systems. You can use this library to render custom SVG icons set.
 
Search tool with full index of available icons will be published later.

# Loading all those icons?

Do not worry, Simple SVG loads only icons that are found on page. This is not a web font.

CDN with all icons will be available later. For now icons are loaded from artodia.com server using RESTful API. 

# Usage examples

This will load home icon from FontAwesome library

    <i class="simple-svg" data-icon="fa-home"></i>

This will load home icon from Material Design icons:

    <i class="simple-svg" data-icon="mdi-home"></i>

There are over 20,000 icons to choose from.

To set width and/or height use width and height attributes:

    <i class="simple-svg" data-icon="noto-gift" height="32px"></i>
    <i class="simple-svg" data-icon="emoji-gift" height="32px"></i>
    
If you set only 1 dimension, other dimension will be automatically calculated using icon's width/height ratio.
If no dimensions are specified, height is automatically set to 1em.

To change color use "color" in css:

    <i class="simple-svg" data-icon="fa-home" style="color: red;"></i>
    
More details will be posted later. See HTML files in directory "samples".

# Custom icons

This library can be used with custom icon sets.

Tools for making custom packages will be published later.

# Browser support

Library supports all modern browsers.

Old browsers that are supported:
- IE 9+
- iOS Safari for iOS 8+

IE 9, 10 and iOS 8 Safari do not support some modern functions that library relies on. SimpleSVG will automatically load
polyfills for those browsers. All newer browsers do not require those polyfills.

# License

Library is released with MIT license.

This license does not apply to icons. Icons are released under different licenses, see each icons set for details.
Icons available by default are all licensed under some kind of open source or free license. 

© 2016, 2017 Vjacheslav Trushkin
