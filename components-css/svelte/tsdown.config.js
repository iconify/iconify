import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: [
		// Full component
		'src/index.ts',
		// Basic component
		'src/basic.ts',
		// Prop types
		'src/props.ts',
		// Helpers
		'src/helpers/*.ts',
		// Imports used in .svelte files should be exported as well
		// Delete them in scripts/build.js
		'src/basic/functions.ts',
		'src/full/functions.ts',
		'src/full/status.ts',
		'src/size.ts',
	],
	dts: true,
	format: ['esm'],
	outDir: 'dist',
	clean: true,
	exports: true,
	fixedExtension: false,
	inputOptions: {
		experimental: {
			attachDebugInfo: 'none',
		},
	},
});
