import { JSDOM } from 'jsdom';
import { mockAPIModule, mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { addAPIProvider } from '@iconify/core/lib/api/config';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import { removeRootNode, listRootNodes } from '../src/observer/root';
import { onReady } from '../src/helpers/ready';
import { stopObserver } from '../src/observer';

/**
 * Generate next prefix
 */
let counter = 0;
export const nextPrefix = () => 'mock-' + counter++;

/**
 * Set mock API module for provider
 */
export function fakeAPI(provider: string) {
	// Set API module for provider
	addAPIProvider(provider, {
		resources: ['http://localhost'],
	});
	setAPIModule(provider, mockAPIModule);
}

export { mockAPIData };

/**
 * Async version of onReady()
 */
export function waitDOMReady() {
	return new Promise((fulfill) => {
		onReady(() => {
			fulfill(undefined);
		});
	});
}

/**
 * Timeout
 *
 * Can chain multiple setTimeout by adding multiple 0 delays
 */
export function nextTick(delays: number[] = [0]) {
	return new Promise((fulfill) => {
		function next() {
			if (!delays.length) {
				fulfill(undefined);
				return;
			}
			setTimeout(() => {
				next();
			}, delays.shift());
		}
		next();
	});
}

/**
 * Timeout, until condition is met
 */
type WaitUntilCheck = () => boolean;
export function awaitUntil(callback: WaitUntilCheck, maxDelay = 1000) {
	return new Promise((fulfill, reject) => {
		const start = Date.now();

		function next() {
			setTimeout(() => {
				if (callback()) {
					fulfill(undefined);
					return;
				}

				if (Date.now() - start > maxDelay) {
					reject('Timed out');
					return;
				}
				next();
			});
		}
		next();
	});
}

/**
 * Create JSDOM instance, overwrite globals
 */
export function setupDOM(html: string): JSDOM {
	const dom = new JSDOM(html);
	(global as unknown as Record<string, unknown>).window = dom.window;
	(global as unknown as Record<string, unknown>).document =
		global.window.document;
	return dom;
}

/**
 * Delete temporary globals
 */
export function cleanupGlobals() {
	delete global.window;
	delete global.document;
}

/**
 * Reset state
 */
export function resetState() {
	// Reset root nodes list and stop all observers
	listRootNodes().forEach((node) => {
		stopObserver(node);
		removeRootNode(node);
	});

	// Remove globals
	cleanupGlobals();
}

/**
 * Wrap HTML
 */
export function wrapHTML(content: string): string {
	return `<!doctype html>
<head>
	<meta charset="utf-8">
</head>
<body>
	${content}
</body>
</html>`;
}
