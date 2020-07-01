// Root element
let root: HTMLElement;

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
