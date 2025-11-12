import { defineConfig } from 'tsdown/config';

export default defineConfig({
	entry: 'src/plugin.ts',
	platform: 'node',
	dts: true,
	format: ['esm', 'cjs'],
	external: ['@iconify/types', 'tailwindcss'],
	fixedExtension: false,
});
