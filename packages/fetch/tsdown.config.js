import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts'],
	dts: true,
	format: ['esm'],
	outDir: 'dist',
	clean: true,
	inputOptions: {
		experimental: {
			attachDebugInfo: 'none',
		},
	},
});
