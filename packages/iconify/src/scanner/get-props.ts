import { stringToIcon } from '@iconify/utils/lib/icon/name';
import { defaults } from '@iconify/utils/lib/customisations';
import type { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';
import { rotateFromString } from '@iconify/utils/lib/customisations/rotate';
import {
	alignmentFromString,
	flipFromString,
} from '@iconify/utils/lib/customisations/shorthand';
import { inlineClass } from './config';
import type { IconifyElementProps } from './config';

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
 * Combined attributes
 */
type CombinedAtttributeFunction = (
	customisations: IconifyIconCustomisations,
	value: string
) => void;
const combinedAttributes: Record<string, CombinedAtttributeFunction> = {
	flip: flipFromString,
	align: alignmentFromString,
};

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

	// Get defaults
	const customisations = {
		...defaults,
	};

	// Get inline status
	customisations.inline =
		element.classList && element.classList.contains(inlineClass);

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

	// Get alignment and transformations shorthand attributes
	for (const attr in combinedAttributes) {
		const value = element.getAttribute('data-' + attr);
		if (typeof value === 'string') {
			combinedAttributes[attr](customisations, value);
		}
	}

	// Boolean attributes
	booleanAttributes.forEach((attr) => {
		const key = 'data-' + attr;
		const value = getBooleanAttribute(element.getAttribute(key), key);
		if (typeof value === 'boolean') {
			customisations[attr as 'inline'] = value;
		}
	});

	return {
		name,
		icon,
		customisations,
	};
}
