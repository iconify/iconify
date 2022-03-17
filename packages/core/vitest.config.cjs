const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
	resolve: {
		mainFields: ['require'],
		extensions: ['.cjs'],
	},
	test: {
		globals: true,
		isolate: false,
		watch: false,
		include: ['**/tests/**/*-test.ts'],
	},
});
