export interface LicenseInfo {
	// Requires attribution
	attribution: boolean;

	// Allows commercial use
	commercial: boolean;

	// Keep same license
	sameLicense?: boolean;
}

// Completely free, no limits
const freeLicense: LicenseInfo = {
	attribution: false,
	commercial: true,
};

// Requires same license for derived works
const freeSameLicense: LicenseInfo = {
	attribution: false,
	commercial: true,
	sameLicense: true,
};

// Requires attribution
const attribLicense: LicenseInfo = {
	attribution: true,
	commercial: true,
};

// Requires attribution and same license for derived works
const attribSameLicense: LicenseInfo = {
	attribution: true,
	commercial: true,
	sameLicense: true,
};

// Requires attribution and non-commercial use
const attribNonCommercialLicense: LicenseInfo = {
	attribution: true,
	commercial: false,
};

// Requires attribution, non-commercial use and same license for derived works
const attribNonCommercialSameLicense: LicenseInfo = {
	attribution: true,
	commercial: false,
	sameLicense: true,
};

/**
 * Data for open source licenses used by icon sets in `@iconify/json` package and smaller packages
 *
 * Key is SPDX license identifier
 */
export const licensesData: Record<string, LicenseInfo> = {
	'Apache-2.0': freeLicense,
	'MIT': freeLicense,
	'MPL-2.0': freeLicense,
	'CC0-1.0': freeLicense,
	'CC-BY-3.0': attribLicense,
	'CC-BY-SA-3.0': attribSameLicense,
	'CC-BY-4.0': attribLicense,
	'CC-BY-SA-4.0': attribSameLicense,
	'CC-BY-NC-4.0': attribNonCommercialLicense,
	'CC-BY-NC-SA-4.0': attribNonCommercialSameLicense,
	'ISC': freeLicense,
	'OFL-1.1': freeLicense,
	'GPL-2.0-only': freeSameLicense,
	'GPL-2.0-or-later': freeSameLicense,
	'GPL-3.0': freeSameLicense,
	'GPL-3.0-or-later': freeSameLicense,
	'Unlicense': freeLicense,
	'BSD-2-Clause': freeLicense,
	'BSD-3-Clause': freeLicense,
};
