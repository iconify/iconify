# Iconify for Vue

Iconify for Vue is not yet another icon component! There are many of them already.

Iconify is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 80+ icon sets with 60,000 icons.
-   Embed icons in HTML with SVG framework or components for front-end frameworks.
-   Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
-   Add icon search to your applications with Iconify Icon Finder.

For more information visit [https://iconify.design/](https://iconify.design/).

Iconify for Vue is a part of Iconify framework that makes it easy to use many icon libraries with Vue.

Iconify for Vue features:

-   Easy to use.
-   Bundles only icons that you need.
-   Change icon size and colour by changing font size and colour.
-   Renders pixel-perfect SVG.

## Installation

If you are using NPM:

```bash
npm install --save-dev @iconify/vue
```

If you are using Yarn:

```bash
yarn add --dev @iconify/vue
```

This package does not include icons. Icons are split into separate packages that available at NPM. See below.

### Vue 2 compatibility

This component is not backwards compatible with Vue 2.

If you are using Vue 2, you need to install version 1.0 of Iconify component.

See [Vue 2 component](https://github.com/iconify/iconify/tree/master/archive/vue2) for details.

## Usage

Install `@iconify/vue` and packages for selected icon sets. Import component from `@iconify/vue` and icon data for the icon you want to use:

```js
import { Icon } from '@iconify/vue';
import home from '@iconify-icons/mdi/home';
import faceWithMonocle from '@iconify-icons/twemoji/face-with-monocle';
```

Then you need to add component and icon.

There are two ways to use an icon: by icon name that you assign or by icon object.

### Object syntax

Object syntax passes icon data to the component.

```vue
<template>
	<iconify-icon :icon="icons.chart" height="24" />
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import areaChartOutlined from '@iconify-icons/ant-design/area-chart-outlined';

export default Vue.extend({
	components: {
		IconifyIcon,
	},
	data() {
		return {
			icons: {
				chart: areaChartOutlined,
			},
		};
	},
});
</script>
```

The icon must be included in `data` function, so it could be referenced in the template.

The same example without TypeScript:

```vue
<template>
	<iconify-icon :icon="icons.chart" height="24" :style="{ color: 'green' }" />
</template>

<script>
import IconifyIcon from '@iconify/vue';
import areaChartOutlined from '@iconify-icons/ant-design/area-chart-outlined';

export default {
	components: {
		IconifyIcon,
	},
	data() {
		return {
			icons: {
				chart: areaChartOutlined,
			},
		};
	},
};
</script>
```

### String syntax

String syntax passes icon name to the component.

With this method the icon needs to be added only once. That means if you have multiple components using 'chart' icon, you can add it only in your main component. This makes it easy to swap icons for an entire application.

```vue
<template>
	<iconify-icon icon="chart" height="24" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import areaChartOutlined from '@iconify-icons/ant-design/area-chart-outlined';

IconifyIcon.addIcon('chart', areaChartOutlined);

export default Vue.extend({
	components: {
		IconifyIcon,
	},
});
</script>
```

The icon must be registered using `addIcon` function of the component. You can assign any name to the icon.

The same example without TypeScript:

```vue
<template>
	<iconify-icon icon="chart" height="24" />
</template>

<script>
import IconifyIcon from '@iconify/vue';
import areaChartOutlined from '@iconify-icons/ant-design/area-chart-outlined';

IconifyIcon.addIcon('chart', areaChartOutlined);

export default {
	components: {
		IconifyIcon,
	},
};
</script>
```

## Component installation

You can install the icon component using `Vue.use()`, then you will no longer need to add it to every component that uses icons.

```js
import IconifyIcon from '@iconify/vue';

Vue.use(IconifyIcon);
```

If you are using TypeScript with Vue, it becomes a bit more complex. You need to import type `PluginObject` from Vue and do some shenanigans with type casting:

```ts
import { PluginObject } from 'vue';
import IconifyIcon from '@iconify/vue';

Vue.use((IconifyIcon as unknown) as PluginObject<unknown>);
```

After installing the icon component, you no longer need to list `IconifyIcon` in components list every time you use it.

## Icon component properties

`icon` property is mandatory. It tells component what icon to render. If the property value is invalid, the component will render an empty icon. The value can be a string containing the icon name (icon must be registered before use by calling `addIcon`, see instructions above) or an object containing the icon data.

The icon component has the following optional properties:

-   `inline`. Changes icon behaviour to match icon fonts. See "Inline icon" section below.
-   `width` and `height`. Icon dimensions. The default values are "1em" for both. See "Dimensions" section below.
-   `color`. Icon colour. This is the same as setting colour in style. See "Icon colour" section below.
-   `flip`, `horizontalFlip`, `verticalFlip`. Flip icon horizontally and/or vertically. See "Transformations" section below.
-   `rotate`. Rotate icon by 90, 180 or 270 degrees. See "Transformations" section below.
-   `align`, `verticalAlign`, `horizontalAlign`, `slice`. Icon alignment. See "Alignment" section below.

Note: in templates you can use "camelCase" properties as "kebab-case". For example, `hFlip` can be used as `h-flip`.

### Other properties and events

In addition to the properties mentioned above, the icon component accepts any other properties and events. All other properties and events will be passed to generated `SVG` element, so you can do stuff like assigning click event, setting the inline style, create element reference, add title and so on.

### Dimensions

By default, icon height is "1em". With is dynamic, calculated using the icon's width to height ratio.

There are several ways to change icon dimensions:

-   Setting `font-size` in style.
-   Setting `width` and/or `height` property.

Values for `width` and `height` can be numbers or strings.

If you set only one dimension, another dimension will be calculated using the icon's width to height ratio. For example, if the icon size is 16 x 24, you set the height to 48, the width will be set to 32. Calculations work not only with numbers, but also with string values.

#### Dimensions as numbers

You can use numbers for `width` and `height`.

```html
<iconify-icon icon="experiment" :height="24" />
```

```html
<iconify-icon icon="experiment" :width="16" :height="16" />
```

Note ":" before attribute - in Vue it changes the value to expression, so "20" is a number, not a string.

Number values are treated as pixels. That means in examples above, values are identical to "24px" and "16px".

#### Dimensions as strings without units

If you use strings without units, they are treated the same as numbers in an example above.

```html
<iconify-icon icon="experiment" height="24" />
```

```html
<iconify-icon icon="experiment" width="16" height="16" />
```

#### Dimensions as strings with units

You can use units in width and height values:

```html
<iconify-icon icon="experiment" height="2em" />
```

Be careful when using `calc`, view port based units or percentages. In SVG element they might not behave the way you expect them to behave and when using such units, you should consider settings both width and height.

#### Dimensions as 'auto'

Keyword "auto" sets dimensions to the icon's `viewBox` dimensions. For example, for 24 x 24 icon using `height="auto"` sets height to 24 pixels.

```html
<iconify-icon icon="experiment" height="auto" />
```

### Icon colour

There are two types of icons: icons that do not have a palette and icons that do have a palette.

Icons that do have a palette, such as emojis, cannot be customised. Setting colour to such icons will not change anything.

Icons that do not have a palette can be customised. By default, colour is set to "currentColor", which means the icon's colour matches text colour. To change the colour you can:

-   Set `color` style or use stylesheet to target icon. If you are using the stylesheet, target `svg` element, not `iconify-icon`.
-   Add `color` property.

Examples:

Using `color` property:

```html
<iconify-icon icon="experiment" color="red" />
<iconify-icon icon="experiment" color="#f00" />
```

Using inline style:

```html
<iconify-icon icon="experiment" style="color: red;" />
<iconify-icon icon="experiment" :style="{color: 'red'}" />
<iconify-icon icon="experiment" :style="{color: '#f00'}" />
```

Using stylesheet:

```vue
<template>
	<iconify-icon icon="experiment" class="red-icon" />
</template>

<style>
.red-icon {
	color: red;
}
</style>
```

### Transformations

You can rotate and flip the icon.

This might seem redundant because icon can also be rotated and flipped using CSS transformations. So why do transformation properties exist? Because it is a different type of transformation.

-   CSS transformations transform the entire icon.
-   Icon transformations transform the contents of the icon.

If you have a square icon, this makes no difference. However, if you have an icon that has different width and height values, it makes a huge difference.

Rotating 16x24 icon by 90 degrees results in:

-   CSS transformation keeps 16x24 bounding box, which might cause the icon to overlap text around it.
-   Icon transformation changes bounding box to 24x16, rotating content inside an icon.

_TODO: show visual example_

#### Flipping an icon

There are several properties available to flip an icon:

-   `horizontal-flip` or `h-flip`: boolean property, flips icon horizontally.
-   `vertical-flip` or `v-flip`: boolean property, flips icon vertically.
-   `flip`: shorthand string property, can flip icon horizontally and/or vertically.

Examples:

Flip an icon horizontally:

```html
<iconify-icon icon="experiment" :h-flip="true" />
<iconify-icon icon="experiment" :horizontal-flip="true" />
<iconify-icon icon="experiment" flip="horizontal" />
```

Flip an icon vertically:

```html
<iconify-icon icon="experiment" :v-flip="true" />
<iconify-icon icon="experiment" :vertical-flip="true" />
<iconify-icon icon="experiment" flip="vertical" />
```

Flip an icon horizontally and vertically (the same as 180 degrees rotation):

```html
<iconify-icon icon="experiment" :h-flip="true" :v-flip="true" />
<iconify-icon icon="experiment" :horizontal-flip="true" :vertical-flip="true" />
<iconify-icon icon="experiment" flip="horizontal,vertical" />
```

Why are there multiple boolean properties for flipping an icon? See "Alignment" section below for the explanation.

#### Rotating an icon

An icon can be rotated by 90, 180 and 270 degrees. Only contents of the icon are rotated.

To rotate an icon, use `rotate` property. Value can be a string (degrees or percentages) or a number.

Number values are 1 for 90 degrees, 2 for 180 degrees, 3 for 270 degrees.

Examples of 90 degrees rotation:

```html
<iconify-icon icon="experiment" :rotate="1" />
<iconify-icon icon="experiment" rotate="90deg" />
<iconify-icon icon="experiment" rotate="25%" />
```

### Alignment

Alignment matters only if you set the icon's width and height properties that do not match the viewBox with and height.

For example, if the icon is 24x24 and you set the width to 32 and height to 24. You must set both `width` and `height` properties for this to happen or use stylesheet to set both icon's width and height.

#### Stretching SVG

When you use incorrect width/height ratio for other images, browser stretches those images.

Unlike other images, SVG elements do not stretch. Instead, browser either adds space on sides of the icon (this is the default behaviour) or crops part of the icon.

![Stretching image and SVG](https://iconify.design/assets/images/align-img.svg)

#### Alignment properties

You can control the behaviour of SVG when using incorrect width/height ratio by setting alignment properties:

-   `horizontal-align` or `h-align`: string property to set horizontal alignment. Possible values are "left", "center" and "right".
-   `vertical-align` or `v-align`: string property to set vertical alignment. Possible values are "top", "middle" and "bottom".
-   `slice`: boolean property. See below.
-   `align`: shorthand string property. Value is the combination of vertical alignment values, horizontal alignment values, "meet" (same as `:slice="false"`) and "slice" (same as `:slice="true"`) separated by comma.

Why are there aliases for `h-align` and `v-align` properties? Because in Vue properties that start with `v-` are treated as directives. It is possible to use `v-align` property using a weird syntax (see example below), but it is much cleaner to have a different name for that property, so that is why Vue component has aliases for those properties. For more consistent properties, similar aliases were added to `h-flip` and `v-flip` properties.

Example of aligning an icon to the left if icon is not square:

```html
<iconify-icon icon="experiment" width="1em" height="1em" h-align="left" />
```

#### Slice

Slice property tells the browser how to deal with extra space.

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

By adding `inline` property, icon behaves like text. In inline mode icon has vertical alignment set to "-0.125em". That puts icon just below baseline, similar to icon fonts.

Example:

```html
<iconify-icon icon="experiment" :inline="true" />
```

Value is boolean, therefore ":" must be added before property name, changing the value from string to expression.

Visual example to show the difference between inline and block modes:

![Inline icon](https://iconify.design/assets/images/inline.png)

## Icon Sets

You can find all available icons at https://iconify.design/icon-sets/

Browse or search icons, click any icon and you will see a "Vue" tab that will give you exact code for the Vue component.

Import format for each icon is "@iconify-icons/{prefix}/{icon}" where {prefix} is collection prefix, and {icon} is the icon name.

Usage examples for a few popular icon sets:

### Material Design Icons

Package: https://www.npmjs.com/package/@iconify-icons/mdi

Icons list: https://iconify.design/icon-sets/mdi/

Installation:

```bash
npm install --save-dev @iconify-icons/mdi
```

Usage (in this example using object syntax):

```vue
<template>
	<iconify-icon :icon="icons.account" />
	<iconify-icon :icon="icons.home" />
</template>

<script>
import IconifyIcon from '@iconify/vue';
import homeIcon from '@iconify-icons/mdi/home';
import accountIcon from '@iconify-icons/mdi/account';

export default {
	components: {
		IconifyIcon,
	},
	data() {
		return {
			icons: {
				home: homeIcon,
				account: accountIcon,
			},
		};
	},
};
</script>
```

### Simple Icons (big collection of logos)

Package: https://www.npmjs.com/package/@iconify-icons/simple-icons

Icons list: https://iconify.design/icon-sets/simple-icons/

Installation:

```bash
npm install --save-dev @iconify-icons/simple-icons
```

Usage (in this example using string syntax):

```vue
<template>
	<p>
		Mozilla Firefox <iconify-icon icon="firefox" :inline="true" /> is the
		best browser!
	</p>
</template>

<script>
import IconifyIcon from '@iconify/vue';
import mozillafirefoxIcon from '@iconify-icons/simple-icons/mozillafirefox';

IconifyIcon.addIcon('firefox', mozillafirefoxIcon);

export default {
	components: {
		IconifyIcon,
	},
};
</script>
```

### DashIcons

Package: https://www.npmjs.com/package/@iconify-icons/dashicons

Icons list: https://iconify.design/icon-sets/dashicons/

Installation:

```bash
npm install --save-dev @iconify-icons/dashicons
```

Usage (in this example using object syntax with TypeScript):

```vue
<template>
	<p>
		<iconify-icon :icon="icons.rotate" />
		Rotate!
	</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import imageRotate from '@iconify-icons/dashicons/image-rotate';

export default Vue.extend({
	components: {
		IconifyIcon,
	},
	data() {
		return {
			icons: {
				rotate: imageRotate,
			},
		};
	},
});
</script>
<style scoped>
p {
	font-size: 16px;
	line-height: 20px;
}
svg {
	font-size: 20px;
	line-height: 1;
	vertical-align: -0.25em; /* moves icon 5px below baseline */
}
</style>
```

### OpenMoji

Package: https://www.npmjs.com/package/@iconify-icons/openmoji

Icons list: https://iconify.design/icon-sets/openmoji/

Installation:

```bash
npm install --save-dev @iconify-icons/openmoji
```

Usage:

Usage (in this example using string syntax with TypeScript):

```vue
<template>
	<p>
		<iconify-icon icon="autonomous-car" /> Autonomous cars are the future!
	</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import autonomousCar from '@iconify-icons/openmoji/autonomous-car';
import exhaustGasesCar from '@iconify-icons/openmoji/exhaust-gases-car';

IconifyIcon.addIcon('autonomous-car', autonomousCar);
IconifyIcon.addIcon('gas-car', exhaustGasesCar);

export default Vue.extend({
	components: {
		IconifyIcon,
	},
});
</script>
<style scoped>
p {
	font-size: 16px;
	line-height: 20px;
}
svg {
	font-size: 20px;
	line-height: 1;
	vertical-align: -0.25em; /* moves icon 5px below baseline */
}
</style>
```

### Other icon sets

There are over 60 icon sets. This readme shows only a few examples. See [Iconify icon sets](http://iconify.design/icon-sets/) for a full list of available icon sets. Click any icon to see code.

## License

Vue component is released with MIT license.

© 2020 Iconify OÜ

See [Iconify icon sets page](https://iconify.design/icon-sets/) for list of collections and their licenses.
