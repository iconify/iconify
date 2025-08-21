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
	],
	dts: true,
	format: ['esm'],
	outDir: 'dist',
	clean: true,
	exports: true,
	inputOptions: {
		experimental: {
			attachDebugInfo: 'none',
		},
	},
});
