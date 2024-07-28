const {
	addCleanIconSelectors,
	addDynamicIconSelectors,
	addIconSelectors,
} = require('@iconify/tailwind');
const {
	importDirectorySync,
	cleanupSVG,
	parseColorsSync,
	runSVGO,
	isEmptyColor,
} = require('@iconify/tools');

// Import icons from directory 'svg'
const customSet = importDirectorySync('svg');

// Clean up all icons
customSet.forEachSync((name, type) => {
	if (type !== 'icon') {
		return;
	}

	// Get SVG object for icon
	const svg = customSet.toSVG(name);
	if (!svg) {
		// Invalid icon
		customSet.remove(name);
		return;
	}

	try {
		// Clean up icon
		cleanupSVG(svg);

		// This is a monotone icon, change color to `currentColor`, add it if missing
		// Skip this step if icons have palette
		parseColorsSync(svg, {
			defaultColor: 'currentColor',
			callback: (attr, colorStr, color) => {
				return !color || isEmptyColor(color)
					? colorStr
					: 'currentColor';
			},
		});

		// Optimise icon
		runSVGO(svg);
	} catch (err) {
		// Something went wrong when parsing icon: remove it
		console.error(`Error parsing ${name}:`, err);
		customSet.remove(name);
		return;
	}

	// Update icon in icon set from SVG object
	customSet.fromSVG(name, svg);
});

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/*.html'],
	plugins: [
		// Main plugin, default options
		addIconSelectors(['mdi-light', 'vscode-icons']),
		// Main plugin, custom options
		addIconSelectors({
			maskSelector: '.custom-monotone',
			backgroundSelector: '.custom-background',
			// Like UnoCSS
			iconSelector: '.i-{prefix}-{name}',
			scale: 1.5,
			prefixes: [
				{
					prefix: 'mdi-light',
					icons: ['home'],
					customise: (content) =>
						content.replace(/currentColor/g, '#40f'),
				},
				{
					prefix: 'custom',
					source: customSet.export(),
					customise: (content) =>
						content.replace(/currentColor/g, '#f20'),
				},
			],
		}),
		// Main plugin, no size
		addIconSelectors({
			maskSelector: '.iconify-nosize',
			backgroundSelector: '',
			scale: 0,
			// No prefixes list: reusing data from plugin above
		}),
		// Main plugin, no square and scale
		addIconSelectors({
			maskSelector: '.fa6-mask',
			backgroundSelector: '.fa6-bg', // unused
			iconSelector: '.{prefix}-{name}',
			square: false,
			scale: 2,
			prefixes: ['fa6-regular'],
		}),
		// Plugin with clean selectors: requires writing all used icons in first parameter
		addCleanIconSelectors(['mdi-light:home']),
		// Plugin with dynamic selectors
		addDynamicIconSelectors({
			iconSets: {
				custom: customSet.export(),
			},
			customise: (content, name, prefix) => {
				switch (name) {
					case 'spinner1':
						return content.replace(
							'animation:0.75s',
							'animation:5s'
						);
				}
				return content;
			},
		}),
		// Plugin with dynamic selectors that contains only css for overriding icon
		addDynamicIconSelectors({
			prefix: 'icon-hover',
			overrideOnly: true,
		}),
		// Icons without size
		addDynamicIconSelectors({
			prefix: 'scaled-icon',
			scale: 0,
		}),
	],
};
