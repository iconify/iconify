// @ts-ignore
import { htmlSafe } from '@ember/template';
import type { IconifyIcon } from '@iconify/types';
import type { FullIconCustomisations } from '@iconify/utils/lib/customisations';
import {
	defaults,
	mergeCustomisations,
} from '@iconify/utils/lib/customisations';
import { flipFromString } from '@iconify/utils/lib/customisations/flip';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { iconToSVG } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import type { IconifyIconCustomisations, IconifyIconProps } from './props';

/**
 * Render result
 */
export interface RenderResult {
	width: string | number;
	height: string | number;
	viewBox: string;
	style?: string;
	className: string;
	body: string;
}

/**
 * Render icon
 */
export const render = (
	// Icon must be validated before calling this function
	icon: Required<IconifyIcon>,

	// Partial properties
	props: IconifyIconProps,

	// Class name
	className: string
): RenderResult => {
	// Get all customisations
	const customisations = mergeCustomisations(
		defaults,
		props as IconifyIconCustomisations
	) as FullIconCustomisations;

	// Create empty style
	let style = '';

	// Get element properties
	for (let key in props) {
		const value = props[key];
		if (value === void 0) {
			continue;
		}
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'onLoad':
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
				style += 'color: ' + value + ';';
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value === 'string') {
					customisations[key] = rotateFromString(value);
				} else if (typeof value === 'number') {
					customisations[key] = value;
				}
				break;

			// Ignore other properties
		}
	}

	// Generate icon
	const item = iconToSVG(icon, customisations);

	// Counter for ids based on "id" property to render icons consistently on server and client
	let localCounter = 0;
	let id = props.id;
	if (typeof id === 'string') {
		// Convert '-' to '_' to avoid errors in animations
		id = id.replace(/-/g, '_');
	}

	// Create body
	const body = replaceIDs(
		item.body,
		id ? () => id + 'ID' + localCounter++ : 'iconifyEmber'
	);

	// Add inline
	if (item.inline) {
		style += 'vertical-align: -0.125em;';
	}

	return {
		...item.attributes,
		style: style === '' ? void 0 : htmlSafe(style),
		className,
		body,
	};
};
