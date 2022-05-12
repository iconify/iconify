import type {
	IconifyElement,
	IconifyElementChangedStyles,
} from '../scanner/config';

/**
 * Copy old styles, apply new styles
 */
export function applyStyle(
	svg: IconifyElement,
	styles: Record<string, string>,
	previouslyAddedStyles?: IconifyElementChangedStyles
): IconifyElementChangedStyles {
	const svgStyle = svg.style;

	// Remove previously added styles
	(previouslyAddedStyles || []).forEach((prop) => {
		svgStyle.removeProperty(prop);
	});

	// Apply new styles, ignoring styles that already exist
	const appliedStyles: IconifyElementChangedStyles = [];
	for (const prop in styles) {
		if (!svgStyle.getPropertyValue(prop)) {
			appliedStyles.push(prop);
			svgStyle.setProperty(prop, styles[prop]);
		}
	}

	return appliedStyles;
}
