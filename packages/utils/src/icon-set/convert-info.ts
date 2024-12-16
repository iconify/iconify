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

	// Hidden
	hidden?: boolean;
}

/**
 * Check if displayHeight value is valid, returns 0 on failure
 */
function validateDisplayHeight(value: number): number {
	while (value < minDisplayHeight) {
		value *= 2;
	}
	while (value > maxDisplayHeight) {
		value /= 2;
	}

	return value === Math.round(value) &&
		value >= minDisplayHeight &&
		value <= maxDisplayHeight
		? value
		: 0;
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
		name = source.name;
	} else if (typeof source.title === 'string') {
		name = source.title;
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

	// Generate basic info
	const info = {
		name,
	} as IconifyInfo;

	// Number of icons
	switch (typeof source.total) {
		case 'number':
			info.total = source.total;
			break;

		case 'string': {
			const num = parseInt(source.total);
			if (num > 0) {
				info.total = num;
			}
			break;
		}
	}

	// Version
	if (typeof source.version === 'string') {
		info.version = source.version;
	}

	// Author
	info.author = {
		name: getSourceNestedString(
			'author',
			'name',
			typeof source.author === 'string' ? source.author : ''
		),
	};
	if (typeof source.author === 'object') {
		const sourceAuthor = source.author as Record<string, string>;
		if (typeof sourceAuthor.url === 'string') {
			info.author.url = sourceAuthor.url;
		}
	}

	// License
	info.license = {
		title: getSourceNestedString(
			'license',
			'title',
			typeof source.license === 'string' ? source.license : ''
		),
	};
	if (typeof source.license === 'object') {
		const sourceLicense = source.license as Record<string, string>;
		if (typeof sourceLicense.spdx === 'string') {
			info.license.spdx = sourceLicense.spdx;
		}
		if (typeof sourceLicense.url === 'string') {
			info.license.url = sourceLicense.url;
		}
	}

	// Samples
	if (source.samples instanceof Array) {
		const samples: string[] = [];
		source.samples.forEach((item) => {
			if (typeof item === 'string' && !samples.includes(item)) {
				samples.push(item);
			}
		});
		if (samples.length) {
			info.samples = samples;
		}
	}

	// Add height
	if (
		typeof source.height === 'number' ||
		typeof source.height === 'string'
	) {
		const num = parseInt(source.height as string);
		if (num > 0) {
			info.height = num;
		}
	}

	if (source.height instanceof Array) {
		source.height.forEach((item) => {
			const num = parseInt(item as string);
			if (num > 0) {
				if (!(info.height instanceof Array)) {
					info.height = [];
				}
				info.height.push(num);
			}
		});

		switch ((info.height as number[]).length) {
			case 0:
				delete info.height;
				break;

			case 1:
				info.height = (info.height as number[])[0];
		}
	}

	// Add display height
	if (typeof info.height === 'number') {
		// Convert from height
		const displayHeight = validateDisplayHeight(info.height);
		if (displayHeight && displayHeight !== info.height) {
			info.displayHeight = displayHeight;
		}
	}

	['samplesHeight', 'displayHeight'].forEach((prop) => {
		const value = source[prop];
		if (typeof value === 'number' || typeof value === 'string') {
			// Convert from source.displayHeight or source.samplesHeight
			const displayHeight = validateDisplayHeight(
				parseInt(value as string)
			);
			if (displayHeight) {
				info.displayHeight = displayHeight;
			}
		}
	});

	// Category
	if (typeof source.category === 'string') {
		info.category = source.category;
	}

	// Tags
	if (source.tags instanceof Array) {
		info.tags = source.tags;
	}

	// Palette
	switch (typeof source.palette) {
		case 'boolean':
			info.palette = source.palette;
			break;

		case 'string':
			switch (source.palette.toLowerCase()) {
				case 'colorless': // Iconify v1
				case 'false': // Boolean as string
					info.palette = false;
					break;

				case 'colorful': // Iconify v1
				case 'true': // Boolean as string
					info.palette = true;
			}
			break;
	}

	// Hidden
	if (source.hidden === true) {
		info.hidden = true;
	}

	// Parse all old strings
	Object.keys(source).forEach((key) => {
		const value = source[key];
		if (typeof value !== 'string') {
			return;
		}
		switch (key) {
			case 'url':
			case 'uri':
				info.author.url = value;
				break;

			case 'licenseURL':
			case 'licenseURI':
				info.license.url = value;
				break;

			case 'licenseID':
			case 'licenseSPDX':
				info.license.spdx = value;
				break;
		}
	});

	return info;
}
