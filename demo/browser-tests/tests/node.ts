import { addRootNode, listRootNodes } from '@iconify/iconify/lib/modules/root';
import { stopObserving } from '@iconify/iconify/lib/modules/observer';
import { ObservedNode } from '@iconify/iconify/lib/modules/observed-node';

let counter = 0;

/**
 * Create node for test
 */
export function getNode(prefix = 'test') {
	const id = prefix + '-' + Date.now() + '-' + counter++;

	const node = document.createElement('div');
	node.setAttribute('id', id);

	document.getElementById('debug').appendChild(node);
	return node;
}

/**
 * Set root node, remove old nodes
 */
export function setRoot(node: HTMLElement): ObservedNode {
	listRootNodes().forEach((node) => {
		if (typeof node.node !== 'function') {
			stopObserving(node.node);
		}
	});
	return addRootNode(node);
}
