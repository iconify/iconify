/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/*
module.exports = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**!/tests/!*-test.ts'],
};
*/

const { buildConfiguration } = require('./jest.shared.config.cjs');

/** @type {() => typeof import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = buildConfiguration({
	moduleFileExtensions: ['ts', 'cjs', 'js'],
	globals: {
		'ts-jest': {
			useESM: false,
		},
	},
});
