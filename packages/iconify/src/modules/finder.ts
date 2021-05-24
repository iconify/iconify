import {
	elementFinderProperty,
	IconifyElement,
	elementDataProperty,
} from './element';
import {
	IconifyIconName,
	stringToIcon,
	validateIcon,
} from '@iconify/core/lib/icon/name';
import { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';
import { IconifyFinder } from '../finders/interface';

/**
 * List of modules
 */
const finders: IconifyFinder[] = [];

/**
 * Add module
 */
export function addFinder(finder: IconifyFinder): void {
	if (finders.indexOf(finder) === -1) {
		finders.push(finder);
	}
}

/**
 * Interface for found elements list
 */
export interface PlaceholderElement {
	name: IconifyIconName;
	element?: IconifyElement;
	finder?: IconifyFinder;
	customisations?: IconifyIconCustomisations;
}

/**
 * Clean icon name: convert from string if needed and validate
 */
export function cleanIconName(
	name: IconifyIconName | string | null
): IconifyIconName | null {
	if (typeof name === 'string') {
		name = stringToIcon(name);
	}
	return name === null || !validateIcon(name) ? null : name;
}

/**
 * Compare customisations. Returns true if identical
 */
function compareCustomisations(
	list1: IconifyIconCustomisations,
	list2: IconifyIconCustomisations
): boolean {
	const keys1 = Object.keys(list1) as (keyof IconifyIconCustomisations)[];
	const keys2 = Object.keys(list2) as (keyof IconifyIconCustomisations)[];
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (let i = 0; i < keys1.length; i++) {
		const key = keys1[i];
		if (list2[key] !== list1[key]) {
			return false;
		}
	}
	return true;
}

/**
 * Find all placeholders
 */
export function findPlaceholders(root: HTMLElement): PlaceholderElement[] {
	const results: PlaceholderElement[] = [];

	finders.forEach((finder) => {
		const elements = finder.find(root);
		Array.prototype.forEach.call(elements, (item) => {
			const element = item as IconifyElement;
			if (
				element[elementFinderProperty] !== void 0 &&
				element[elementFinderProperty] !== finder
			) {
				// Element is assigned to a different finder
				return;
			}

			// Get icon name
			const name = cleanIconName(finder.name(element));
			if (name === null) {
				// Invalid name - do not assign this finder to element
				return;
			}

			// Assign finder to element and add it to results
			element[elementFinderProperty] = finder;
			const placeholder: PlaceholderElement = {
				element,
				finder,
				name,
			};
			results.push(placeholder);
		});
	});

	// Find all modified SVG
	const elements = root.querySelectorAll('svg.iconify');
	Array.prototype.forEach.call(elements, (item) => {
		const element = item as IconifyElement;
		const finder = element[elementFinderProperty];
		const data = element[elementDataProperty];
		if (!finder || !data) {
			return;
		}

		// Get icon name
		const name = cleanIconName(finder.name(element));
		if (name === null) {
			// Invalid name
			return;
		}

		let updated = false;
		let customisations;
		if (name.prefix !== data.name.prefix || name.name !== data.name.name) {
			updated = true;
		} else {
			customisations = finder.customisations(element);
			if (!compareCustomisations(data.customisations, customisations)) {
				updated = true;
			}
		}

		// Add item to results
		if (updated) {
			const placeholder: PlaceholderElement = {
				element,
				finder,
				name,
				customisations,
			};
			results.push(placeholder);
		}
	});

	return results;
}
