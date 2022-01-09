import { replaceIDs } from '@iconify/utils/lib/svg/id';

describe('Testing replaceIDs', () => {
	it('Simple code', () => {
		const body =
			'<defs><path id="test1"></defs><use fill="#FFA000" xlink:href="#test1"/>';
		const expected =
			'<defs><path id="callback0"></defs><use fill="#FFA000" xlink:href="#callback0"/>';

		// Using callback
		let counter = 0;
		expect(replaceIDs(body, () => 'callback' + counter++)).toBe(expected);
	});
});
