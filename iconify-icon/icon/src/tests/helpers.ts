import { JSDOM } from 'jsdom';
import { mockAPIModule, mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { addAPIProvider } from '@iconify/core/lib/api/config';
import { setAPIModule } from '@iconify/core/lib/api/modules';

/**
 * <style> tag with extra attribute
 *
 * Attribute is used to allow developers inject custom styles, so there could be multiple style tags
 */
export const styleOpeningTag = '<style data-style="data-style">';

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

/**
 * Style tests
 */
function getStyleValue(inline: boolean): string {
	return (
		':host{display:inline-block;vertical-align:' +
		(inline ? '-0.125em' : '0') +
		'}span,svg{display:block;margin:auto}'
	);
}
export const expectedInline = getStyleValue(true);
export const expectedBlock = getStyleValue(false);
