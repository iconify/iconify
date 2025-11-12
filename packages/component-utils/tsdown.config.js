import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/*.ts', 'src/*/*.ts', 'src/*/*/*.ts'],
	dts: true,
	format: ['esm'],
	outDir: 'lib',
	clean: true,
	unbundle: true,
	exports: true,
	fixedExtension: false,
	inputOptions: {
		experimental: {
			attachDebugInfo: 'none',
		},
	},
});
