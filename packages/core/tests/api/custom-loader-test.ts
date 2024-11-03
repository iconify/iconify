import { defaultIconProps } from '@iconify/utils';
import { loadIcons, loadIcon } from '../../lib/api/icons';
import { setCustomLoader } from '../../lib/api/loaders';
import { listIcons } from '../../lib/storage/storage';

describe('Testing API loadIcons', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return `loader-test-${prefixCounter < 10 ? '0' : ''}${prefixCounter}`;
	}

	it('Custom async loader with loadIcon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set loader
			setCustomLoader(
				(icons, requestedPrefix, requestedProvider) => {
					return new Promise((resolve, reject) => {
						try {
							// Check params
							expect(icons).toEqual(['icon1']);
							expect(requestedPrefix).toBe(prefix);
							expect(requestedProvider).toBe(provider);
						} catch (err) {
							reject(err);
							return;
						}

						// Send data
						resolve({
							prefix,
							icons: {
								icon1: {
									body: '<path d="" />',
								},
								icon_2: {
									body: '<path d="" />',
								},
							},
						});
					});
				},
				prefix,
				provider
			);

			// Load icon
			loadIcon(provider + ':' + prefix + ':icon1')
				.then((data) => {
					try {
						// Test response
						expect(data).toEqual({
							...defaultIconProps,
							body: '<path d="" />',
						});

						// Check storage
						expect(listIcons(provider, prefix)).toEqual([
							`@${provider}:${prefix}:icon1`,
							`@${provider}:${prefix}:icon_2`,
						]);
					} catch (err) {
						reject(err);
						return;
					}
					resolve(true);
				})
				.catch(reject);
		});
	});

	it('Custom sync loader with loadIcon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set loader
			setCustomLoader(
				(icons, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(icons).toEqual(['Icon_1']);
						expect(requestedPrefix).toBe(prefix);
						expect(requestedProvider).toBe(provider);
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data
					return {
						prefix,
						icons: {
							// Use name that is not allowed in API
							Icon_1: {
								body: '<path d="" />',
							},
						},
					};
				},
				prefix,
				provider
			);

			// Load icon
			loadIcon(`${provider}:${prefix}:Icon_1`)
				.then((data) => {
					try {
						// Test response
						expect(data).toEqual({
							...defaultIconProps,
							body: '<path d="" />',
						});

						// Check storage
						expect(listIcons(provider, prefix)).toEqual([
							`@${provider}:${prefix}:Icon_1`,
						]);
					} catch (err) {
						reject(err);
						return;
					}
					resolve(true);
				})
				.catch(reject);
		});
	});

	it('Missing icons', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix1 = nextPrefix();
			const prefix2 = nextPrefix();

			// Set loaders: one is sync, one is async
			setCustomLoader(
				(icons, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(icons).toEqual(['icon1']);
						expect(requestedPrefix).toBe(prefix1);
						expect(requestedProvider).toBe(provider);
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data
					return {
						prefix: prefix1,
						icons: {
							icon1: {
								body: '<path d="" />',
							},
						},
					};
				},
				prefix1,
				provider
			);
			setCustomLoader(
				(icons, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(icons).toEqual(['BadIcon', 'Icon_2']);
						expect(requestedPrefix).toBe(prefix2);
						expect(requestedProvider).toBe(provider);
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data asynchronously, without 'BadIcon'
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({
								prefix: prefix2,
								icons: {
									Icon_1: {
										body: '<path d="" />',
									},
									Icon_2: {
										body: '<path d="" />',
									},
									Icon_3: {
										body: '<path d="" />',
									},
								},
							});
						}, 150);
					});
				},
				prefix2,
				provider
			);

			// Load icon
			loadIcons(
				[
					`${provider}:${prefix1}:icon1`,
					`${provider}:${prefix2}:Icon_2`,
					`${provider}:${prefix2}:BadIcon`,
				],
				(loaded, missing, pending) => {
					if (pending.length) {
						// Could be called before all icons are loaded because of async loader
						return;
					}

					try {
						// Test response
						expect(loaded).toEqual([
							{
								provider,
								prefix: prefix1,
								name: 'icon1',
							},
							{
								provider,
								prefix: prefix2,
								name: 'Icon_2',
							},
						]);
						expect(missing).toEqual([
							{
								provider,
								prefix: prefix2,
								name: 'BadIcon',
							},
						]);

						// Check storage
						expect(listIcons(provider, prefix1)).toEqual([
							`@${provider}:${prefix1}:icon1`,
						]);
						expect(listIcons(provider, prefix2)).toEqual([
							`@${provider}:${prefix2}:Icon_1`,
							`@${provider}:${prefix2}:Icon_2`,
							`@${provider}:${prefix2}:Icon_3`,
						]);
					} catch (err) {
						reject(err);
						return;
					}
					resolve(true);
				}
			);
		});
	});
});
