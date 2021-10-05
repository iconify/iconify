import type { IconifyInfo } from '@iconify/types';
import { convertIconSetInfo } from '../lib/icon-set/convert-info';

describe('Testing convertIconSetInfo', () => {
	test('Simple info', () => {
		let result, expected: IconifyInfo;

		// Empty block
		result = convertIconSetInfo({});
		expect(result).toBeNull();

		// Block with name
		result = convertIconSetInfo({
			name: 'Foo',
		});
		expected = {
			name: 'Foo',
			version: '',
			total: 0,
			author: {
				name: 'Unknown',
				url: '',
			},
			license: {
				title: 'Unknown',
				spdx: '',
				url: '',
			},
			samples: [],
			palette: false,
			category: '',
		};
		expect(result).toEqual(expected);

		// Block with name passed as "title" and prefix
		result = convertIconSetInfo({
			prefix: 'foo',
			title: 'Foo',
		});
		expect(result).toEqual(expected);

		// Mismatched prefixes
		result = convertIconSetInfo(
			{
				name: 'Foo',
				prefix: 'bar',
			},
			'foo'
		);
		expect(result).toEqual(null);

		// Author in old format
		// License in old format
		// Height as string
		// Long samples list (limited to 3)
		// Palette as boolean
		result = convertIconSetInfo({
			prefix: 'foo',
			title: 'Foo',
			author: 'Author',
			url: 'https://localhost/',
			license: 'MIT',
			licenseID: 'MIT',
			licenseURL: 'https://license.local/',
			height: '24',
			samples: ['arrow-left', 'arrow-right', 'arrow-up', 'arrow-down'],
			palette: true,
		});
		expected = {
			name: 'Foo',
			version: '',
			total: 0,
			author: {
				name: 'Author',
				url: 'https://localhost/',
			},
			license: {
				title: 'MIT',
				spdx: 'MIT',
				url: 'https://license.local/',
			},
			height: 24,
			samples: ['arrow-left', 'arrow-right', 'arrow-up'],
			displayHeight: 24,
			palette: true,
			category: '',
		};
		expect(result).toEqual(expected);

		// Author in new format, missing optional fields
		// License in new format, missing optional fields
		// Height as array of numbers and strings
		// Palette as string
		// Total as string
		result = convertIconSetInfo({
			prefix: 'foo',
			title: 'Foo',
			total: '100',
			author: {
				name: 'Author',
			},
			license: {
				title: 'BSD',
			},
			height: [16, '18'],
			palette: 'Colorful',
		});
		expected = {
			name: 'Foo',
			version: '',
			total: 100,
			author: {
				name: 'Author',
				url: '',
			},
			license: {
				title: 'BSD',
				spdx: '',
				url: '',
			},
			height: [16, 18],
			samples: [],
			palette: true,
			category: '',
		};
		expect(result).toEqual(expected);

		// All data in new format
		result = convertIconSetInfo({
			name: 'Foo',
			version: '1.0.0',
			total: 100,
			author: {
				name: 'Author',
				url: 'https://author.local/',
			},
			license: {
				title: 'BSD',
				spdx: 'BSD',
				url: 'https://license.local/',
			},
			height: 32,
			displayHeight: 24,
			samples: ['home', 'pin', 'alert'],
			palette: false,
			category: 'Thematic',
		});
		expected = {
			name: 'Foo',
			version: '1.0.0',
			total: 100,
			author: {
				name: 'Author',
				url: 'https://author.local/',
			},
			license: {
				title: 'BSD',
				spdx: 'BSD',
				url: 'https://license.local/',
			},
			height: 32,
			displayHeight: 24,
			samples: ['home', 'pin', 'alert'],
			palette: false,
			category: 'Thematic',
		};
		expect(result).toEqual(expected);
	});

	test('Testing legacy format', () => {
		// Test "info" field from ant-design.json
		const raw = {
			name: 'Ant Design Icons',
			total: 728,
			author: 'HeskeyBaozi',
			url: 'https://github.com/ant-design/ant-design-icons',
			license: 'MIT',
			height: 16,
			samples: ['pushpin', 'pie-chart-outline', 'user-add-outline'],
			palette: 'Colorless',
			category: 'General',
		};
		const result = convertIconSetInfo(raw);
		const expected: IconifyInfo = {
			name: 'Ant Design Icons',
			version: '',
			total: 728,
			author: {
				name: 'HeskeyBaozi',
				url: 'https://github.com/ant-design/ant-design-icons',
			},
			license: {
				title: 'MIT',
				spdx: '',
				url: '',
			},
			height: 16,
			samples: ['pushpin', 'pie-chart-outline', 'user-add-outline'],
			displayHeight: 16,
			palette: false,
			category: 'General',
		};
		expect(result).toEqual(expected);
	});

	test('Testing FontAwesome 4', () => {
		// Test "info" field from legacy fa.json
		const raw = {
			name: 'Font Awesome 4',
			total: 678,
			author: 'Dave Gandy',
			url: 'http://fontawesome.io/',
			license: 'Open Font License',
			licenseURL:
				'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL',
			samples: ['wrench', 'bell-o', 'user-o'],
			version: '4.7.0',
			palette: 'Colorless',
			category: 'General',
		};
		const result = convertIconSetInfo(raw);
		const expected: IconifyInfo = {
			name: 'Font Awesome 4',
			total: 678,
			author: {
				name: 'Dave Gandy',
				url: 'http://fontawesome.io/',
			},
			license: {
				title: 'Open Font License',
				spdx: '',
				url: 'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL',
			},
			samples: ['wrench', 'bell-o', 'user-o'],
			version: '4.7.0',
			palette: false,
			category: 'General',
		};
		expect(result).toEqual(expected);
	});

	test('Already converted item', () => {
		const item: IconifyInfo = {
			name: 'Font Awesome 4',
			total: 678,
			author: {
				name: 'Dave Gandy',
				url: 'http://fontawesome.io/',
			},
			license: {
				title: 'Open Font License',
				spdx: '',
				url: 'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL',
			},
			samples: ['wrench', 'bell-o', 'user-o'],
			version: '4.7.0',
			palette: false,
			category: 'General',
		};
		const result = convertIconSetInfo(item);

		expect(result).toEqual(item);
	});
});
