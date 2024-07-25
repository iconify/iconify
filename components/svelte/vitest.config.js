import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
	plugins: [svelte()],
	test: {
		globals: true,
		watch: false,
		environment: 'jsdom',
		include: ['**/tests/**/*.test.ts'],
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
}));
