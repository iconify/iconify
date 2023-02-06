const {
	addCleanIconSelectors,
	addDynamicIconSelectors,
} = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/*.html'],
	plugins: [
		// Plugin with clean selectors: requires writing all used icons in first parameter
		addCleanIconSelectors(['mdi-light:home']),
		// Plugin with dynamic selectors
		addDynamicIconSelectors(),
		// Plugin with dynamic selectors that contains only css for overriding icon
		addDynamicIconSelectors({
			prefix: 'icon-hover',
			overrideOnly: true,
		}),
	],
};
