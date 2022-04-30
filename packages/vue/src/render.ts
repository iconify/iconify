import { h } from 'vue';
import type { VNode } from 'vue';
import type { IconifyIcon } from '@iconify/types';
import type { FullIconCustomisations } from '@iconify/utils/lib/customisations';
import {
	defaults,
	mergeCustomisations,
} from '@iconify/utils/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/utils/lib/customisations/shorthand';
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
 * In Vue 'v-' properties are reserved, so v-align and v-flip must be renamed
 */
let customisationAliases = {};
['horizontal', 'vertical'].forEach((prefix) => {
	['Align', 'Flip'].forEach((suffix) => {
		const attr = prefix.slice(0, 1) + suffix;
		const value = {
			attr,
			boolean: suffix === 'Flip',
		};

		// vertical-align
		customisationAliases[prefix + '-' + suffix.toLowerCase()] = value;
		// v-align
		customisationAliases[prefix.slice(0, 1) + '-' + suffix.toLowerCase()] =
			value;
		// verticalAlign
		customisationAliases[prefix + suffix] = value;
	});
});

/**
 * Interface for inline style
 * Support for strings and arrays has been removed.
 */
type VStyle = Record<string, unknown>;

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
		defaults,
		props as IconifyIconCustomisations
	) as FullIconCustomisations;
	const componentProps = { ...svgDefaults };

	// Check mode
	const mode: IconifyRenderMode = props.mode || 'svg';

	// Copy style
	const style: VStyle = {};
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

			// Alignment as string
			case 'align':
				if (typeof value === 'string') {
					alignmentFromString(customisations, value);
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

			default:
				if (customisationAliases[key] !== void 0) {
					// Aliases for customisations
					if (
						customisationAliases[key].boolean &&
						(value === true || value === 'true' || value === 1)
					) {
						// Check for boolean
						customisations[customisationAliases[key].attr] = true;
					} else if (
						!customisationAliases[key].boolean &&
						typeof value === 'string' &&
						value !== ''
					) {
						// String
						customisations[customisationAliases[key].attr] = value;
					}
				} else if (defaults[key] === void 0) {
					// Copy missing property if it does not exist in customisations
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);
	const renderAttribs = item.attributes;

	// Inline display
	if (item.inline) {
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
		'width': renderAttribs.width,
		'height': renderAttribs.height,
		...commonProps,
		...(useMask ? monotoneProps : coloredProps),
		...customStyle,
	};

	return h('span', componentProps);
};
