import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		watch: false,
		include: ['**/tests/*-test.{ts,tsx}'],
		transformMode: {
			web: [/\.[jt]sx$/],
		},
	},
});
