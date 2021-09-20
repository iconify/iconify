// Fake interface to test old IE properties
interface OldIEElement extends HTMLElement {
	doScroll?: boolean;
}

/**
 * Execute function when DOM is ready
 */
export function onReady(callback: () => void): void {
	const doc = document;
	if (
		doc.readyState === 'complete' ||
		(doc.readyState !== 'loading' &&
			!(doc.documentElement as OldIEElement).doScroll)
	) {
		callback();
	} else {
		doc.addEventListener('DOMContentLoaded', callback);
		window.addEventListener('load', callback);
	}
}
