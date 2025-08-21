/**
 * Check if browser supports `d` property in CSS
 *
 * On failure to check, assume that it is supported.
 */
export function supportsCSS(): boolean {
	try {
		return window.CSS.supports('d: path("M0 0")');
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return true;
	}
}
