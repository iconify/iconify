// Default root element
let root: HTMLElement;

// Interface for extra root nodes
export interface ExtraRootNode {
	node: HTMLElement;
	temporary: boolean; // True if node should be removed when all placeholders have been replaced
}

// Additional root elements
let customRoot: ExtraRootNode[] = [];

/**
 * Get root element
 */
export function getRoot(): HTMLElement {
	return root ? root : (document.querySelector('body') as HTMLElement);
}

/**
 * Set root element
 */
export function setRoot(node: HTMLElement): void {
	root = node;
}

/**
 * Add extra root node
 */
export function addRoot(node: HTMLElement, autoRemove = false): ExtraRootNode {
	if (root === node) {
		return {
			node: root,
			temporary: false,
		};
	}

	for (let i = 0; i < customRoot.length; i++) {
		const item = customRoot[i];
		if (item.node === node) {
			// Found matching node
			if (!autoRemove && item.temporary) {
				// Change to permanent
				item.temporary = false;
			}
			return item;
		}
	}

	// Add item
	const item = {
		node,
		temporary: autoRemove,
	};
	customRoot.push(item);

	return item;
}

/**
 * Remove root node
 */
export function removeRoot(node: HTMLElement): void {
	customRoot = customRoot.filter((item) => item.node !== node);
}

/**
 * Get all root nodes
 */
export function getRootNodes(): ExtraRootNode[] {
	return (root
		? [
				{
					node: root,
					temporary: false,
				},
		  ]
		: []
	).concat(customRoot);
}
