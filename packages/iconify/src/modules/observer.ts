import { elementFinderProperty, IconifyElement } from './element';
import { ObservedNode } from './observed-node';
import {
	listRootNodes,
	addRootNode,
	findRootNode,
	removeRootNode,
} from './root';
import { onReady } from './ready';

/**
 * Observer callback function
 */
export type ObserverCallback = (item: ObservedNode) => void;

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
 * Queue DOM scan
 */
function queueScan(node: ObservedNode): void {
	if (!node.observer) {
		return;
	}

	const observer = node.observer;
	if (!observer.pendingScan) {
		observer.pendingScan = setTimeout(() => {
			delete observer.pendingScan;
			if (callback) {
				callback(node);
			}
		});
	}
}

/**
 * Check mutations for added nodes
 */
function checkMutations(node: ObservedNode, mutations: MutationRecord[]): void {
	if (!node.observer) {
		return;
	}

	const observer = node.observer;
	if (!observer.pendingScan) {
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
				if (!observer.paused) {
					queueScan(node);
				}
				return;
			}
		}
	}
}

/**
 * Start/resume observer
 */
function observe(node: ObservedNode, root: HTMLElement): void {
	node.observer.instance.observe(root, observerParams);
}

/**
 * Start mutation observer
 */
function startObserver(node: ObservedNode): void {
	let observer = node.observer;
	if (observer && observer.instance) {
		// Already started
		return;
	}

	const root = typeof node.node === 'function' ? node.node() : node.node;
	if (!root) {
		// document.body is not available yet
		return;
	}

	if (!observer) {
		observer = {
			paused: 0,
		};
		node.observer = observer;
	}

	// Create new instance, observe
	observer.instance = new MutationObserver(checkMutations.bind(null, node));
	observe(node, root);

	// Scan immediately
	if (!observer.paused) {
		queueScan(node);
	}
}

/**
 * Start all observers
 */
function startObservers(): void {
	listRootNodes().forEach(startObserver);
}

/**
 * Stop observer
 */
function stopObserver(node: ObservedNode): void {
	if (!node.observer) {
		return;
	}

	const observer = node.observer;

	// Stop scan
	if (observer.pendingScan) {
		clearTimeout(observer.pendingScan);
		delete observer.pendingScan;
	}

	// Disconnect observer
	if (observer.instance) {
		observer.instance.disconnect();
		delete observer.instance;
	}
}

/**
 * Start observer when DOM is ready
 */
export function initObserver(cb: ObserverCallback): void {
	let isRestart = callback !== null;

	if (callback !== cb) {
		// Change callback and stop all pending observers
		callback = cb;
		if (isRestart) {
			listRootNodes().forEach(stopObserver);
		}
	}

	if (isRestart) {
		// Restart instances
		startObservers();
		return;
	}

	// Start observers when document is ready
	onReady(startObservers);
}

/**
 * Pause observer
 */
export function pauseObserver(node?: ObservedNode): void {
	(node ? [node] : listRootNodes()).forEach((node) => {
		if (!node.observer) {
			node.observer = {
				paused: 1,
			};
			return;
		}

		const observer = node.observer;
		observer.paused++;
		if (observer.paused > 1 || !observer.instance) {
			return;
		}

		// Disconnect observer
		const instance = observer.instance;
		// checkMutations(node, instance.takeRecords());
		instance.disconnect();
	});
}

/**
 * Resume observer
 */
export function resumeObserver(observer?: ObservedNode): void {
	(observer ? [observer] : listRootNodes()).forEach((node) => {
		if (!node.observer) {
			// Start observer
			startObserver(node);
			return;
		}

		const observer = node.observer;
		if (observer.paused) {
			observer.paused--;

			if (!observer.paused) {
				// Start / resume
				const root =
					typeof node.node === 'function' ? node.node() : node.node;

				if (!root) {
					return;
				} else if (observer.instance) {
					observe(node, root);
				} else {
					startObserver(node);
				}
			}
		}
	});
}

/**
 * Observe node
 */
export function observeNode(
	root: HTMLElement,
	autoRemove = false
): ObservedNode {
	const node = addRootNode(root, autoRemove);
	startObserver(node);
	return node;
}

/**
 * Remove observed node
 */
export function removeObservedNode(root: HTMLElement): void {
	const node = findRootNode(root);
	if (node) {
		stopObserver(node);
		removeRootNode(root);
	}
}
