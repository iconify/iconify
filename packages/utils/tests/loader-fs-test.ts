import { loadCollectionFromFS } from '../src/loader/fs.js';

describe('Testing FS loader', () => {
	it('Load fa6-regular', async () => {
		const result = await loadCollectionFromFS('fa6-regular', false);
		expect(result).toBeDefined();
		expect(result!.prefix).toBe('fa6-regular');
	});
});
