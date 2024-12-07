import { createElement } from 'react';
import type { SVGProps, CSSProperties, JSX } from 'react';
import type { IconifyIcon } from '@iconify/types';
import { mergeCustomisations } from '@iconify/utils/lib/customisations/merge';
import { flipFromString } from '@iconify/utils/lib/customisations/flip';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import { svgToURL } from '@iconify/utils/lib/svg/url';
import { cleanUpInnerHTML } from '@iconify/utils/lib/svg/inner-html';
import type {
	IconifyIconCustomisations,
	IconifyRenderMode,
	IconProps,
} from './props';
import { defaultExtendedIconCustomisations } from './props';
import { stringToIcon } from '@iconify/utils/lib/icon/name';

/**
 * Default SVG attributes
 */
const svgDefaults: SVGProps<SVGSVGElement> = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlnsXlink': 'http://www.w3.org/1999/xlink',
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
	WebkitMask: monotoneProps,
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
 * Default values for customisations for inline icon
 */
const inlineDefaults: Required<IconifyIconCustomisations> = {
	...defaultExtendedIconCustomisations,
	inline: true,
};

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
	props: IconProps,

	// Icon name
	name?: string
): JSX.Element => {
	// Get default properties
	const defaultProps = props.inline
		? inlineDefaults
		: defaultExtendedIconCustomisations;

	// Get all customisations
	const customisations = mergeCustomisations(defaultProps, props);

	// Check mode
	const mode: IconifyRenderMode = props.mode || 'svg';

	// Create style
	const style: CSSProperties = {};
	const customStyle = props.style || {};

	// Create SVG component properties
	const componentProps = {
		...(mode === 'svg' ? svgDefaults : {}),
	};
	if (name) {
		const iconName = stringToIcon(name, false, true);
		if (iconName) {
			const classNames: string[] = ['iconify'];
			const props: (keyof typeof iconName)[] = [
				'provider',
				'prefix',
			] as const;
			for (const prop of props) {
				if (iconName[prop]) {
					classNames.push('iconify--' + iconName[prop]);
				}
			}
			componentProps.className = classNames.join(' ');
		}
	}

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
			case 'children':
			case 'onLoad':
			case 'mode':
			case 'ssr':
				break;

			// Forward ref
			case '_ref':
				componentProps.ref = value;
				break;

			// Merge class names
			case 'className':
				componentProps[key] =
					(componentProps[key] ? componentProps[key] + ' ' : '') +
					value;
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

			// Color: copy to style
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
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			// Copy missing property if it does not exist in customisations
			default:
				if (defaultProps[key] === void 0) {
					componentProps[key] = value;
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

		// Add icon stuff
		componentProps.dangerouslySetInnerHTML = {
			__html: cleanUpInnerHTML(
				replaceIDs(
					item.body,
					id ? () => id + 'ID' + localCounter++ : 'iconifyReact'
				)
			),
		};
		return createElement('svg', componentProps);
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
	} as CSSProperties;

	return createElement('span', componentProps);
};
