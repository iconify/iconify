import type { FullIconifyIcon } from '../icon/defaults';
import type { FullIconCustomisations } from '../customisations/defaults';
import { calculateSize } from './size';

/**
 * Interface for getSVGData() result
 */
export interface IconifyIconBuildResult {
	attributes: {
		// Attributes for <svg>
		width: string;
		height: string;
		viewBox: string;
	};

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
	icon: FullIconifyIcon,
	customisations: FullIconCustomisations
): IconifyIconBuildResult {
	// viewBox
	const box: ViewBox = {
		left: icon.left,
		top: icon.top,
		width: icon.width,
		height: icon.height,
	};

	// Body
	let body = icon.body;

	// Apply transformations
	[icon, customisations].forEach((props) => {
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
			body =
				'<g transform="' +
				transformations.join(' ') +
				'">' +
				body +
				'</g>';
		}
	});

	// Calculate dimensions
	const customisationsWidth = customisations.width;
	const customisationsHeight = customisations.height;
	const boxWidth = box.width;
	const boxHeight = box.height;

	let width, height;
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

	// Convert to string
	width = typeof width === 'string' ? width : width.toString();
	height = typeof height === 'string' ? height : height.toString();

	// Result
	const result: IconifyIconBuildResult = {
		attributes: {
			width,
			height,
			viewBox:
				box.left.toString() +
				' ' +
				box.top.toString() +
				' ' +
				boxWidth.toString() +
				' ' +
				boxHeight.toString(),
		},
		body,
	};

	return result;
}
