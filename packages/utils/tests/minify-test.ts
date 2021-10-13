import type { IconifyJSON } from '@iconify/types';
import { minifyIconSet } from '../lib/icon-set/minify';

describe('Testing minifying icon set', () => {
	test('Nothing to minify', () => {
		const item: IconifyJSON = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
					height: 24,
				},
			},
		};
		const expected: IconifyJSON = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
					height: 24,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	test('No common values', () => {
		const item: IconifyJSON = {
			prefix: 'foo',
			icons: {
				'foo-24': {
					body: '<g />',
					width: 24,
					height: 24,
				},
				'foo-16': {
					body: '<g />',
					width: 12,
					height: 12,
				},
			},
		};
		const expected: IconifyJSON = {
			prefix: 'foo',
			icons: {
				'foo-24': {
					body: '<g />',
					width: 24,
					height: 24,
				},
				'foo-16': {
					body: '<g />',
					width: 12,
					height: 12,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	test('Default values', () => {
		const item: IconifyJSON = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
					// Height matches default
					height: 16,
				},
				bar: {
					body: '<g />',
					// Width matches default
					width: 16,
					height: 12,
				},
			},
		};
		const expected: IconifyJSON = {
			prefix: 'foo',
			icons: {
				foo: {
					body: '<g />',
					width: 24,
				},
				bar: {
					body: '<g />',
					height: 12,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	test('Default values in icon', () => {
		const item: IconifyJSON = {
			prefix: 'bar',
			icons: {
				'chrome-maximize': {
					body: '<g fill="currentColor"><path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/></g>',
					width: 24,
					height: 24,
					hidden: true,
				},
				'chrome-minimize': {
					body: '<g fill="currentColor"><path d="M14 8v1H3V8h11z"/></g>',
					width: 24,
					height: 24,
					hidden: true,
				},
				'remove': {
					body: '<g fill="currentColor"><path d="M15 8H1V7h14v1z"/></g>',
				},
			},
		};
		const expected: IconifyJSON = {
			prefix: 'bar',
			icons: {
				'chrome-maximize': {
					body: '<g fill="currentColor"><path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/></g>',
					hidden: true,
				},
				'chrome-minimize': {
					body: '<g fill="currentColor"><path d="M14 8v1H3V8h11z"/></g>',
					hidden: true,
				},
				'remove': {
					body: '<g fill="currentColor"><path d="M15 8H1V7h14v1z"/></g>',
					width: 16,
					height: 16,
				},
			},
			width: 24,
			height: 24,
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	test('Common value', () => {
		const item: IconifyJSON = {
			prefix: 'foo',
			icons: {
				// 2 icons have the same height, 2 icons have the same width
				'foo-wide': {
					body: '<g />',
					width: 32,
					height: 24,
				},
				'foo-square': {
					body: '<g />',
					width: 24,
					height: 24,
				},
				'foo-tiny-wide': {
					body: '<g />',
					width: 24,
					height: 16,
				},
				'foo-tiny-square': {
					body: '<g />',
					width: 16,
					height: 16,
				},
			},
		};
		const expected: IconifyJSON = {
			prefix: 'foo',
			icons: {
				'foo-wide': {
					body: '<g />',
					width: 32,
				},
				'foo-square': {
					body: '<g />',
				},
				'foo-tiny-wide': {
					body: '<g />',
					height: 16,
				},
				'foo-tiny-square': {
					body: '<g />',
					width: 16,
					height: 16,
				},
			},
			width: 24,
			height: 24,
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});

	test('Common value that matches default', () => {
		const item: IconifyJSON = {
			prefix: 'foo',
			icons: {
				// 2 icons have the same height of 16, which is default value
				'foo-wide': {
					body: '<g />',
					width: 24,
					height: 16,
				},
				'foo-square': {
					body: '<g />',
					width: 16,
					height: 16,
				},
				'foo-tiny': {
					body: '<g />',
					width: 12,
					height: 16,
				},
			},
		};
		const expected: IconifyJSON = {
			prefix: 'foo',
			icons: {
				'foo-wide': {
					body: '<g />',
					width: 24,
				},
				'foo-square': {
					body: '<g />',
					// Should not have width because it matches default value
				},
				'foo-tiny': {
					body: '<g />',
					width: 12,
				},
			},
		};
		minifyIconSet(item);
		expect(item).toEqual(expected);
	});
});
