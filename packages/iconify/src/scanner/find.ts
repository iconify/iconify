import {
	blockClass,
	elementDataProperty,
	IconifyElement,
	IconifyElementProps,
	inlineClass,
} from './config';
import { getElementProps } from './get-props';

/**
 * Selector combining class names and tags
 */
const selector =
	'svg.' +
	blockClass +
	', i.' +
	blockClass +
	', span.' +
	blockClass +
	', i.' +
	inlineClass +
	', span.' +
	inlineClass;

/**
 * Found nodes
 */
export type ScannedNodesListItem = {
	node: IconifyElement;
	props: IconifyElementProps;
};

export type ScannedNodesList = ScannedNodesListItem[];

/**
 * Find all parent nodes in DOM
 */
export function scanRootNode(root: HTMLElement): ScannedNodesList {
	const nodes: ScannedNodesList = [];

	root.querySelectorAll(selector).forEach((node: IconifyElement) => {
		// Get props, ignore SVG rendered outside of SVG framework
		const props =
			node[elementDataProperty] || node.tagName.toLowerCase() !== 'svg'
				? getElementProps(node)
				: null;

		if (props) {
			nodes.push({
				node,
				props,
			});
		}
	});

	return nodes;
}
