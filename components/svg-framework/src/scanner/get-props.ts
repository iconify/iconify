import { stringToIcon } from '@iconify/utils/lib/icon/name';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import { flipFromString } from '@iconify/utils/lib/customisations/flip';
import {
	defaultExtendedIconCustomisations,
	IconifyRenderMode,
	inlineClass,
} from './config';
import type { IconifyElementProps, IconifyIconCustomisations } from './config';

/**
 * Size attributes
 */
const sizeAttributes: (keyof IconifyIconCustomisations)[] = ['width', 'height'];

/**
 * Boolean attributes
 */
const booleanAttributes: (keyof IconifyIconCustomisations)[] = [
	'inline',
	'hFlip',
	'vFlip',
];

/**
 * Get attribute value
 */
function getBooleanAttribute(value: unknown, key: string): boolean | null {
	if (value === key || value === 'true') {
		return true;
	}
	if (value === '' || value === 'false') {
		return false;
	}
	return null;
}

/**
 * Get element properties from HTML element
 */
export function getElementProps(element: Element): IconifyElementProps | null {
	// Get icon name
	const name = element.getAttribute('data-icon');
	const icon = typeof name === 'string' && stringToIcon(name, true);
	if (!icon) {
		return null;
	}

	// Get defaults and inline
	const customisations = {
		...defaultExtendedIconCustomisations,
		inline: element.classList && element.classList.contains(inlineClass),
	};

	// Get dimensions
	sizeAttributes.forEach((attr) => {
		const value = element.getAttribute('data-' + attr);
		if (value) {
			customisations[attr as 'width'] = value;
		}
	});

	// Get rotation
	const rotation = element.getAttribute('data-rotate');
	if (typeof rotation === 'string') {
		customisations.rotate = rotateFromString(rotation);
	}

	// Get flip shorthand
	const flip = element.getAttribute('data-flip');
	if (typeof flip === 'string') {
		flipFromString(customisations, flip);
	}

	// Boolean attributes
	booleanAttributes.forEach((attr) => {
		const key = 'data-' + attr;
		const value = getBooleanAttribute(element.getAttribute(key), key);
		if (typeof value === 'boolean') {
			customisations[attr as 'inline'] = value;
		}
	});

	// Get render mode. Not checking actual value because incorrect values are treated as inline
	const mode = element.getAttribute('data-mode') as
		| IconifyRenderMode
		| undefined;

	return {
		name,
		icon,
		customisations,
		mode,
	};
}
