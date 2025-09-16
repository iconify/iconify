import { splitIconNames } from '../src/icon-lists/split.js';

describe('Testing icon names', () => {
	it('Split names', () => {
		expect(
			splitIconNames(['mdi:home', 'mdi:account', 'mdi:settings'])
		).toEqual({
			'': {
				mdi: ['home', 'account', 'settings'],
			},
		});

		expect(
			splitIconNames([
				'mdi-light:account',
				'@local:mdi:account',
				'mdi:account',
				// As object
				{
					provider: '',
					prefix: 'mdi',
					name: 'user',
				},
				// Duplicate entry
				'mdi:account',
				// Bad name: missing prefix
				'test',
			])
		).toEqual({
			'': {
				'mdi': ['account', 'user'],
				'mdi-light': ['account'],
			},
			'local': {
				mdi: ['account'],
			},
		});
	});
});
