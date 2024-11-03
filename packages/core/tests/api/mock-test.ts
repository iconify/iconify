import { addAPIProvider } from '../../lib/api/config';
import { setAPIModule } from '../../lib/api/modules';
import { loadIcons } from '../../lib/api/icons';
import type { IconifyMockAPIDelayDoneCallback } from '../../lib/api/modules/mock';
import { mockAPIModule, mockAPIData } from '../../lib/api/modules/mock';
import { getStorage, iconInStorage } from '../../lib/storage/storage';
import { sendAPIQuery } from '../../lib/api/query';

describe('Testing mock API module', () => {
	let prefixCounter = 0;
	function nextPrefix(): string {
		prefixCounter++;
		return (
			'api-mock-' +
			(prefixCounter < 10 ? '0' : '') +
			prefixCounter.toString()
		);
	}

	// Set API module for provider
	const provider = nextPrefix();

	beforeEach(() => {
		addAPIProvider(provider, {
			resources: ['https://api1.local'],
		});
		setAPIModule(provider, mockAPIModule);
	});

	// Tests
	it('404 response', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			let isSync = true;

			try {
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					icons: ['test1', 'test2'],
					response: 404,
				});

				loadIcons(
					[
						{
							provider,
							prefix,
							name: 'test1',
						},
					],
					(loaded, missing, pending) => {
						try {
							expect(isSync).toBe(false);
							expect(loaded).toEqual([]);
							expect(pending).toEqual([]);
							expect(missing).toEqual([
								{
									provider,
									prefix,
									name: 'test1',
								},
							]);
						} catch (error) {
							reject(error);
							return;
						}
						resolve(true);
					}
				);
			} catch (error) {
				reject(error);
			}

			isSync = false;
		});
	});

	it('Load few icons', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			let isSync = true;

			try {
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					response: {
						prefix,
						icons: {
							test10: {
								body: '<g />',
							},
							test11: {
								body: '<g />',
							},
						},
					},
				});
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					response: {
						prefix,
						icons: {
							test20: {
								body: '<g />',
							},
							test21: {
								body: '<g />',
							},
						},
					},
				});
				// Data with invalid name: should not be requested from API because name is invalid
				// Split from main data because otherwise it would load when other icons are requested
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					response: {
						prefix,
						icons: {
							BadName: {
								body: '<g />',
							},
						},
					},
				});

				loadIcons(
					[
						{
							provider,
							prefix,
							name: 'test10',
						},
						{
							provider,
							prefix,
							name: 'test20',
						},
						{
							provider,
							prefix,
							name: 'BadName',
						},
					],
					(loaded, missing, pending) => {
						try {
							if (pending.length) {
								// Not ready to test yet
								return;
							}

							expect(isSync).toBe(false);
							// All icons should have been loaded because API waits one tick before sending response, during which both queries are processed
							expect(loaded).toEqual([
								{
									provider,
									prefix,
									name: 'test10',
								},
								{
									provider,
									prefix,
									name: 'test20',
								},
							]);
							expect(pending).toEqual([]);
							expect(missing).toEqual([
								{
									provider,
									prefix,
									name: 'BadName',
								},
							]);
						} catch (error) {
							reject(error);
							return;
						}
						resolve(true);
					}
				);
			} catch (error) {
				reject(error);
			}

			isSync = false;
		});
	});

	it('Load in batches and testing delay', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			let next: IconifyMockAPIDelayDoneCallback | undefined;
			let callbackCounter = 0;

			try {
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					response: {
						prefix,
						icons: {
							test10: {
								body: '<g />',
							},
							test11: {
								body: '<g />',
							},
						},
					},
				});
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					response: {
						prefix,
						icons: {
							test20: {
								body: '<g />',
							},
							test21: {
								body: '<g />',
							},
						},
					},
					delay: (callback) => {
						next = callback;
					},
				});

				loadIcons(
					[
						{
							provider,
							prefix,
							name: 'test10',
						},
						{
							provider,
							prefix,
							name: 'test20',
						},
					],
					(loaded, missing, pending) => {
						callbackCounter++;
						try {
							switch (callbackCounter) {
								case 1:
									// First load: only 'test10'
									expect(loaded).toEqual([
										{
											provider,
											prefix,
											name: 'test10',
										},
									]);
									expect(pending).toEqual([
										{
											provider,
											prefix,
											name: 'test20',
										},
									]);

									// Send second response
									expect(typeof next).toBe('function');
									next!();
									break;

								case 2:
									// All icons should have been loaded
									expect(loaded).toEqual([
										{
											provider,
											prefix,
											name: 'test10',
										},
										{
											provider,
											prefix,
											name: 'test20',
										},
									]);
									expect(missing).toEqual([]);
									resolve(true);
									break;

								default:
									reject(
										'Callback was called more times than expected'
									);
							}
						} catch (error) {
							reject(error);
						}
					}
				);
			} catch (error) {
				reject(error);
			}
		});
	});

	// This is useful for testing component where loadIcons() cannot be accessed
	it('Using timer in callback for second test', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			const name = 'test1';

			try {
				// Mock data
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					response: {
						prefix,
						icons: {
							[name]: {
								body: '<g />',
							},
						},
					},
					delay: (next) => {
						try {
							// Icon should not be loaded yet
							const storage = getStorage(provider, prefix);
							expect(iconInStorage(storage, name)).toBe(false);

							// Set data
							next();

							// Icon should be loaded now
							expect(iconInStorage(storage, name)).toBe(true);
						} catch (error) {
							reject(error);
							return;
						}
						resolve(true);
					},
				});

				// Load icons
				loadIcons([
					{
						provider,
						prefix,
						name,
					},
				]);
			} catch (error) {
				reject(error);
			}
		});
	});

	it('Custom query', () => {
		return new Promise((resolve, reject) => {
			let isSync = true;

			try {
				mockAPIData({
					type: 'custom',
					provider,
					uri: '/test',
					response: {
						foo: true,
					},
				});

				sendAPIQuery(
					provider,
					{
						type: 'custom',
						provider,
						uri: '/test',
					},
					(data, error) => {
						try {
							expect(error).toBeUndefined();
							expect(data).toEqual({
								foo: true,
							});
							expect(isSync).toBe(false);
						} catch (error) {
							reject(error);
							return;
						}
						resolve(true);
					}
				);
			} catch (error) {
				reject(error);
			}

			isSync = false;
		});
	});

	it('Custom query with host', () => {
		return new Promise((resolve, reject) => {
			const host = 'http://' + nextPrefix();
			let isSync = true;

			try {
				setAPIModule(host, mockAPIModule);
				mockAPIData({
					type: 'host',
					host,
					uri: '/test',
					response: {
						foo: 2,
					},
				});

				sendAPIQuery(
					{
						resources: [host],
					},
					{
						type: 'custom',
						uri: '/test',
					},
					(data, error) => {
						try {
							expect(error).toBeUndefined();
							expect(data).toEqual({
								foo: 2,
							});
							expect(isSync).toBe(false);
						} catch (error) {
							reject(error);
							return;
						}
						resolve(true);
					}
				);
			} catch (error) {
				reject(error);
			}

			isSync = false;
		});
	});

	it('not_found response', () => {
		return new Promise((resolve, reject) => {
			const prefix = nextPrefix();
			let isSync = true;

			try {
				mockAPIData({
					type: 'icons',
					provider,
					prefix,
					icons: ['test1', 'test2'],
					response: {
						prefix,
						icons: {},
						not_found: ['test1', 'test2'],
					},
				});

				loadIcons(
					[
						{
							provider,
							prefix,
							name: 'test1',
						},
					],
					(loaded, missing, pending) => {
						try {
							expect(isSync).toBe(false);
							expect(loaded).toEqual([]);
							expect(pending).toEqual([]);
							expect(missing).toEqual([
								{
									provider,
									prefix,
									name: 'test1',
								},
							]);
						} catch (error) {
							reject(error);
							return;
						}
						resolve(true);
					}
				);
			} catch (error) {
				reject(error);
			}

			isSync = false;
		});
	});
});
