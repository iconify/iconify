import type { IconifyElement } from '../scanner/config';

/**
 * Add classes to SVG, removing previously added classes, keeping custom classes
 */
export function applyClasses(
	svg: IconifyElement,
	classes: Set<string>,
	previouslyAddedClasses: Set<string>,
	placeholder?: IconifyElement
): string[] {
	const svgClasses = svg.classList;

	// Copy classes from placeholder
	if (placeholder) {
		const placeholderClasses = placeholder.classList;
		Array.from(placeholderClasses).forEach((item) => {
			svgClasses.add(item);
		});
	}

	// Add new classes
	const addedClasses: string[] = [];
	classes.forEach((item: string) => {
		if (!svgClasses.contains(item)) {
			// Add new class
			svgClasses.add(item);
			addedClasses.push(item);
		} else if (previouslyAddedClasses.has(item)) {
			// Was added before: keep it
			addedClasses.push(item);
		}
	});

	// Remove previously added classes
	previouslyAddedClasses.forEach((item) => {
		if (!classes.has(item)) {
			// Class that was added before, but no longer needed
			svgClasses.remove(item);
		}
	});

	return addedClasses;
}
