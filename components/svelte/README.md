# Iconify for Svelte

Iconify for Svelte is not yet another icon component! There are many of them already.

What you get with other components:

-   Limited set of icons.
-   Large bundle size because all icons are bundled.

Iconify icon component is nothing like that. Component does not include any icon data, it is not tied to any specific icon set. Instead, all data is retrieved from public API on demand.

That means:

-   One syntax for over 200,000 icons from 150+ icon sets.
-   Renders SVG. Many components simply render icon fonts, which look ugly. Iconify renders pixel perfect SVG.
-   Loads icons on demand. No need to bundle icons, component will automatically load icon data for icons that you use from Iconify API.

For more information about Iconify project visit [https://iconify.design/](https://iconify.design/).

For extended documentation visit [Iconify for Svelte documentation](https://iconify.design/docs/icon-components/svelte/).

## Installation

If you are using NPM:

```bash
npm install --save-dev @iconify/svelte
```

If you are using Yarn:

```bash
yarn add --dev @iconify/svelte
```

## Usage with API

Install `@iconify/svelte` and import `Icon` as default export from it:

```js
import Icon from '@iconify/svelte';
```

Then use component with icon data as "icon" parameter:

```jsx
<Icon icon="mdi-light:home" />
```

Component will automatically retrieve data for "mdi-light:home" from Iconify API and render it. There are over 200,000 icons available on Iconify API from various free and open source icon sets, including all the most popular icon sets.

## Offline usage

This icon component is designed to be used with Iconify API, loading icon data on demand instead of bundling it.

If you want to use icons without Iconify API, [there are many other options available](https://iconify.design/docs/usage/).

## Web component

If you are experiencing issues with SSR hydration, there is an alternative solution available: [Iconify Icon web component](https://iconify.design/docs/iconify-icon/).

Web component is preferred to this component if:

-   Your page is performing slowly. Web component separates icon rendering in shadow DOM, improving performance.
-   You are experiencing CSS conflicts.

## Icon Names

Icon name is a string. Few examples:

-   `@api-provider:icon-set-prefix:icon-name`
-   `mdi-light:home` (in this example API provider is empty, so it is skipped)

It has 3 parts, separated by ":":

-   provider points to API source. Starts with "@", can be empty (empty value is used for public Iconify API).
-   prefix is name of icon set.
-   name is name of icon.

See [Iconify for Svelte icon names documentation](https://iconify.design/docs/icon-components/svelte/icon-name.html) for more detailed explanation.

## Using icon data

Instead of icon name, you can pass icon data to component:

```jsx
import Icon from '@iconify/svelte';
import home from '@iconify-icons/mdi-light/home';

function renderHomeIcon() {
	return <Icon icon={home} />;
}
```

See [icon packages documentation](https://iconify.design/docs/icons/) for more details.

### ES / CommonJS packages

Example above might currently fail with some use cases. Package `@iconify-icons/mdi-light` uses ES modules that some software might not support yet. But do not worry, there is a simple solution: switch to CommonJS icon packages.

To switch to CommonJS package, replace this line in example above:

```js
import home from '@iconify-icons/mdi-light/home';
```

with

```js
import home from '@iconify/icons-mdi-light/home';
```

All icons are available as ES modules for modern bundler and as CommonJS modules for outdated bundlers. ES modules use format `@iconify-icons/{prefix}`, CommonJS modules use `@iconify/icons-{prefix}`.

For more details, see [icon packages documentation](https://iconify.design/docs/icons/).

## Vertical alignment

Icons have 2 modes: inline and block. Difference between modes is `vertical-align` that is added to inline icons.

Inline icons are aligned slightly below baseline, so they look centred compared to text, like glyph fonts.

Block icons do not have alignment, like images, which aligns them to baseline by default.

Alignment option was added to make icons look like continuation of text, behaving like glyph fonts. This should make migration from glyph fonts easier.

To toggle between block and inline modes, you can either boolean `inline` property.

```svelte
<script>
	import Icon from '@iconify/svelte';
</script>

<p>
	Block:
	<Icon icon="line-md:image-twotone" />
	<Icon icon="mdi:account-box-outline" />
</p>
<p>
	Inline:
	<Icon icon="line-md:image-twotone" inline={true} />
	<Icon icon="mdi:account-box-outline" inline={true} />
</p>
```

Visual example to show the difference between inline and block modes:

![Inline icon](https://iconify.design/assets/images/inline.png)

## Icon component attributes

`icon` attribute is mandatory. It tells component what icon to render. If the attribute value is invalid, the component will render an empty icon. The value must be an object containing the icon data.

The icon component has the following optional attributes:

-   `inline`. Changes icon behaviour to match icon fonts. See "Inline icon" section below.
-   `width` and `height`. Icon dimensions. The default values are "1em" for both. See "Dimensions" section below.
-   `color`. Icon colour. This is the same as setting colour in style. See "Icon colour" section below.
-   `flip`, `hFlip`, `vFlip`. Flip icon horizontally and/or vertically. See "Transformations" section below.
-   `rotate`. Rotate icon by 90, 180 or 270 degrees. See "Transformations" section below.
-   `align`, `vAlign`, `hAlign`, `slice`. Icon alignment. See "Alignment" section below.
-   `onLoad`. Callback function that is called when icon data has been loaded. See "onLoad" section below.

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
<Icon icon={homeIcon} height={24} />
```

```jsx
<Icon icon="mdi-light:home" width={16} height={16} />
```

Number values are treated as pixels. That means in examples above, values are identical to "24px" and "16px".

#### Dimensions as strings without units

If you use strings without units, they are treated the same as numbers in an example above.

```jsx
<Icon icon="mdi-light:home" height="24" />
```

#### Dimensions as strings with units

You can use units in width and height values:

```jsx
<Icon icon="mdi-light:home" height="2em" />
```

Be careful when using `calc`, view port based units or percentages. In SVG element they might not behave the way you expect them to behave and when using such units, you should consider settings both width and height.

#### Dimensions as 'auto'

Keyword "auto" sets dimensions to the icon's `viewBox` dimensions. For example, for 24 x 24 icon using `height="auto"` sets height to 24 pixels.

```jsx
<Icon icon="mdi-light:home" height="auto" />
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
<Icon icon="eva:alert-triangle-fill" color="red" />
<Icon icon="eva:alert-triangle-fill" color="#f00" />
```

Using inline style:

```jsx
<Icon icon="eva:alert-triangle-fill" style="color: red;" />
<Icon icon="eva:alert-triangle-fill" style="color: #f00;" />
```

Using stylesheet:

```jsx
<Icon icon="eva:alert-triangle-fill" class="red-icon" />
```

```css
.red-icon {
	color: red;
}
```

Using Svelte scoped style:

```jsx
<script>
import Icon from '@iconify/svelte';
import alertIcon from '@iconify-icons/mdi/alert';
</script>

<style>
	div :global(.red-icon) {
		color: red;
	}
</style>

<div>
    <Icon icon={alertIcon} class="red-icon" />
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

See [icon transformations documentation](https://iconify.design/docs/icon-components/svelte/transform.html) for more details.

#### Flipping an icon

There are several attributes available to flip an icon:

-   `hFlip`: boolean attribute, flips icon horizontally.
-   `vFlip`: boolean attribute, flips icon vertically.
-   `flip`: shorthand string attribute, can flip icon horizontally and/or vertically.

Examples:

Flip an icon horizontally:

```jsx
<Icon icon="eva:alert-triangle-fill" hFlip={true} />
<Icon icon="eva:alert-triangle-fill" flip="horizontal" />
```

Flip an icon vertically:

```jsx
<Icon icon="eva:alert-triangle-fill" vFlip={true} />
<Icon icon="eva:alert-triangle-fill" flip="vertical" />
```

Flip an icon horizontally and vertically (the same as 180 degrees rotation):

```jsx
<Icon icon="eva:alert-triangle-fill" hFlip={true} vFlip={true} />
<Icon icon="eva:alert-triangle-fill" flip="horizontal,vertical" />
```

#### Rotating an icon

An icon can be rotated by 90, 180 and 270 degrees. Only contents of the icon are rotated.

To rotate an icon, use `rotate` attribute. Value can be a string (degrees or percentages) or a number.

Number values are 1 for 90 degrees, 2 for 180 degrees, 3 for 270 degrees.

Examples of 90 degrees rotation:

```jsx
<Icon icon="eva:alert-triangle-fill" rotate={1} />
<Icon icon="eva:alert-triangle-fill" rotate="90deg" />
<Icon icon="eva:alert-triangle-fill" rotate="25%" />
```

### onLoad

`onLoad` property is an optional callback function. It is called when icon data has been loaded.

It is not an event, such as `onClick` event for links, it is a simple callback function.

When `onLoad` is called:

-   If value of icon property is an object, `onLoad` is not called.
-   If value of icon property is a string and icon data is available, `onLoad` is called on first render.
-   If value of icon property is a string and icon data is not available, `onLoad` is called on first re-render after icon data is retrieved from API.

What is the purpose of `onLoad`? To let you know when Icon component renders an icon and when it does not render anything. This allows you to do things like adding class name for parent element, such as "container--with-icon" that modify layout if icon is being displayed.

## Sapper

The icon component works with Sapper.

If you use the component as shown in examples above, SVG will be rendered on the server and sent to visitor as HTML code.

If you are rendering multiple identical icons, rendering them on server is not optimal. It is much better to render them once using JavaScript in browser. How to do that with this icon component? By loading both component and icon data asynchronously.

Example:

```jsx
<script>
	// Dynamically load icon component, icon data and render it on client side
	import { onMount } from 'svelte';

	let Icon;
	let postIcon;

	onMount(async () => {
		const promises = [
			import('@iconify/svelte'), // Component
			import('@iconify-icons/bi/link-45deg'), // Icon #1
		];
		const results = await Promise.all(promises);
		Icon = results[0].default; // Component
		postIcon = results[1].default; // Icon #1
	});

	export let posts;
</script>

<ul>
	{#each posts as post}
		<li>
			<svelte:component this={Icon} icon={postIcon} />
			<a rel="prefetch" href="blog/{post.slug}">{post.title}</a>
		</li>
	{/each}
</ul>
```

This example adds an icon stored in `postIcon` to every list item. If it was rendered on the server, HTML would send SVG element multiple times. But because it is rendered in the browser, icon data and component needs to be sent to the browser only once.

Instead of using `<Icon />`, you must use `<svelte:component />` to make sure component is rendered dynamically.

## Full documentation

For extended documentation visit [Iconify for Svelte documentation](https://iconify.design/docs/icon-components/svelte/).

## License

The Svelte component is released with MIT license.

© 2020-PRESENT Vjacheslav Trushkin

See [Iconify icon sets page](https://icon-sets.iconify.design/) for list of collections and their licenses.
