# Iconify Icon for Solid

Iconify Icon web component is a wrapper for `iconify-icon` package, which provides SolidJS component and typings.

For more information about Iconify project visit [https://iconify.design/](https://iconify.design/).

For documentation visit [Iconify Icon web component documentation](https://iconify.design/docs/iconify-icon/).

## Installation

If you are using NPM:

```bash
npm install --save-dev @iconify-icon/solid
```

If you are using Yarn:

```bash
yarn add --dev @iconify-icon/solid
```

## Usage

Install `@iconify-icon/solid` and import `Icon` from it:

```typescript
import { Icon } from '@iconify-icon/solid';
```

Then use `Icon` component with icon name or data as "icon" parameter:

```jsx
<Icon icon="mdi-light:home" />
```

Component will automatically retrieve data for "mdi-light:home" from Iconify API and render it. There are over 200,000 icons available on Iconify API from various free and open source icon sets, including all the most popular icon sets.

## Offline usage

Iconify Icon web component is designed to be used with Iconify API, loading icon data on demand instead of bundling it..

If you want to use icons without Iconify API, [there are many other options available](https://iconify.design/docs/usage/).

## Icon Names

Icon name is a string. Few examples:

-   `@api-provider:icon-set-prefix:icon-name`
-   `mdi-light:home` (in this example API provider is empty, so it is skipped)

It has 3 parts, separated by ":":

-   provider points to API source. Starts with "@", can be empty (empty value is used for public Iconify API).
-   prefix is name of icon set.
-   name is name of icon.

See [icon names documentation](https://iconify.design/docs/iconify-icon/icon-name.html) for more detailed explanation.

## Using icon data

Instead of icon name, you can pass icon data to component:

```jsx
import { Icon } from '@iconify-icon/solid';
import home from '@iconify-icons/mdi-light/home';

function renderHomeIcon() {
	return <Icon icon={home} />;
}
```

See [icon packages documentation](https://iconify.design/docs/icons/) for more details.

## Icon component properties

`icon` property is mandatory. It tells component what icon to render. The value can be a string containing the icon name or an object containing the icon data.

The icon component has the following optional properties:

-   `inline`. Adds `vertical-align: -0.125em` to style to render it below text baseline, so it fits nicely in text.
-   `width` and `height`. Icon dimensions. The default values are "1em" for both. See "Dimensions" section below.
-   `color`. Icon colour. This is the same as setting colour in style. See "Icon colour" section below.
-   `flip`. Flip icon horizontally and/or vertically. See "Transformations" section below.
-   `rotate`. Rotate icon by 90, 180 or 270 degrees. See "Transformations" section below.

### Other properties and events

In addition to the properties mentioned above, the icon component accepts any other properties and events.

### Dimensions

By default, icon height is "1em". With is dynamic, calculated using the icon's width to height ratio. This makes it easy to change icon size by changing `font-size` in the stylesheet, just like icon fonts.

There are several ways to change icon dimensions:

-   Setting `font-size` in style (or `fontSize` if you are using inline style).
-   Setting `width` and/or `height` property.
-   Setting `height="none"` to remove dimensions from SVG and using CSS to resize icon.

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
<Icon icon={homeIcon} height="24" />
```

```jsx
<Icon icon="mdi-light:home" width="16" height={'16'} />
```

#### Dimensions as strings with units

You can use units in width and height values:

```jsx
<Icon icon="mdi-light:home" height="2em" />
```

Be careful when using `calc`, view port based units or percentages. In SVG element they might not behave the way you expect them to behave and when using such units, you should consider settings both width and height. Use `height="none"` and control dimensions with CSS instead (see below).

#### Dimensions as 'auto'

Keyword "auto" sets dimensions to the icon's `viewBox` dimensions. For example, for 24 x 24 icon using `height="auto"` sets height to 24 pixels.

```jsx
<Icon icon="mdi-light:home" height="auto" />
```

#### Dimensions with CSS

If you want to control icon dimensions with CSS, do the following:

-   Set `height` attribute to `none` or `unset`, which will remove attribute from rendered SVG.
-   In CSS or inline style set both `width` and `height` for iconify-icon.

```jsx
<Icon icon="mdi-light:home" height="none" style={{width: '40px'; height: '40px'}} />
```

This allows easily changing width and height separately in CSS instead of relying on font-size. In some use cases you might need to add `display: block;` to CSS.

### Icon colour

There are two types of icons: icons that do not have a palette and icons that do have a palette.

Icons that do have a palette, such as emojis, cannot be customised. Setting colour to such icons will not change anything.

Icons that do not have a palette can be customised. By default, colour is set to "currentColor", which means the icon's colour matches text colour. To change the colour you need to change text color.

Examples:

```jsx
<Icon icon="eva:alert-triangle-fill" style={{color: 'red'}} />
<Icon icon="eva:alert-triangle-fill" style={{color: '#f00'}} />
```

Using stylesheet:

```jsx
<Icon icon="eva:alert-triangle-fill" className="red-icon" />
```

```css
.red-icon {
	color: red;
}
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

See [icon transformations documentation](https://iconify.design/docs/iconify-icon/transform.html) for more details.

#### Flipping an icon

You can flip an icon horizontally and/or vertically by setting `flip` property.

Examples:

Flip an icon horizontally:

```jsx
<Icon icon="eva:alert-triangle-fill" flip="horizontal" />
```

Flip an icon vertically:

```jsx
<Icon icon="eva:alert-triangle-fill" flip="vertical" />
```

Flip an icon horizontally and vertically (the same as 180 degrees rotation):

```jsx
<Icon icon="eva:alert-triangle-fill" flip="horizontal,vertical" />
```

#### Rotating an icon

An icon can be rotated by 90, 180 and 270 degrees. Only contents of the icon are rotated.

To rotate an icon, use `rotate` property. Value can be a string (degrees or percentages) or a number.

Number values are 1 for 90 degrees, 2 for 180 degrees, 3 for 270 degrees.

Examples of 90 degrees rotation:

```jsx
<Icon icon="eva:alert-triangle-fill" rotate={1} />
<Icon icon="eva:alert-triangle-fill" rotate="90deg" />
<Icon icon="eva:alert-triangle-fill" rotate="25%" />
```

## Full documentation

For extended documentation visit [Iconify Icon web component documentation](https://iconify.design/docs/iconify-icon/).

## License

SolidJS component is released with MIT license.

© 2022-PRESENT Vjacheslav Trushkin

See [Iconify icon sets page](https://icon-sets.iconify.design/) for list of icon sets and their licenses.
