import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		watch: false,
		include: ['**/tests/*-test.ts'],
	},
});
