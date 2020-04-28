import { elementFinderProperty, IconifyElement } from '../element';
import { ObserverCallback, Observer } from '../interfaces/observer';
import { getRoot } from '../modules';

/**
 * MutationObserver instance, null until DOM is ready
 */
let instance: MutationObserver | null = null;

/**
 * Callback
 */
let callback: ObserverCallback | null = null;

/**
 * Parameters for mutation observer
 */
const observerParams: MutationObserverInit = {
	childList: true,
	subtree: true,
	attributes: true,
};

/**
 * Pause. Number instead of boolean to allow multiple pause/resume calls. Observer is resumed only when pause reaches 0
 */
let paused = 0;

/**
 * Scan is pending when observer is resumed
 */
let scanPending = false;

/**
 * Scan is already queued
 */
let scanQueued = false;

/**
 * Queue DOM scan
 */
function queueScan(): void {
	if (!scanQueued) {
		scanQueued = true;
		setTimeout(() => {
			scanQueued = false;
			scanPending = false;
			if (callback) {
				callback(getRoot());
			}
		});
	}
}

/**
 * Check mutations for added nodes
 */
function checkMutations(mutations: MutationRecord[]): void {
	if (!scanPending) {
		for (let i = 0; i < mutations.length; i++) {
			const item = mutations[i];
			if (
				// Check for added nodes
				(item.addedNodes && item.addedNodes.length > 0) ||
				// Check for icon or placeholder with modified attributes
				(item.type === 'attributes' &&
					(item.target as IconifyElement)[elementFinderProperty] !==
						void 0)
			) {
				scanPending = true;
				if (!paused) {
					queueScan();
				}
				return;
			}
		}
	}
}

/**
 * Start/resume observer
 */
function observe(): void {
	if (instance) {
		instance.observe(getRoot(), observerParams);
	}
}

/**
 * Start mutation observer
 */
function startObserver(): void {
	if (instance !== null) {
		return;
	}

	scanPending = true;
	instance = new MutationObserver(checkMutations);
	observe();
	if (!paused) {
		queueScan();
	}
}

// Fake interface to test old IE properties
interface OldIEElement extends HTMLElement {
	doScroll?: boolean;
}

/**
 * Export module
 */
export const observer: Observer = {
	/**
	 * Start observer when DOM is ready
	 */
	init: (cb: ObserverCallback): void => {
		callback = cb;

		if (instance && !paused) {
			// Restart observer
			instance.disconnect();
			observe();
			return;
		}

		setTimeout(() => {
			const doc = document;
			if (
				doc.readyState === 'complete' ||
				(doc.readyState !== 'loading' &&
					!(doc.documentElement as OldIEElement).doScroll)
			) {
				startObserver();
			} else {
				doc.addEventListener('DOMContentLoaded', startObserver);
				window.addEventListener('load', startObserver);
			}
		});
	},

	/**
	 * Pause observer
	 */
	pause: (): void => {
		paused++;
		if (paused > 1 || instance === null) {
			return;
		}

		// Check pending records, stop observer
		checkMutations(instance.takeRecords());
		instance.disconnect();
	},

	/**
	 * Resume observer
	 */
	resume: (): void => {
		if (!paused) {
			return;
		}
		paused--;

		if (!paused && instance) {
			observe();
			if (scanPending) {
				queueScan();
			}
		}
	},

	/**
	 * Check if observer is paused
	 */
	isPaused: (): boolean => paused > 0,
};
