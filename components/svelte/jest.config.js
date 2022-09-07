/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	verbose: true,
	transform: {
		'^.+\\.svelte$': 'svelte-jester',
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: 'tests/tsconfig.json',
			},
		],
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts'],
};
