import {
	getIconFromStorage,
	getStorage,
} from '@iconify/core/lib/storage/storage';
import { isPending, loadIcons } from '@iconify/core/lib/api/icons';
import { findRootNode, listRootNodes } from '../observer/root';
import type { ObservedNode } from '../observer/types';
import { propsChanged } from './compare';
import {
	elementDataProperty,
	IconifyElement,
	IconifyElementData,
	IconifyElementProps,
} from './config';
import { scanRootNode } from './find';
import type { IconifyIconName } from '../iconify';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import {
	observe,
	pauseObservingNode,
	resumeObservingNode,
	stopObserving,
} from '../observer';
import { renderInlineSVG } from '../render/svg';
import { renderBackground } from '../render/bg';

/**
 * Flag to avoid scanning DOM too often
 */
let scanQueued = false;

/**
 * Icons have been loaded
 */
function checkPendingIcons(): void {
	if (!scanQueued) {
		scanQueued = true;
		setTimeout(() => {
			if (scanQueued) {
				scanQueued = false;
				scanDOM();
			}
		});
	}
}

/**
 * Scan node for placeholders
 */
export function scanDOM(rootNode?: ObservedNode, addTempNode = false): void {
	// List of icons to load: [provider][prefix] = Set<name>
	const iconsToLoad: Record<
		string,
		Record<string, Set<string>>
	> = Object.create(null);

	/**
	 * Get status based on icon
	 */
	interface GetIconResult {
		status: IconifyElementData['status'];
		icon?: FullIconifyIcon;
	}
	function getIcon(icon: IconifyIconName, load: boolean): GetIconResult {
		const { provider, prefix, name } = icon;
		const storage = getStorage(provider, prefix);

		if (storage.icons[name]) {
			return {
				status: 'loaded',
				icon: getIconFromStorage(storage, name),
			};
		}

		if (storage.missing[name]) {
			return {
				status: 'missing',
			};
		}

		if (load && !isPending(icon)) {
			const providerIconsToLoad =
				iconsToLoad[provider] ||
				(iconsToLoad[provider] = Object.create(null));
			const set =
				providerIconsToLoad[prefix] ||
				(providerIconsToLoad[prefix] = new Set());
			set.add(name);
		}

		return {
			status: 'loading',
		};
	}

	// Parse all root nodes
	(rootNode ? [rootNode] : listRootNodes()).forEach((observedNode) => {
		const root =
			typeof observedNode.node === 'function'
				? observedNode.node()
				: observedNode.node;

		if (!root || !root.querySelectorAll) {
			return;
		}

		// Track placeholders
		let hasPlaceholders = false;

		// Observer
		let paused = false;

		/**
		 * Render icon
		 */
		function render(
			element: IconifyElement,
			props: IconifyElementProps,
			iconData: FullIconifyIcon
		) {
			if (!paused) {
				paused = true;
				pauseObservingNode(observedNode);
			}

			if (element.tagName.toUpperCase() !== 'SVG') {
				// Check for one of style modes
				const mode = props.mode;
				const isMask: boolean | null =
					mode === 'mask' ||
					(mode === 'bg'
						? false
						: mode === 'style'
						? iconData.body.indexOf('currentColor') !== -1
						: null);

				if (typeof isMask === 'boolean') {
					renderBackground(element, props, iconData, isMask);
					return;
				}
			}

			renderInlineSVG(element, props, iconData);
		}

		// Find all elements
		scanRootNode(root).forEach(({ node, props }) => {
			// Check if item already has props
			const oldData = node[elementDataProperty];
			if (!oldData) {
				// New icon without data
				const { status, icon } = getIcon(props.icon, true);
				if (icon) {
					// Ready to render!
					render(node, props, icon);
					return;
				}

				// Loading or missing
				hasPlaceholders = hasPlaceholders || status === 'loading';
				node[elementDataProperty] = {
					...props,
					status,
				};
				return;
			}

			// Previously found icon
			let item: GetIconResult;
			if (!propsChanged(oldData, props)) {
				// Props have not changed. Check status
				const oldStatus = oldData.status;
				if (oldStatus !== 'loading') {
					return;
				}

				item = getIcon(props.icon, false);
				if (!item.icon) {
					// Nothing to render
					oldData.status = item.status;
					return;
				}
			} else {
				// Properties have changed: load icon if name has changed
				item = getIcon(props.icon, oldData.name !== props.name);
				if (!item.icon) {
					// Cannot render icon: update status and props
					hasPlaceholders =
						hasPlaceholders || item.status === 'loading';
					Object.assign(oldData, {
						...props,
						status: item.status,
					});
					return;
				}
			}

			// Re-render icon
			render(node, props, item.icon);
		});

		// Observed node stuff
		if (observedNode.temporary && !hasPlaceholders) {
			// Remove temporary node
			stopObserving(root);
		} else if (addTempNode && hasPlaceholders) {
			// Add new temporary node
			observe(root, true);
		} else if (paused && observedNode.observer) {
			// Resume observer
			resumeObservingNode(observedNode);
		}
	});

	// Load icons
	for (const provider in iconsToLoad) {
		const providerIconsToLoad = iconsToLoad[provider];
		for (const prefix in providerIconsToLoad) {
			const set = providerIconsToLoad[prefix];
			loadIcons(
				Array.from(set).map((name) => ({
					provider,
					prefix,
					name,
				})),
				checkPendingIcons
			);
		}
	}
}

/**
 * Scan node for placeholders
 */
export function scanElement(root: HTMLElement): void {
	// Add temporary node
	const node = findRootNode(root);
	if (!node) {
		scanDOM(
			{
				node: root,
				temporary: true,
			},
			true
		);
	} else {
		scanDOM(node);
	}
}
