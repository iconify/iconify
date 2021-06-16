import { ObservedNode } from './observed-node';

/**
 * List of root nodes
 */
let nodes: ObservedNode[] = [];

/**
 * Find node
 */
export function findRootNode(node: HTMLElement): ObservedNode | undefined {
	for (let i = 0; i < nodes.length; i++) {
		const item = nodes[i];
		let root = typeof item.node === 'function' ? item.node() : item.node;
		if (root === node) {
			return item;
		}
	}
}

/**
 * Add extra root node
 */
export function addRootNode(
	root: HTMLElement,
	autoRemove = false
): ObservedNode {
	let node = findRootNode(root);
	if (node) {
		// Node already exist: switch type if needed
		if (node.temporary) {
			node.temporary = autoRemove;
		}
		return node;
	}

	// Create item, add it to list, start observer
	node = {
		node: root,
		temporary: autoRemove,
	};
	nodes.push(node);

	return node;
}

/**
 * Add document.body node
 */
export function addBodyNode(): ObservedNode {
	if (document.documentElement) {
		return addRootNode(document.documentElement);
	}
	nodes.push({
		node: () => {
			return document.documentElement;
		},
	});
}

/**
 * Remove root node
 */
export function removeRootNode(root: HTMLElement): void {
	nodes = nodes.filter((node) => {
		const element =
			typeof node.node === 'function' ? node.node() : node.node;
		return root !== element;
	});
}

/**
 * Get list of root nodes
 */
export function listRootNodes(): ObservedNode[] {
	return nodes;
}
