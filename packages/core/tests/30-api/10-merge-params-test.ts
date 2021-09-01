import 'mocha';
import { expect } from 'chai';
import { mergeParams } from '../../lib/api/params';

describe('Testing mergeParams', () => {
	it('mergeParams()', () => {
		// Nothing
		expect(mergeParams('/foo', {})).to.be.equal('/foo');

		// Simple variables
		expect(
			mergeParams('/foo', {
				foo: 1,
				bar: 'baz',
				baz: true,
			})
		).to.be.equal('/foo?foo=1&bar=baz&baz=true');

		// More parameters to existing query
		expect(
			mergeParams('/foo?bar=baz', {
				foo: false,
			})
		).to.be.equal('/foo?bar=baz&foo=false');

		// Escaping characters
		expect(
			mergeParams('/foo', {
				'2&2': '1=1',
				'3 z': '?3',
			})
		).to.be.equal('/foo?2%262=1%3D1&3%20z=%3F3');
	});
});
