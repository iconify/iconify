// Main file: default and named imports
import Iconify from '@iconify/iconify';
import { addIcon } from '@iconify/iconify';

// Named import from .mjs
import { loadIcons } from '../dist/iconify.mjs';

// Shortcut for offline module
import IconifyOffline from '@iconify/iconify/offline';
import { iconLoaded, iconExists } from '@iconify/iconify/offline';

// Direct link to offline module
import { addCollection } from '../dist/iconify.without-api.mjs';

/**
 * Simple assertion function
 */
function test(value, expected, message) {
	if (value !== expected) {
		console.error(
			'❌',
			message + `: expected ${value} to equal ${expected}`
		);
		process.exit(1);
	}
	console.log('✓', message);
}

/**
 * Test default export
 */
test(typeof Iconify, 'object', 'Testing default export');
test(typeof Iconify.addIcon, 'function', 'Testing addIcon in default export');

/**
 * Test default export in offline module
 */
test(typeof IconifyOffline, 'object', 'Testing default offline export');
test(
	typeof IconifyOffline.iconLoaded,
	'function',
	'Testing iconLoaded in default offline export'
);
test(
	typeof IconifyOffline.iconExists,
	'function',
	'Testing deprecated iconExists in default offline export'
);
test(
	typeof IconifyOffline.loadIcons,
	'undefined',
	'Testing loadIcons in default offline export'
);

/**
 * Test named exports
 */
test(typeof addIcon, 'function', 'Testing addIcon named export');
test(typeof loadIcons, 'function', 'Testing loadIcons named export');

/**
 * Test exports without API
 */
test(typeof iconLoaded, 'function', 'Testing iconLoaded named export');
test(
	typeof iconExists,
	'function',
	'Testing deprecated iconExists named export'
);
test(typeof addCollection, 'function', 'Testing addCollection named export');
