// Main file
import { addIcon } from 'iconify-icon';

// Named import from .mjs
import { loadIcons } from '../dist/iconify-icon.mjs';

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
 * Test named exports
 */
test(typeof addIcon, 'function', 'Testing addIcon named export');
test(typeof loadIcons, 'function', 'Testing loadIcons named export');
