import type { IconifyJSON } from '@iconify/types';
import { getIconStorage } from '../storage/storage.js';
import { triggerCallbackAsync } from '../helpers/callbacks.js';
import { mergeSplitIconNames } from '../icon-lists/merge.js';
import type { IconsData } from '../icon-lists/types.js';
import { getLoader } from './loaders.js';
import { splitForBatchLoading } from './api/batch.js';
import { matchIconName, type IconifyIconName } from '@iconify/utils';
import { splitIconNames } from '../icon-lists/split.js';
import { addIconSetToStorage } from './parse.js';

// Queue
let queue = Object.create(null) as IconsData<string[]>;

/**
 * Parse queue
 */
function parseQueuedIcons() {
	// Copy and reset queue
	const oldQueue = queue;
	queue = Object.create(null) as IconsData<string[]>;

	// Parse old queue
	for (const provider in oldQueue) {
		const providerData = oldQueue[provider];
		for (const prefix in providerData) {
			const names = providerData[prefix];
			if (names.length) {
				const storage = getIconStorage(provider, prefix);

				// Get loader
				const loader = getLoader(provider, prefix);
				const allowReload = loader?.allowReload ?? false;
				const validateNames = loader?.validateNames ?? true;

				// Mark icons as pending
				const namesToLoad: string[] = [];
				names.forEach((name) => {
					// Check if icon already loading
					if (storage.pending.has(name)) {
						return;
					}

					// Check if icon already loaded or missing
					if (storage.icons[name] || storage.missing.has(name)) {
						if (!allowReload) {
							return;
						}
					}

					// Check if loader is set and validate icon name
					if (
						!loader ||
						(validateNames && !matchIconName.test(name))
					) {
						storage.update(name, null);
						return;
					}

					// Mark as pending
					namesToLoad.push(name);
					storage.pending.add(name);
				});

				// Load icons
				if (loader && namesToLoad.length) {
					const promises: Promise<void>[] = [];
					if ('loadIcon' in loader) {
						// Load icons one by one
						for (const name of namesToLoad) {
							promises.push(
								new Promise((resolve) => {
									loader
										.loadIcon(name, provider, prefix)
										.then((data) => {
											storage.update(name, data);
											resolve();
										})
										.catch(() => {
											storage.update(name, null);
											resolve();
										});
								})
							);
						}
					} else {
						// Load icons in bulk
						const batches = splitForBatchLoading(
							namesToLoad,
							loader
						);
						for (const batch of batches) {
							// Parse icon set
							const parse = (data?: IconifyJSON | null) => {
								// Add icon set
								const added = data
									? addIconSetToStorage(data, provider)
									: new Set<string>();

								// Send notifications for missing icons
								for (const name of batch) {
									if (!added.has(name)) {
										storage.update(name, null);
									}
								}
							};

							// Create loader
							promises.push(
								new Promise((resolve) => {
									loader
										.loadIcons(batch, prefix, provider)
										.then((data) => {
											parse(data);
											resolve();
										})
										.catch(() => {
											parse();
											resolve();
										});
								})
							);
						}
					}

					// Run all promises
					Promise.all(promises).catch(console.error);
				}
			}
		}
	}
}

/**
 * Add icons to queue
 */
export function loadIcons(
	iconNames: (string | IconifyIconName)[] | IconsData<string[]>,
	instant = false
) {
	// Convert icon names to object
	const icons: IconsData<string[]> = Array.isArray(iconNames)
		? splitIconNames(iconNames)
		: iconNames;

	// Add to queue and trigger callback
	mergeSplitIconNames(queue, icons);
	triggerCallbackAsync(parseQueuedIcons, instant);
}
