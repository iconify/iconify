import { createIconStorage } from '../src/storage/create.js';
import {
	subscribeToIconStorage,
	unsubscribeFromIconStorage,
} from '../src/storage/subscription.js';

describe('Testing icon storage', () => {
	async function testForUpdate(test: () => boolean, limit = 10) {
		for (let i = 0; i < limit; i++) {
			// Wait for next tick
			await new Promise((resolve) => setTimeout(resolve, 0));

			// Check if test passed
			if (test()) {
				return i;
			}
		}
		return -1;
	}

	it('Basic storage functionality', () => {
		// Create storage
		const storage = createIconStorage();
		expect(storage.icons).toEqual({});
		expect(storage.missing.size).toBe(0);
		expect(storage.pending.size).toBe(0);

		// Add icon
		storage.update('test', {
			body: '<g />',
		});
		expect(storage.icons).toEqual({
			test: {
				body: '<g />',
			},
		});
		expect(storage.missing.size).toBe(0);
		expect(storage.pending.size).toBe(0);

		// Add missing icon
		storage.update('test2', null);
		expect(storage.icons).toEqual({
			test: {
				body: '<g />',
			},
		});
		expect(Array.from(storage.missing)).toEqual(['test2']);
		expect(storage.pending.size).toBe(0);
	});

	it('Subscribers', async () => {
		let test1Count = 0;
		let test2Count = 0;
		let allCount = 0;

		let expected1Count = 0;
		let expected2Count = 0;
		let expectedAllCount = 0;

		// Create storage
		const storage = createIconStorage();

		// Subscribe to icon updates
		subscribeToIconStorage(
			storage,
			['test1', 'test2', 'test2b', 'test2c'],
			() => {
				allCount++;
			}
		);
		const test1Subscriber = subscribeToIconStorage(
			storage,
			['test1'],
			() => {
				test1Count++;
			}
		);
		subscribeToIconStorage(storage, ['test2', 'test2b', 'test2c'], () => {
			test2Count++;
		});
		expect(test1Count).toBe(0);

		// Add icon, should not trigger any updates syncrhonously
		storage.update('test1', {
			body: '<g />',
		});
		expect(test1Count).toBe(0);
		expect(test2Count).toBe(0);
		expect(allCount).toBe(0);

		// Wait for update
		expected1Count++;
		expectedAllCount++;
		await testForUpdate(() => allCount === expectedAllCount);
		expect(test1Count).toBe(expected1Count);
		expect(test2Count).toBe(expected2Count);
		expect(allCount).toBe(expectedAllCount);

		// Update icon again
		storage.update('test1', null);
		expected1Count++;
		expectedAllCount++;

		await testForUpdate(() => allCount === expectedAllCount);
		expect(test1Count).toBe(expected1Count);
		expect(test2Count).toBe(expected2Count);
		expect(allCount).toBe(expectedAllCount);

		// Update multiple icons
		storage.update('test1', null); // Should not trigger update, so do not change expected1Count
		storage.update('test2', null);
		storage.update('test2b', null);
		storage.update('test2c', null);
		expected2Count++;
		expectedAllCount++;

		await testForUpdate(() => allCount === expectedAllCount);
		expect(test1Count).toBe(expected1Count);
		expect(test2Count).toBe(expected2Count);
		expect(allCount).toBe(expectedAllCount);

		// Remove subscriber
		unsubscribeFromIconStorage(storage, test1Subscriber);

		// Update icon again
		storage.update('test1', {
			body: '<g />',
		});
		expectedAllCount++;

		await testForUpdate(() => allCount === expectedAllCount);
		expect(test1Count).toBe(expected1Count);
		expect(test2Count).toBe(expected2Count);
		expect(allCount).toBe(expectedAllCount);
	});
});
