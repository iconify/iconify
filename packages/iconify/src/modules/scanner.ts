import { IconifyIconName } from '@iconify/core/lib/icon/name';
import { getStorage, getIcon } from '@iconify/core/lib/storage';
import { coreModules } from '@iconify/core/lib/modules';
import { FullIconifyIcon } from '@iconify/core/lib/icon';
import { findPlaceholders } from './finder';
import { IconifyElementData, elementDataProperty } from './element';
import { renderIcon } from './render';
import { pauseObserver, resumeObserver } from './observer';
import { getRoot } from './root';

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
 * Scan DOM for placeholders
 */
export function scanDOM(root?: HTMLElement): void {
	scanQueued = false;

	// Observer
	let paused = false;

	// List of icons to load: [provider][prefix][name] = boolean
	const loadIcons: Record<
		string,
		Record<string, Record<string, boolean>>
	> = Object.create(null);

	// Get root node and placeholders
	if (!root) {
		root = getRoot();
	}
	if (!root || !root.querySelectorAll) {
		return;
	}
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
						coreModules.api &&
						coreModules.api.isPending({ provider, prefix, name })
					) {
						// Pending
						return;
					}
			}
		}

		// Check icon
		const storage = getStorage(provider, prefix);
		if (storage.icons[name] !== void 0) {
			// Icon exists - replace placeholder
			if (!paused) {
				pauseObserver(root);
				paused = true;
			}

			// Get customisations
			const customisations =
				item.customisations !== void 0
					? item.customisations
					: item.finder.customisations(element);

			// Render icon
			renderIcon(
				item,
				customisations,
				getIcon(storage, name) as FullIconifyIcon
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

		if (coreModules.api) {
			if (!coreModules.api.isPending({ provider, prefix, name })) {
				// Add icon to loading queue
				if (loadIcons[provider] === void 0) {
					loadIcons[provider] = Object.create(null);
				}
				const providerLoadIcons = loadIcons[provider];
				if (providerLoadIcons[prefix] === void 0) {
					providerLoadIcons[prefix] = Object.create(null);
				}
				providerLoadIcons[prefix][name] = true;
			}
		}

		// Mark as loading
		data = {
			name: iconName,
			status: 'loading',
			customisations: {},
		};
		element[elementDataProperty] = data;
	});

	// Load icons
	if (coreModules.api) {
		const api = coreModules.api;
		Object.keys(loadIcons).forEach((provider) => {
			const providerLoadIcons = loadIcons[provider];
			Object.keys(providerLoadIcons).forEach((prefix) => {
				api.loadIcons(
					Object.keys(providerLoadIcons[prefix]).map((name) => {
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

	if (paused) {
		resumeObserver(root);
	}
}
