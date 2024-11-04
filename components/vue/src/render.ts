import { h } from 'vue';
import type { VNode } from 'vue';
import type { IconifyIcon } from '@iconify/types';
import { mergeCustomisations } from '@iconify/utils/lib/customisations/merge';
import { flipFromString } from '@iconify/utils/lib/customisations/flip';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import { svgToURL } from '@iconify/utils/lib/svg/url';
import type {
	IconifyIconCustomisations,
	IconifyRenderMode,
	IconProps,
} from './props';
import { defaultExtendedIconCustomisations } from './props';

/**
 * Default SVG attributes
 */
const svgDefaults: Record<string, unknown> = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'role': 'img',
};

/**
 * Style modes
 */
const commonProps: Record<string, string> = {
	display: 'inline-block',
};

const monotoneProps: Record<string, string> = {
	backgroundColor: 'currentColor',
};

const coloredProps: Record<string, string> = {
	backgroundColor: 'transparent',
};

// Dynamically add common props to variables above
const propsToAdd: Record<string, string> = {
	Image: 'var(--svg)',
	Repeat: 'no-repeat',
	Size: '100% 100%',
};
const propsToAddTo: Record<string, Record<string, string>> = {
	webkitMask: monotoneProps,
	mask: monotoneProps,
	background: coloredProps,
};
for (const prefix in propsToAddTo) {
	const list = propsToAddTo[prefix];
	for (const prop in propsToAdd) {
		list[prefix + prop] = propsToAdd[prop];
	}
}

/**
 * Aliases for customisations.
 * In Vue 'v-' properties are reserved, so v-flip must be renamed
 */
const customisationAliases: Record<string, string> = {};
['horizontal', 'vertical'].forEach((prefix) => {
	const attr = prefix.slice(0, 1) + 'Flip';

	// vertical-flip
	customisationAliases[prefix + '-flip'] = attr;
	// v-flip
	customisationAliases[prefix.slice(0, 1) + '-flip'] = attr;
	// verticalFlip
	customisationAliases[prefix + 'Flip'] = attr;
});

/**
 * Interface for inline style
 * Support for strings and arrays has been removed.
 */
type VStyle = Record<string, unknown>;

/**
 * Fix size: add 'px' to numbers
 */
function fixSize(value: string): string {
	return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
}

/**
 * Render icon
 */
export const render = (
	// Icon must be validated before calling this function
	icon: Required<IconifyIcon>,

	// Partial properties
	props: IconProps
): VNode => {
	// Split properties
	const customisations = mergeCustomisations(
		defaultExtendedIconCustomisations,
		props
	);
	const componentProps = { ...svgDefaults };

	// Check mode
	const mode: IconifyRenderMode = props.mode || 'svg';

	// Copy style
	const style = {} as VStyle;
	const propsStyle = props.style;
	const customStyle =
		typeof propsStyle === 'object' && !(propsStyle instanceof Array)
			? propsStyle
			: {};

	// Get element properties
	for (let key in props) {
		const value = props[key];
		if (value === void 0) {
			continue;
		}
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'style':
			case 'onLoad':
			case 'mode':
			case 'ssr':
				break;

			// Boolean attributes
			case 'inline':
			case 'hFlip':
			case 'vFlip':
				customisations[key] =
					value === true || value === 'true' || value === 1;
				break;

			// Flip as string: 'horizontal,vertical'
			case 'flip':
				if (typeof value === 'string') {
					flipFromString(customisations, value);
				}
				break;

			// Color: override style
			case 'color':
				style.color = value;
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value === 'string') {
					customisations[key] = rotateFromString(value);
				} else if (typeof value === 'number') {
					customisations[key] = value;
				}
				break;

			// Remove aria-hidden
			case 'ariaHidden':
			case 'aria-hidden':
				// Vue transforms 'aria-hidden' property to 'ariaHidden'
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			default: {
				const alias = customisationAliases[key];
				if (alias) {
					// Aliases for boolean customisations
					if (value === true || value === 'true' || value === 1) {
						customisations[alias] = true;
					}
				} else if (defaultExtendedIconCustomisations[key] === void 0) {
					// Copy missing property if it does not exist in customisations
					componentProps[key] = value;
				}
			}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);
	const renderAttribs = item.attributes;

	// Inline display
	if (customisations.inline) {
		style.verticalAlign = '-0.125em';
	}

	if (mode === 'svg') {
		// Add style
		componentProps.style = {
			...style,
			...customStyle,
		};

		// Add icon stuff
		Object.assign(componentProps, renderAttribs);

		// Counter for ids based on "id" property to render icons consistently on server and client
		let localCounter = 0;
		let id = props.id;
		if (typeof id === 'string') {
			// Convert '-' to '_' to avoid errors in animations
			id = id.replace(/-/g, '_');
		}

		// Add innerHTML and style to props
		componentProps['innerHTML'] = replaceIDs(
			item.body,
			id ? () => id + 'ID' + localCounter++ : 'iconifyVue'
		);

		// Render icon
		return h('svg', componentProps);
	}

	// Render <span> with style
	const { body, width, height } = icon;
	const useMask =
		mode === 'mask' ||
		(mode === 'bg' ? false : body.indexOf('currentColor') !== -1);

	// Generate SVG
	const html = iconToHTML(body, {
		...renderAttribs,
		width: width + '',
		height: height + '',
	});

	// Generate style
	componentProps.style = {
		...style,
		'--svg': svgToURL(html),
		'width': fixSize(renderAttribs.width),
		'height': fixSize(renderAttribs.height),
		...commonProps,
		...(useMask ? monotoneProps : coloredProps),
		...customStyle,
	};

	return h('span', componentProps);
};
