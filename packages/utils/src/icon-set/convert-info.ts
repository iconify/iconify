import type { IconifyInfo } from '@iconify/types';

const minDisplayHeight = 16;
const maxDisplayHeight = 24;

/**
 * Item provided by API or loaded from collections.json, slightly different from IconifyInfo
 */
export interface LegacyIconifyInfo {
	// Icon set name.
	name: string;

	// Total number of icons.
	total?: number;

	// Version string.
	version?: string;

	// Author
	author?: string;
	url?: string;

	// License
	license?: string;
	licenseURL?: string;
	licenseSPDX?: string;

	// Samples
	samples?: string[];

	// Icon grid
	height?: number | number[];
	displayHeight?: number;
	samplesHeight?: number;

	// Category
	category?: string;
	palette?: 'Colorless' | 'Colorful';
}

/**
 * Convert data to valid CollectionInfo
 */
export function convertIconSetInfo(
	data: unknown,
	expectedPrefix = ''
): IconifyInfo | null {
	if (typeof data !== 'object' || data === null) {
		return null;
	}

	const source = data as Record<string, unknown>;

	const getSourceNestedString = (
		field: string,
		key: string,
		defaultValue = ''
	): string => {
		if (typeof source[field] !== 'object') {
			return defaultValue;
		}
		const obj = source[field] as Record<string, string>;
		return typeof obj[key] === 'string' ? obj[key] : defaultValue;
	};

	// Get name
	let name: string;
	if (typeof source.name === 'string') {
		name = source.name as string;
	} else if (typeof source.title === 'string') {
		name = source.title as string;
	} else {
		return null;
	}

	// Validate prefix
	if (
		expectedPrefix !== '' &&
		typeof source.prefix === 'string' &&
		source.prefix !== expectedPrefix
	) {
		// Prefixes do not match
		return null;
	}

	// Generate data
	const result: IconifyInfo = {
		name: name,
		total: typeof source.total === 'number' ? source.total : 0,
		version: typeof source.version === 'string' ? source.version : '',
		author: {
			name: getSourceNestedString(
				'author',
				'name',
				typeof source.author === 'string' ? source.author : 'Unknown'
			),
			url: getSourceNestedString('author', 'url', ''),
		},
		license: {
			title: getSourceNestedString(
				'license',
				'title',
				typeof source.license === 'string' ? source.license : 'Unknown'
			),
			spdx: getSourceNestedString('license', 'spdx', ''),
			url: getSourceNestedString('license', 'url', ''),
		},
		samples: [],
		category: typeof source.category === 'string' ? source.category : '',
		palette: typeof source.palette === 'boolean' ? source.palette : false,
	};

	// Total as string
	if (typeof source.total === 'string') {
		const num = parseInt(source.total);
		if (num > 0) {
			result.total = num;
		}
	}

	// Add samples
	if (source.samples instanceof Array) {
		source.samples.forEach((item) => {
			if (result.samples.length < 3 && typeof item === 'string') {
				result.samples.push(item);
			}
		});
	}

	// Add height
	if (
		typeof source.height === 'number' ||
		typeof source.height === 'string'
	) {
		const num = parseInt(source.height as string);
		if (num > 0) {
			result.height = num;
		}
	}

	if (source.height instanceof Array) {
		source.height.forEach((item) => {
			const num = parseInt(item);
			if (num > 0) {
				if (!(result.height instanceof Array)) {
					result.height = [];
				}
				result.height.push(num);
			}
		});

		switch ((result.height as number[]).length) {
			case 0:
				delete result.height;
				break;

			case 1:
				result.height = (result.height as number[])[0];
		}
	}

	// Add display height
	if (typeof result.height === 'number') {
		// Convert from height
		result.displayHeight = result.height;
		while (result.displayHeight < minDisplayHeight) {
			result.displayHeight *= 2;
		}
		while (result.displayHeight > maxDisplayHeight) {
			result.displayHeight /= 2;
		}

		if (
			result.displayHeight !== Math.round(result.displayHeight) ||
			result.displayHeight < minDisplayHeight ||
			result.displayHeight > maxDisplayHeight
		) {
			delete result.displayHeight;
		}
	}

	['samplesHeight', 'displayHeight'].forEach((prop) => {
		const value = source[prop];
		if (typeof value === 'number' || typeof value === 'string') {
			// Convert from source.displayHeight or source.samplesHeight
			const num = parseInt(value as string);
			if (
				num >= minDisplayHeight &&
				num <= maxDisplayHeight &&
				Math.round(num) === num
			) {
				result.displayHeight = num;
			}
		}
	});

	// Convert palette from string value
	if (typeof source.palette === 'string') {
		switch (source.palette.toLowerCase()) {
			case 'colorless': // Iconify v1
			case 'false': // Boolean as string
				result.palette = false;
				break;

			case 'colorful': // Iconify v1
			case 'true': // Boolean as string
				result.palette = true;
		}
	}

	// Parse all old keys
	Object.keys(source).forEach((key) => {
		const value = source[key];
		if (typeof value !== 'string') {
			return;
		}
		switch (key) {
			case 'url':
			case 'uri':
				result.author.url = value;
				break;

			case 'licenseURL':
			case 'licenseURI':
				result.license.url = value;
				break;

			case 'licenseID':
			case 'licenseSPDX':
				result.license.spdx = value;
				break;
		}
	});

	return result;
}
