import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig(({ mode }) => ({
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
