import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts', 'src/helpers/*.ts'],
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
