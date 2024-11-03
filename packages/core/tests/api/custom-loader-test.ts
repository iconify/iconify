import { defaultIconProps } from '@iconify/utils';
import { loadIcons, loadIcon } from '../../lib/api/icons';
import {
	setCustomIconsLoader,
	setCustomIconLoader,
} from '../../lib/api/loaders';
import { listIcons } from '../../lib/storage/storage';

describe('Testing API loadIcons', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return `CustomLoaderTest_${prefixCounter}`;
	}

	it('Custom async loader for multiple icons with loadIcon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set loader
			setCustomIconsLoader(
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
								// Use reserved keyword that can break objects not created with Object.create(null)
								constructor: {
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
							`@${provider}:${prefix}:constructor`,
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

	it('Custom sync loader for multiple icons with loadIcon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set loader
			setCustomIconsLoader(
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
							// Use reserved keyword that can break objects not created with Object.create(null)
							constructor: {
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
							`@${provider}:${prefix}:constructor`,
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

	it('Loader multiple icons with missing icons', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix1 = nextPrefix();
			const prefix2 = nextPrefix();

			// Set loaders: one is sync, one is async
			setCustomIconsLoader(
				(icons, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(icons).toEqual(['constructor']);
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
							constructor: {
								body: '<path d="" />',
							},
						},
					};
				},
				prefix1,
				provider
			);
			setCustomIconsLoader(
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

			// Load icons
			loadIcons(
				[
					`${provider}:${prefix1}:constructor`,
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
								name: 'constructor',
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
							`@${provider}:${prefix1}:constructor`,
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

	it('Custom async loader for one icon with loadIcon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set loader
			setCustomIconLoader(
				(name, requestedPrefix, requestedProvider) => {
					return new Promise((resolve, reject) => {
						try {
							// Check params
							expect(name).toBe('constructor');
							expect(requestedPrefix).toBe(prefix);
							expect(requestedProvider).toBe(provider);
						} catch (err) {
							reject(err);
							return;
						}

						// Send data
						resolve({
							body: '<path d="" />',
						});
					});
				},
				prefix,
				provider
			);

			// Load icon
			loadIcon(provider + ':' + prefix + ':constructor')
				.then((data) => {
					try {
						// Test response
						expect(data).toEqual({
							...defaultIconProps,
							body: '<path d="" />',
						});

						// Check storage
						expect(listIcons(provider, prefix)).toEqual([
							`@${provider}:${prefix}:constructor`,
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

	it('Loader multiple icons with loader for one icon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix1 = nextPrefix();
			const prefix2 = nextPrefix();

			const iconsToTest: Record<string, Set<string>> = {
				[prefix1]: new Set(['constructor']),
				[prefix2]: new Set(['Icon_2', 'BadIcon']),
			};

			// Set loaders: one is sync, one is async
			setCustomIconLoader(
				(requestedName, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(requestedPrefix).toBe(prefix1);
						expect(requestedProvider).toBe(provider);
						expect(
							iconsToTest[prefix1].has(requestedName)
						).toBeTruthy();
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data
					return {
						body: `<g data-name="${requestedName}" />`,
					};
				},
				prefix1,
				provider
			);
			setCustomIconLoader(
				(requestedName, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(requestedPrefix).toBe(prefix2);
						expect(requestedProvider).toBe(provider);
						expect(
							iconsToTest[prefix2].has(requestedName)
						).toBeTruthy();
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data asynchronously, without 'BadIcon'
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								requestedName === 'BadIcon'
									? null
									: {
											body: `<g data-name="${requestedName}" />`,
									  }
							);
						}, 150);
					});
				},
				prefix2,
				provider
			);

			// Load icons
			loadIcons(
				[
					`${provider}:${prefix1}:constructor`,
					`${provider}:${prefix2}:Icon_2`,
					`${provider}:${prefix2}:BadIcon`,
				],
				(loaded, missing, pending) => {
					if (pending.length) {
						// Could be called before all icons are loaded because multiple async requests
						return;
					}

					try {
						// Test response
						expect(loaded).toEqual([
							{
								provider,
								prefix: prefix1,
								name: 'constructor',
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
							`@${provider}:${prefix1}:constructor`,
						]);
						expect(listIcons(provider, prefix2)).toEqual([
							`@${provider}:${prefix2}:Icon_2`,
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

	it('Loaders for one and multiple icons, requesting one icon', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();
			const name = 'TestIcon';

			// Set loaders: one is sync, one is async
			setCustomIconLoader(
				(requestedName, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(requestedPrefix).toBe(prefix);
						expect(requestedProvider).toBe(provider);
						expect(requestedName).toBe(name);
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data
					return {
						body: `<g data-name="${requestedName}" />`,
					};
				},
				prefix,
				provider
			);
			setCustomIconsLoader(
				() => {
					reject(
						new Error(
							'Loader for multple icons should not be called'
						)
					);
					return null;
				},
				prefix,
				provider
			);

			// Load icon
			loadIcons(
				[`${provider}:${prefix}:${name}`],
				(loaded, missing, pending) => {
					try {
						// Test response
						expect(loaded).toEqual([
							{
								provider,
								prefix,
								name,
							},
						]);
						expect(missing).toEqual([]);
						expect(pending).toEqual([]);

						// Check storage
						expect(listIcons(provider, prefix)).toEqual([
							`@${provider}:${prefix}:${name}`,
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

	it('Loaders for one and multiple icons, requesting multiple icons', () => {
		return new Promise((resolve, reject) => {
			const provider = nextPrefix();
			const prefix = nextPrefix();

			// Set loaders: one is sync, one is async
			setCustomIconsLoader(
				(requestedNames, requestedPrefix, requestedProvider) => {
					try {
						// Check params
						expect(requestedPrefix).toBe(prefix);
						expect(requestedProvider).toBe(provider);
						expect(requestedNames).toEqual(['Icon_1', 'Icon_2']);
					} catch (err) {
						reject(err);
						return null;
					}

					// Send data
					return {
						prefix,
						icons: {
							Icon_1: {
								body: `<g data-name="Icon_1" />`,
							},
							Icon_3: {
								body: `<g data-name="Icon_3" />`,
							},
						},
					};
				},
				prefix,
				provider
			);
			setCustomIconLoader(
				() => {
					reject(
						new Error('Loader for one icon should not be called')
					);
					return null;
				},
				prefix,
				provider
			);

			// Load icon
			loadIcons(
				[
					`${provider}:${prefix}:Icon_1`,
					`${provider}:${prefix}:Icon_2`,
				],
				(loaded, missing, pending) => {
					try {
						// Test response
						expect(loaded).toEqual([
							{
								provider,
								prefix,
								name: 'Icon_1',
							},
						]);
						expect(missing).toEqual([
							{
								provider,
								prefix,
								name: 'Icon_2',
							},
						]);
						expect(pending).toEqual([]);

						// Check storage
						expect(listIcons(provider, prefix)).toEqual([
							`@${provider}:${prefix}:Icon_1`,
							`@${provider}:${prefix}:Icon_3`,
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
