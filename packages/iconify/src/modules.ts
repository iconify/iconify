import { Observer } from './interfaces/observer';

/**
 * Dynamic modules.
 *
 * Also see modules.ts in core package.
 */
interface Modules {
	// Root element
	root?: HTMLElement;

	// Observer module
	observer?: Observer;
}

export const browserModules: Modules = {};

/**
 * Get root element
 */
export function getRoot(): HTMLElement {
	return browserModules.root
		? browserModules.root
		: (document.querySelector('body') as HTMLElement);
}
