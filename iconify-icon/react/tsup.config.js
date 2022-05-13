import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/iconify.ts'],
	format: ['cjs', 'esm'],
	splitting: false,
	sourcemap: false,
	clean: true,
	dts: true,
	target: 'esnext',
});
