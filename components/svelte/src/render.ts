import type { IconifyIcon } from '@iconify/types';
import { mergeCustomisations } from '@iconify/utils/lib/customisations/merge';
import { flipFromString } from '@iconify/utils/lib/customisations/flip';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { iconToHTML } from '@iconify/utils/lib/svg/html';
import { svgToURL } from '@iconify/utils/lib/svg/url';
import type { IconProps, IconifyRenderMode } from './props';
import { defaultExtendedIconCustomisations } from './props';

/**
 * Default SVG attributes
 */
const svgDefaults = {
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
	'background-color': 'currentColor',
};

const coloredProps: Record<string, string> = {
	'background-color': 'transparent',
};

// Dynamically add common props to variables above
const propsToAdd: Record<string, string> = {
	image: 'var(--svg)',
	repeat: 'no-repeat',
	size: '100% 100%',
};
const propsToAddTo: Record<string, Record<string, string>> = {
	'-webkit-mask': monotoneProps,
	'mask': monotoneProps,
	'background': coloredProps,
};
for (const prefix in propsToAddTo) {
	const list = propsToAddTo[prefix];
	for (const prop in propsToAdd) {
		list[prefix + '-' + prop] = propsToAdd[prop];
	}
}

/**
 * Fix size: add 'px' to numbers
 */
function fixSize(value: string): string {
	return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
}

/**
 * Result
 */
interface RenderSVGResult {
	svg: true;
	attributes: Record<string, unknown>;
	body: string;
}
interface RenderSPANResult {
	svg: false;
	attributes: Record<string, unknown>;
}
export type RenderResult = RenderSVGResult | RenderSPANResult;

/**
 * Generate icon from properties
 */
export function render(
	// Icon must be validated before calling this function
	icon: Required<IconifyIcon>,
	// Properties
	props: IconProps
): RenderResult {
	const customisations = mergeCustomisations(
		defaultExtendedIconCustomisations,
		props
	);

	// Check mode
	const mode: IconifyRenderMode = props.mode || 'svg';
	const componentProps = (mode === 'svg' ? { ...svgDefaults } : {}) as Record<
		string,
		unknown
	>;
	if (icon.body.indexOf('xlink:') === -1) {
		delete componentProps['xmlns:xlink'];
	}

	// Create style if missing
	let style = typeof props.style === 'string' ? props.style : '';

	// Get element properties
	for (let key in props) {
		const value = props[key as keyof typeof props] as unknown;
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

			// Color: copy to style, add extra ';' in case style is missing it
			case 'color':
				style =
					style +
					(style.length > 0 && style.trim().slice(-1) !== ';'
						? ';'
						: '') +
					'color: ' +
					value +
					'; ';
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

			default:
				if (key.slice(0, 3) === 'on:') {
					// Svelte event
					break;
				}
				// Copy missing property if it does not exist in customisations
				if (
					(
						defaultExtendedIconCustomisations as Record<
							string,
							unknown
						>
					)[key] === void 0
				) {
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);
	const renderAttribs = item.attributes;

	// Inline display
	if (customisations.inline) {
		// Style overrides it
		style = 'vertical-align: -0.125em; ' + style;
	}

	if (mode === 'svg') {
		// Add icon stuff
		Object.assign(componentProps, renderAttribs);

		// Style
		if (style !== '') {
			componentProps.style = style;
		}

		// Counter for ids based on "id" property to render icons consistently on server and client
		let localCounter = 0;
		let id = props.id;
		if (typeof id === 'string') {
			// Convert '-' to '_' to avoid errors in animations
			id = id.replace(/-/g, '_');
		}

		// Generate HTML
		return {
			svg: true,
			attributes: componentProps,
			body: replaceIDs(
				item.body,
				id ? () => id + 'ID' + localCounter++ : 'iconifySvelte'
			),
		};
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
	const url = svgToURL(html);
	const styles: Record<string, string> = {
		'--svg': url,
	};
	const size = (prop: 'width' | 'height') => {
		const value = renderAttribs[prop];
		if (value) {
			styles[prop] = fixSize(value);
		}
	};
	size('width');
	size('height');
	Object.assign(styles, commonProps, useMask ? monotoneProps : coloredProps);

	let customStyle = '';
	for (const key in styles) {
		customStyle += key + ': ' + styles[key] + ';';
	}

	componentProps.style = customStyle + style;
	return {
		svg: false,
		attributes: componentProps,
	};
}
