export interface LicenseInfo {
	// Requires attribution
	attribution: boolean;

	// Allows commercial use
	commercial: boolean;

	// Keep same license
	sameLicense?: boolean;
}

/**
 * Data for open source licenses used by icon sets in `@iconify/json` package and smaller packages
 *
 * Key is SPDX license identifier
 */
export const licensesData: Record<string, LicenseInfo> = {
	'Apache-2.0': {
		attribution: false,
		commercial: true,
	},
	'MIT': {
		attribution: false,
		commercial: true,
	},
	'CC0-1.0': {
		attribution: false,
		commercial: true,
	},
	'MPL-2.0': {
		attribution: false,
		commercial: true,
	},
	'CC-BY-3.0': {
		attribution: true,
		commercial: true,
	},
	'CC-BY-SA-3.0': {
		attribution: true,
		commercial: true,
		sameLicense: true,
	},
	'CC-BY-4.0': {
		attribution: true,
		commercial: true,
	},
	'CC-BY-SA-4.0': {
		attribution: true,
		commercial: true,
		sameLicense: true,
	},
	'CC-BY-NC-4.0': {
		attribution: true,
		commercial: false,
	},
	'CC-BY-NC-SA-4.0': {
		attribution: true,
		commercial: false,
		sameLicense: true,
	},
	'ISC': {
		attribution: false,
		commercial: true,
	},
	'OFL-1.1': {
		attribution: false,
		commercial: true,
	},
	'GPL-2.0-only': {
		attribution: false,
		commercial: true,
		sameLicense: true,
	},
	'GPL-2.0-or-later': {
		attribution: false,
		commercial: true,
		sameLicense: true,
	},
	'GPL-3.0': {
		attribution: false,
		commercial: true,
		sameLicense: true,
	},
	'GPL-3.0-or-later': {
		attribution: false,
		commercial: true,
		sameLicense: true,
	},
	'Unlicense': {
		attribution: false,
		commercial: true,
	},
};
