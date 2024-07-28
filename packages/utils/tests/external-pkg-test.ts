import { describe } from 'vitest';
import { loadNodeIcon } from '../lib/loader/node-loader';
import { createExternalPackageIconLoader } from '../lib/loader/external-pkg';

describe('external-pkg', () => {
	test('loadNodeIcon works with importModule and plain package name', async () => {
		const result = await loadNodeIcon('plain-color-icons', 'about', {
			customCollections:
				createExternalPackageIconLoader('plain-color-icons'),
		});
		expect(result).toBeTruthy();
	});

	test('loadNodeIcon works with importModule and scoped package name', async () => {
		const result = await loadNodeIcon('test-color-icons', 'about', {
			customCollections: createExternalPackageIconLoader(
				'@test-scope/test-color-icons'
			),
		});
		expect(result).toBeTruthy();
	});
});
