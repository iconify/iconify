import { defaultIconProps, IconifyIcon } from '../icon/defaults';
import {
	defaultIconCustomisations,
	IconifyIconCustomisations,
} from '../customisations/defaults';
import { calculateSize } from './size';
import { SVGViewBox } from './viewbox';
import { wrapSVGContent } from './defs';

/**
 * Interface for getSVGData() result
 */
export interface IconifyIconBuildResult {
	attributes: {
		// Attributes for <svg>
		width?: string;
		height?: string;
		viewBox: string;
	};

	// viewBox as numbers
	viewBox: SVGViewBox;

	// Content
	body: string;
}

/**
 * Interface for viewBox
 */
interface ViewBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * Check if value should be unset. Allows multiple keywords
 */
export const isUnsetKeyword = (value: unknown) =>
	value === 'unset' || value === 'undefined' || value === 'none';

/**
 * Get SVG attributes and content from icon + customisations
 *
 * Does not generate style to make it compatible with frameworks that use objects for style, such as React.
 * Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
 *
 * Customisations should be normalised by platform specific parser.
 * Result should be converted to <svg> by platform specific parser.
 * Use replaceIDs to generate unique IDs for body.
 */
export function iconToSVG(
	icon: IconifyIcon,
	customisations?: IconifyIconCustomisations
): IconifyIconBuildResult {
	const fullIcon = {
		...defaultIconProps,
		...icon,
	};
	const fullCustomisations = {
		...defaultIconCustomisations,
		...customisations,
	};

	// viewBox
	const box: ViewBox = {
		left: fullIcon.left,
		top: fullIcon.top,
		width: fullIcon.width,
		height: fullIcon.height,
	};

	// Body
	let body = fullIcon.body;

	// Apply transformations
	[fullIcon, fullCustomisations].forEach((props) => {
		const transformations: string[] = [];
		const hFlip = props.hFlip;
		const vFlip = props.vFlip;
		let rotation = props.rotate;

		// Icon is flipped first, then rotated
		if (hFlip) {
			if (vFlip) {
				rotation += 2;
			} else {
				// Horizontal flip
				transformations.push(
					'translate(' +
						(box.width + box.left).toString() +
						' ' +
						(0 - box.top).toString() +
						')'
				);
				transformations.push('scale(-1 1)');
				box.top = box.left = 0;
			}
		} else if (vFlip) {
			// Vertical flip
			transformations.push(
				'translate(' +
					(0 - box.left).toString() +
					' ' +
					(box.height + box.top).toString() +
					')'
			);
			transformations.push('scale(1 -1)');
			box.top = box.left = 0;
		}

		let tempValue: number;
		if (rotation < 0) {
			rotation -= Math.floor(rotation / 4) * 4;
		}
		rotation = rotation % 4;
		switch (rotation) {
			case 1:
				// 90deg
				tempValue = box.height / 2 + box.top;
				transformations.unshift(
					'rotate(90 ' +
						tempValue.toString() +
						' ' +
						tempValue.toString() +
						')'
				);
				break;

			case 2:
				// 180deg
				transformations.unshift(
					'rotate(180 ' +
						(box.width / 2 + box.left).toString() +
						' ' +
						(box.height / 2 + box.top).toString() +
						')'
				);
				break;

			case 3:
				// 270deg
				tempValue = box.width / 2 + box.left;
				transformations.unshift(
					'rotate(-90 ' +
						tempValue.toString() +
						' ' +
						tempValue.toString() +
						')'
				);
				break;
		}

		if (rotation % 2 === 1) {
			// Swap width/height and x/y for 90deg or 270deg rotation
			if (box.left !== box.top) {
				tempValue = box.left;
				box.left = box.top;
				box.top = tempValue;
			}
			if (box.width !== box.height) {
				tempValue = box.width;
				box.width = box.height;
				box.height = tempValue;
			}
		}

		if (transformations.length) {
			body = wrapSVGContent(
				body,
				'<g transform="' + transformations.join(' ') + '">',
				'</g>'
			);
		}
	});

	// Calculate dimensions
	const customisationsWidth = fullCustomisations.width;
	const customisationsHeight = fullCustomisations.height;
	const boxWidth = box.width;
	const boxHeight = box.height;

	let width: string | number;
	let height: string | number;
	if (customisationsWidth === null) {
		// Width is not set: calculate width from height, default to '1em'
		height =
			customisationsHeight === null
				? '1em'
				: customisationsHeight === 'auto'
				? boxHeight
				: customisationsHeight;
		width = calculateSize(height, boxWidth / boxHeight);
	} else {
		// Width is set
		width = customisationsWidth === 'auto' ? boxWidth : customisationsWidth;
		height =
			customisationsHeight === null
				? calculateSize(width, boxHeight / boxWidth)
				: customisationsHeight === 'auto'
				? boxHeight
				: customisationsHeight;
	}

	// Attributes for result
	const attributes = {} as IconifyIconBuildResult['attributes'];

	const setAttr = (prop: 'width' | 'height', value: string | number) => {
		if (!isUnsetKeyword(value)) {
			attributes[prop] = value.toString();
		}
	};
	setAttr('width', width);
	setAttr('height', height);

	const viewBox: SVGViewBox = [box.left, box.top, boxWidth, boxHeight];
	attributes.viewBox = viewBox.join(' ');

	return {
		attributes,
		viewBox,
		body,
	};
}
