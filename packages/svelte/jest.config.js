/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	verbose: true,
	transform: {
		'^.+\\.svelte$': 'svelte-jester',
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts'],
	globals: {
		'ts-jest': {
			tsconfig: 'tests/tsconfig.json',
		},
	},
};
