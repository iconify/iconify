/**
 * Iconify interface
 */
export interface IconifyScanner {
	/**
	 * Scan DOM
	 */
	scanDOM: (root?: HTMLElement) => void;

	/**
	 * Set root node
	 */
	setRoot: (root: HTMLElement) => void;
}
