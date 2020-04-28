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
