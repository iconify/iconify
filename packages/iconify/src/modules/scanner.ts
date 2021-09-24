import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import {
	getStorage,
	getIconFromStorage,
} from '@iconify/core/lib/storage/storage';
import { isPending, loadIcons } from '@iconify/core/lib/api/icons';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { findPlaceholders } from './finder';
import type { IconifyElementData } from './element';
import { elementDataProperty } from './element';
import { renderIconInPlaceholder } from './render';
import type { ObservedNode } from './observed-node';
import {
	pauseObservingNode,
	resumeObservingNode,
	stopObserving,
	observe,
} from './observer';
import { findRootNode, listRootNodes } from './root';

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
 * Compare Icon objects. Returns true if icons are identical.
 *
 * Note: null means icon is invalid, so null to null comparison = false.
 */
const compareIcons = (
	icon1: IconifyIconName | null,
	icon2: IconifyIconName | null
): boolean => {
	return (
		icon1 !== null &&
		icon2 !== null &&
		icon1.name === icon2.name &&
		icon1.prefix === icon2.prefix
	);
};

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

/**
 * Scan DOM for placeholders
 */
export function scanDOM(node?: ObservedNode, addTempNode = false): void {
	scanQueued = false;

	// List of icons to load: [provider][prefix][name] = boolean
	const iconsToLoad: Record<
		string,
		Record<string, Record<string, boolean>>
	> = Object.create(null);

	// Get placeholders
	(node ? [node] : listRootNodes()).forEach((node) => {
		const root = typeof node.node === 'function' ? node.node() : node.node;

		if (!root || !root.querySelectorAll) {
			return;
		}

		// Track placeholders
		let hasPlaceholders = false;

		// Observer
		let paused = false;

		// Find placeholders
		findPlaceholders(root).forEach((item) => {
			const element = item.element;
			const iconName = item.name;
			const provider = iconName.provider;
			const prefix = iconName.prefix;
			const name = iconName.name;
			let data: IconifyElementData = element[elementDataProperty];

			// Icon has not been updated since last scan
			if (data !== void 0 && compareIcons(data.name, iconName)) {
				// Icon name was not changed and data is set - quickly return if icon is missing or still loading
				switch (data.status) {
					case 'missing':
						return;

					case 'loading':
						if (
							isPending({
								provider,
								prefix,
								name,
							})
						) {
							// Pending
							hasPlaceholders = true;
							return;
						}
				}
			}

			// Check icon
			const storage = getStorage(provider, prefix);
			if (storage.icons[name] !== void 0) {
				// Icon exists - pause observer before replacing placeholder
				if (!paused && node.observer) {
					pauseObservingNode(node);
					paused = true;
				}

				// Get customisations
				const customisations =
					item.customisations !== void 0
						? item.customisations
						: item.finder.customisations(element);

				// Render icon
				renderIconInPlaceholder(
					item,
					customisations,
					getIconFromStorage(storage, name) as FullIconifyIcon
				);

				return;
			}

			if (storage.missing[name]) {
				// Mark as missing
				data = {
					name: iconName,
					status: 'missing',
					customisations: {},
				};
				element[elementDataProperty] = data;
				return;
			}

			if (!isPending({ provider, prefix, name })) {
				// Add icon to loading queue
				if (iconsToLoad[provider] === void 0) {
					iconsToLoad[provider] = Object.create(null);
				}
				const providerIconsToLoad = iconsToLoad[provider];
				if (providerIconsToLoad[prefix] === void 0) {
					providerIconsToLoad[prefix] = Object.create(null);
				}
				providerIconsToLoad[prefix][name] = true;
			}

			// Mark as loading
			data = {
				name: iconName,
				status: 'loading',
				customisations: {},
			};
			element[elementDataProperty] = data;
			hasPlaceholders = true;
		});

		// Node stuff
		if (node.temporary && !hasPlaceholders) {
			// Remove temporary node
			stopObserving(root);
		} else if (addTempNode && hasPlaceholders) {
			// Add new temporary node
			observe(root, true);
		} else if (paused && node.observer) {
			// Resume observer
			resumeObservingNode(node);
		}
	});

	// Load icons
	Object.keys(iconsToLoad).forEach((provider) => {
		const providerIconsToLoad = iconsToLoad[provider];
		Object.keys(providerIconsToLoad).forEach((prefix) => {
			loadIcons(
				Object.keys(providerIconsToLoad[prefix]).map((name) => {
					const icon: IconifyIconName = {
						provider,
						prefix,
						name,
					};
					return icon;
				}),
				checkPendingIcons
			);
		});
	});
}
