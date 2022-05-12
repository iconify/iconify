/**
 * Execute function when DOM is ready
 */
export function onReady(callback: () => void): void {
	const doc = document;
	if (doc.readyState && doc.readyState !== 'loading') {
		callback();
	} else {
		doc.addEventListener('DOMContentLoaded', callback);
	}
}
