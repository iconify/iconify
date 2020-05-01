# Iconify for Svelte

Iconify for Svelte is not yet another icon component! There are many of them already.

Iconify is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 60+ icon sets with 50,000 icons.
-   Embed icons in HTML with SVG framework or components for front-end frameworks.
-   Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
-   Add icon search to your applications with Iconify Icon Finder.

For more information visit [https://iconify.design/](https://iconify.design/).

Iconify for Svelte is a part of Iconify framework that makes it easy to use many icon libraries with Svelte.

Iconify for Svelte features:

-   Easy to use.
-   Bundles only icons that you need.
-   Change icon size and colour by changing font size and colour.
-   Renders pixel-perfect SVG.

## Installation

If you are using NPM:

```bash
npm install --save-dev @iconify/svelte
```

If you are using Yarn:

```bash
yarn add --dev @iconify/svelte
```

This package does not include icons. Icons are split into separate packages that available at NPM. See below.

## Usage

Install `@iconify/svelte` and packages for selected icon sets. Import component from `@iconify/svelte` and icon data for the icon you want to use:

```js
import IconifyIcon from '@iconify/svelte';
import home from '@iconify/icons-mdi/home';
import faceWithMonocle from '@iconify/icons-twemoji/face-with-monocle';
```

Then use component with icon data as "icon" parameter:

```jsx
<IconifyIcon icon={home} />
<p>This is some text with <IconifyIcon icon={faceWithMonocle} inline={true} /></p>
```

## Icon component attributes

`icon` attribute is mandatory. It tells component what icon to render. If the attribute value is invalid, the component will render an empty icon. The value must be an object containing the icon data.

The icon component has the following optional attributes:

-   `inline`. Changes icon behaviour to match icon fonts. See "Inline icon" section below.
-   `width` and `height`. Icon dimensions. The default values are "1em" for both. See "Dimensions" section below.
-   `color`. Icon colour. This is the same as setting colour in style. See "Icon colour" section below.
-   `flip`, `hFlip`, `vFlip`. Flip icon horizontally and/or vertically. See "Transformations" section below.
-   `rotate`. Rotate icon by 90, 180 or 270 degrees. See "Transformations" section below.
-   `align`, `vAlign`, `hAlign`, `slice`. Icon alignment. See "Alignment" section below.

### Other attributes and events

In addition to the attributes mentioned above, the icon component accepts any other attributes. All other attributes will be passed to generated `SVG` element, so you can do stuff like setting the inline style, add title and so on.

In Svelte it is not possible to pass events to child components, so Icon component does not handle any events. If you need to make icon clickable, wrap it in a button or link and assign an event to that button or link.

### Dimensions

By default, icon height is "1em". With is dynamic, calculated using the icon's width to height ratio.

There are several ways to change icon dimensions:

-   Setting `font-size` in style.
-   Setting `width` and/or `height` attribute.

Values for `width` and `height` can be numbers or strings.

If you set only one dimension, another dimension will be calculated using the icon's width to height ratio. For example, if the icon size is 16 x 24, you set the height to 48, the width will be set to 32. Calculations work not only with numbers, but also with string values.

#### Dimensions as numbers

You can use numbers for `width` and `height`.

```jsx
<IconifyIcon icon={homeIcon} height={24} />
```

```jsx
<IconifyIcon icon={homeIcon} width={16} height={16} />
```

Number values are treated as pixels. That means in examples above, values are identical to "24px" and "16px".

#### Dimensions as strings without units

If you use strings without units, they are treated the same as numbers in an example above.

```jsx
<IconifyIcon icon={homeIcon} height="24" />
```

#### Dimensions as strings with units

You can use units in width and height values:

```jsx
<IconifyIcon icon={homeIcon} height="2em" />
```

Be careful when using `calc`, view port based units or percentages. In SVG element they might not behave the way you expect them to behave and when using such units, you should consider settings both width and height.

#### Dimensions as 'auto'

Keyword "auto" sets dimensions to the icon's `viewBox` dimensions. For example, for 24 x 24 icon using `height="auto"` sets height to 24 pixels.

```jsx
<IconifyIcon icon={homeIcon} height="auto" />
```

### Icon colour

There are two types of icons: icons that do not have a palette and icons that do have a palette.

Icons that do have a palette, such as emojis, cannot be customised. Setting colour to such icons will not change anything.

Icons that do not have a palette can be customised. By default, colour is set to "currentColor", which means the icon's colour matches text colour. To change the colour you can:

-   Set `color` style or use stylesheet to target icon. If you are using the stylesheet, target `svg` element. If you are using scoped style, use `:global(svg)` to target `svg` element.
-   Add `color` attribute.

Examples:

Using `color` attribute:

```jsx
<IconifyIcon icon={alertIcon} color="red" />
<IconifyIcon icon={alertIcon} color="#f00" />
```

Using inline style:

```jsx
<Icon icon={alertIcon} style="color: red;" />
<Icon icon={alertIcon} style="color: #f00;" />
```

Using stylesheet:

```jsx
<Icon icon={alertIcon} class="red-icon" />
```

```css
.red-icon {
	color: red;
}
```

Using Svelte scoped style:

```jsx
<script>
import IconifyIcon from '@iconify/svelte';
import alertIcon from '@iconify/icons-mdi/alert';
</script>

<style>
	div :global(.red-icon) {
		color: red;
	}
</style>

<div>
    <IconifyIcon icon={alertIcon} class="red-icon" />
</div>
```

### Transformations

You can rotate and flip the icon.

This might seem redundant because icon can also be rotated and flipped using CSS transformations. So why do transformation attributes exist? Because it is a different type of transformation.

-   CSS transformations transform the entire icon.
-   Icon transformations transform the contents of the icon.

If you have a square icon, this makes no difference. However, if you have an icon that has different width and height values, it makes a huge difference.

Rotating 16x24 icon by 90 degrees results in:

-   CSS transformation keeps 16x24 bounding box, which might cause the icon to overlap text around it.
-   Icon transformation changes bounding box to 24x16, rotating content inside an icon.

_TODO: show visual example_

#### Flipping an icon

There are several attributes available to flip an icon:

-   `hFlip`: boolean attribute, flips icon horizontally.
-   `vFlip`: boolean attribute, flips icon vertically.
-   `flip`: shorthand string attribute, can flip icon horizontally and/or vertically.

Examples:

Flip an icon horizontally:

```jsx
<IconifyIcon icon={alertIcon} hFlip={true} />
<IconifyIcon icon={alertIcon} flip="horizontal" />
```

Flip an icon vertically:

```jsx
<IconifyIcon icon={alertIcon} vFlip={true} />
<IconifyIcon icon={alertIcon} flip="vertical" />
```

Flip an icon horizontally and vertically (the same as 180 degrees rotation):

```jsx
<IconifyIcon icon={alertIcon} hFlip={true} vFlip={true} />
<IconifyIcon icon={alertIcon} flip="horizontal,vertical" />
```

#### Rotating an icon

An icon can be rotated by 90, 180 and 270 degrees. Only contents of the icon are rotated.

To rotate an icon, use `rotate` attribute. Value can be a string (degrees or percentages) or a number.

Number values are 1 for 90 degrees, 2 for 180 degrees, 3 for 270 degrees.

Examples of 90 degrees rotation:

```jsx
<IconifyIcon icon={alertIcon} rotate={1} />
<IconifyIcon icon={alertIcon} rotate="90deg" />
<IconifyIcon icon={alertIcon} rotate="25%" />
```

### Alignment

Alignment matters only if you set the icon's width and height attributes that do not match the viewBox with and height.

For example, if the icon is 24x24 and you set the width to 32 and height to 24. You must set both `width` and `height` attributes for this to happen or use stylesheet to set both icon's width and height.

#### Stretching SVG

When you use incorrect width/height ratio for other images, browser stretches those images.

Unlike other images, SVG elements do not stretch. Instead, browser either adds space on sides of the icon (this is the default behaviour) or crops part of the icon.

![Stretching image and SVG](https://iconify.design/assets/images/align-img.svg)

#### Alignment attributes

You can control the behaviour of SVG when using incorrect width/height ratio by setting alignment attributes:

-   `hAlign`: string attribute to set horizontal alignment. Possible values are "left", "center" and "right".
-   `vAlign`: string attribute to set vertical alignment. Possible values are "top", "middle" and "bottom".
-   `slice`: boolean attribute. See below.
-   `align`: shorthand string attribute. Value is the combination of vertical alignment values, horizontal alignment values, "meet" (same as `slice={false}`) and "slice" (same as `slice={true}`) separated by comma.

Example of aligning an icon to the left if icon is not square:

```jsx
<IconifyIcon icon={alertIcon} width="1em" height="1em" hAlign="left" />
```

#### Slice

Slice attribute tells the browser how to deal with extra space.

By default, `slice` is disabled. The browser will scale the icon to fit the bounding box.

Example showing the icon behaviour when `slice` is disabled with various alignment values:

![SVG alignment](https://iconify.design/assets/images/align-meet.svg)

If `slice` is enabled, the browser will scale the icon to fill the bounding box and hide parts that do not fit.

Example showing the icon behaviour when `slice` is enabled with various alignment values:

![SVG alignment](https://iconify.design/assets/images/align-slice.svg)

### Inline

The icon component renders `SVG` elements. By default, `SVG` behave like images, which is different from icon fonts.

Many developers are used to working with icon fonts. Icon fonts render icons as text, not as images. Browsers align text differently than images:

-   Images are vertically aligned at baseline.
-   Text is vertically aligned slightly below baseline.

By adding `inline` attribute, icon behaves like text. In inline mode icon has vertical alignment set to "-0.125em". That puts icon just below baseline, similar to icon fonts.

Example:

```jsx
<IconifyIcon icon={alertIcon} inline={true} />
```

Visual example to show the difference between inline and block modes:

![Inline icon](https://iconify.design/assets/images/inline.png)

## Sapper

The icon component works with Sapper.

If you use the component as shown in examples above, SVG will be rendered on the server and sent to visitor as HTML code.

If you are rendering multiple identical icons, rendering them on server is not optimal. It is much better to render them once using JavaScript in browser. How to do that with this icon component? By loading both component and icon data asynchronously.

Example:

```jsx
<script>
	// Dynamically load icon component, icon data and render it on client side
	import { onMount } from 'svelte';

	let IconifyIcon;
	let postIcon;

	onMount(async () => {
		const promises = [
			import('@iconify/svelte'), // Component
			import('@iconify/icons-bi/link-45deg'), // Icon #1
		];
		const results = await Promise.all(promises);
		IconifyIcon = results[0].default; // Component
		postIcon = results[1].default; // Icon #1
	});

	export let posts;
</script>

<ul>
	{#each posts as post}
		<li>
			<svelte:component this={IconifyIcon} icon={postIcon} />
			<a rel="prefetch" href="blog/{post.slug}">{post.title}</a>
		</li>
	{/each}
</ul>
```

This example adds an icon stored in `postIcon` to every list item. If it was rendered on the server, HTML would send SVG element multiple times. But because it is rendered in the browser, icon data and component needs to be sent to the browser only once.

Instead of using `<IconifyIcon />`, you must use `<svelte:component />` to make sure component is rendered dynamically.

This example is based on the Iconify Sapper demo: https://github.com/iconify/iconify/blob/master/packages/sapper-demo/src/routes/blog/index.svelte

## Icon Sets

You can find all available icons at https://iconify.design/icon-sets/

Browse or search icons, click any icon and you will see a "Svelte" tab that will give you exact code for the Svelte component.

Import format for each icon is "@iconify/icon-{prefix}/{icon}" where {prefix} is collection prefix, and {icon} is the icon name.

Usage examples for a few popular icon sets:

### Bootstrap Icons

Package: https://www.npmjs.com/package/@iconify/icons-bi

Icons list: https://iconify.design/icon-sets/bi/

Installation:

```bash
npm install --save-dev @iconify/icons-bi
```

Usage:

```svelte
<script>
import IconifyIcon from '@iconify/svelte';
import awardIcon from '@iconify/icons-bi/award';

function handleClick() {
	alert('Award link clicked!');
}
</script>

<a
	href="# "
	on:click|preventDefault="{handleClick}"
>
    <IconifyIcon icon={awardIcon} />
</a>
```

### Remix Icons

Package: https://www.npmjs.com/package/@iconify/icons-ri

Icons list: https://iconify.design/icon-sets/ri/

Installation:

```bash
npm install --save-dev @iconify/icons-ri
```

Usage:

```html
<script>
	import IconifyIcon from '@iconify/svelte';
	import alertLine from '@iconify/icons-ri/alert-line';
</script>

<style>
	.alert {
		position: relative;
		margin: 8px;
		padding: 16px;
		padding-left: 48px;
		background: #ba3329;
		color: #fff;
		border-radius: 5px;
		float: left;
	}

	.alert + div {
		clear: both;
	}

	.alert :global(svg) {
		position: absolute;
		left: 12px;
		top: 50%;
		font-size: 24px;
		line-height: 1em;
		margin: -0.5em 0 0;
	}
</style>

<div class="alert">
	<IconifyIcon icon="{alertLine}" />
	Important notice with alert icon!
</div>
```

### Simple Icons (big collection of logos)

Package: https://www.npmjs.com/package/@iconify/icons-simple-icons

Icons list: https://iconify.design/icon-sets/simple-icons/

Installation:

```bash
npm install --save-dev @iconify/icons-simple-icons
```

Usage (in this example using string syntax):

```jsx
<script>
import IconifyIcon from '@iconify/svelte';
import mozillafirefoxIcon from '@iconify/icons-simple-icons/mozillafirefox';
</script>

<p>
    Mozilla Firefox <IconifyIcon icon={mozillafirefoxIcon} inline={true} /> is the
    best browser!
</p>

```

### Other icon sets

There are over 60 icon sets. This readme shows only a few examples. See [Iconify icon sets](http://iconify.design/icon-sets/) for a full list of available icon sets. Click any icon to see code.

## License

The Svelte component is released with MIT license.

© 2020 Vjacheslav Trushkin

See [Iconify icon sets page](https://iconify.design/icon-sets/) for list of collections and their licenses.
