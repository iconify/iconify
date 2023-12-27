import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	test: {
		globals: true,
		watch: false,
		include: ['**/tests/**/*.test.ts'],
	},
});
