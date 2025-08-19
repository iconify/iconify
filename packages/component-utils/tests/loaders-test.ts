import { getIconStorage } from '../src/data/storage.js';
import { getLoadedIcon } from '../src/data/get-icon.js';
import { loadIcon } from '../src/loader/load-icon.js';
import { setProviderLoader } from '../src/loader/loaders.js';
import { loadIcons } from '../src/loader/queue.js';
import {
	subscribeToIconStorage,
	unsubscribeFromIconStorage,
} from '../src/storage/subscription.js';
import { createIconifyAPILoader } from '../src/loader/api.js';
import { loadIconsWithCallback } from '../src/loader/load-icons.js';

describe('Testing icon loader', () => {
	let index = 0;
	const getProvider = () => `provider-${index++}`;

	async function testForUpdate(test: () => boolean, limit = 10, delay = 0) {
		for (let i = 0; i < limit; i++) {
			// Wait for next tick
			await new Promise((resolve) => setTimeout(resolve, delay));

			// Check if test passed
			if (test()) {
				return i;
			}
		}
		return -1;
	}

	it('Simple loader', async () => {
		const provider = getProvider();
		let resolveCount = 0;
		let gotNotification = false;

		// Set loader
		setProviderLoader(provider, {
			loadIcon: (name) => {
				return new Promise((resolve) => {
					resolve(
						name.startsWith('error')
							? null
							: {
									body: `<g id="${name}" />`,
							  }
					);
					resolveCount++;
				});
			},
		});

		// Get storage
		const storage = getIconStorage(provider, 'test');

		// Set subscriber
		const subscriber = subscribeToIconStorage(
			storage,
			['icon1', 'icon2', 'error1'],
			() => {
				gotNotification = true;
			}
		);
		expect(storage.subscribers.length).toBe(1);

		// Load several icons
		loadIcons({
			[provider]: {
				test: ['icon1', 'icon2', 'error1'],
			},
		});

		// Wait for 3 updates
		await testForUpdate(() => resolveCount === 3);

		// Icons should be loaded
		expect(storage.pending.size).toBe(0);
		expect(Array.from(storage.missing)).toEqual(['error1']);
		expect(storage.icons).toEqual({
			icon1: {
				body: '<g id="icon1" />',
			},
			icon2: {
				body: '<g id="icon2" />',
			},
		});

		// Notification should be sent asynchronously
		expect(gotNotification).toBe(false);

		// Wait for notification
		await testForUpdate(() => gotNotification === true);
		expect(gotNotification).toBe(true);

		// Remove subscriber
		unsubscribeFromIconStorage(storage, subscriber);
		expect(storage.subscribers.length).toBe(0);
	});

	it('loadIcon', async () => {
		const provider = getProvider();
		let resolveCount = 0;
		let gotNotification = 0;

		// Set loader
		setProviderLoader(provider, {
			loadIcon: (name) => {
				return new Promise((resolve) => {
					resolve(
						name.startsWith('error')
							? null
							: {
									body: `<g id="${name}" />`,
							  }
					);
					resolveCount++;
				});
			},
		});

		// Get storage
		const storage = getIconStorage(provider, 'test');

		// Set subscriber
		const subscriber = subscribeToIconStorage(
			storage,
			['icon1', 'icon2', 'error1'],
			() => {
				gotNotification++;
			}
		);
		expect(storage.subscribers.length).toBe(1);

		// Load icon1
		expect(getLoadedIcon(`@${provider}:test:icon1`)).toBeUndefined();
		expect(await loadIcon(`@${provider}:test:icon1`)).toEqual({
			body: '<g id="icon1" />',
		});
		expect(gotNotification).toBe(1);
		expect(resolveCount).toBe(1);
		expect(getLoadedIcon(`@${provider}:test:icon1`)).toEqual({
			body: '<g id="icon1" />',
		});

		// Load icon2
		expect(getLoadedIcon(`@${provider}:test:icon2`)).toBeUndefined();
		expect(
			await loadIcon({
				provider,
				prefix: 'test',
				name: 'icon2',
			})
		).toEqual({
			body: '<g id="icon2" />',
		});
		expect(gotNotification).toBe(2);
		expect(resolveCount).toBe(2);
		expect(getLoadedIcon(`@${provider}:test:icon2`)).toEqual({
			body: '<g id="icon2" />',
		});

		// Load icon2 again, should not trigger subscriber and loader
		expect(
			await loadIcon({
				// Use object format
				provider,
				prefix: 'test',
				name: 'icon2',
			})
		).toEqual({
			body: '<g id="icon2" />',
		});
		expect(gotNotification).toBe(2);
		expect(resolveCount).toBe(2);

		// Load error icon
		expect(getLoadedIcon(`@${provider}:test:error1`)).toBeUndefined();
		expect(
			await loadIcon({
				provider,
				prefix: 'test',
				name: 'error1',
			})
		).toBe(null);
		expect(gotNotification).toBe(3);
		expect(resolveCount).toBe(3);
		expect(getLoadedIcon(`@${provider}:test:error1`)).toBe(null);

		// Unsubscribe from storage, also check subscriber removal for loadIcon()
		unsubscribeFromIconStorage(storage, subscriber);
		expect(storage.subscribers.length).toBe(0);
	});

	it('loadIcon with missing provider', async () => {
		const provider = getProvider();
		let gotNotification = 0;

		// Get storage
		const storage = getIconStorage(provider, 'test');

		// Set subscriber, use wildcard
		const subscriber = subscribeToIconStorage(storage, ['*'], () => {
			gotNotification++;
		});
		expect(storage.subscribers.length).toBe(1);

		// Load icon1, should return null because provider does not have loader
		expect(await loadIcon(`@${provider}:test:icon1`)).toBe(null);
		expect(gotNotification).toBe(1);

		// Unsubscribe from storage, also check subscriber removal for loadIcon()
		unsubscribeFromIconStorage(storage, subscriber);
		expect(storage.subscribers.length).toBe(0);
	});

	it('API loader', async () => {
		// Get provider
		const provider = getProvider();

		// Set API loader
		setProviderLoader(
			provider,
			createIconifyAPILoader([
				'https://api.iconify.design',
				'https://api.simplesvg.com',
				'https://api.unisvg.com',
			])
		);

		// Load one icon
		const mdiHome = await loadIcon(`@${provider}:mdi:home`);
		expect(mdiHome).toBeTruthy();
		expect(mdiHome?.width).toBe(24);
		expect(mdiHome?.height).toBe(24);

		// Load multiple icons
		let lastLoaded: string[] | null = null;
		let lastMissing: string[] | null = null;
		let lastPending: string[] | null = null;
		const abort = loadIconsWithCallback(
			[
				'mdi:home',
				'material-symbols:arrow-left',
				'material-symbols:arrow-left-rounded',
				'material-symbols-light:arrow-left',
				'material-symbols-light:arrow-left-rounded',
				'mdi:arrow-left',
				'mdi:arrow-left-bold',
				'mdi:arrow-left-thin',
				// No such icons
				'mdi-broken:arrow-left',
				'mdi-broken:arrow-left-bold',
				'mdi-broken:arrow-left-thin',
			].map((name) => `@${provider}:${name}`),
			(loaded, missing, pending) => {
				lastLoaded = loaded;
				lastMissing = missing;
				lastPending = pending;

				// Debug
				/*
				console.log('Loaded:', loaded);
				console.log('Missing:', missing);
				console.log('Pending:', pending);
				*/
			}
		);

		// Wait for up to 2 seconds
		await testForUpdate(
			() => lastPending !== null && lastPending.length === 0,
			10,
			200
		);
		abort();

		// Check that all icons loaded
		expect(lastPending).toEqual([]);
		expect(lastMissing).toEqual(
			[
				'mdi-broken:arrow-left',
				'mdi-broken:arrow-left-bold',
				'mdi-broken:arrow-left-thin',
			].map((name) => `@${provider}:${name}`)
		);
		expect(lastLoaded!.length).toBe(8);

		// Test few icons
		expect(getLoadedIcon(`@${provider}:mdi:home`)).toBeTruthy();
		expect(
			getLoadedIcon(`@${provider}:material-symbols:arrow-left`)
		).toBeTruthy();
		expect(getLoadedIcon(`@${provider}:mdi-broken:arrow-left`)).toBeNull();
	});
});
