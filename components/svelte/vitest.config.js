import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
	plugins: [svelte()],
	test: {
		globals: true,
		watch: false,
		include: ['**/tests/**/*.test.ts'],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: 'chromium' }],
		},
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
}));
