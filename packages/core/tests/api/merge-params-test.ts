import { mergeParams } from '../../lib/api/params';

describe('Testing mergeParams', () => {
	it('mergeParams()', () => {
		// Nothing
		expect(mergeParams('/foo', {})).toBe('/foo');

		// Simple variables
		expect(
			mergeParams('/foo', {
				foo: 1,
				bar: 'baz',
				baz: true,
			})
		).toBe('/foo?foo=1&bar=baz&baz=true');

		// More parameters to existing query
		expect(
			mergeParams('/foo?bar=baz', {
				foo: false,
			})
		).toBe('/foo?bar=baz&foo=false');

		// Escaping characters
		expect(
			mergeParams('/foo', {
				'2&2': '1=1',
				'3 z': '?3',
			})
		).toBe('/foo?2%262=1%3D1&3%20z=%3F3');
	});
});
