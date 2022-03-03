/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/*
module.exports = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**!/tests/!*-test.ts'],
};
*/

import { buildConfiguration } from './jest.shared.config'

export default buildConfiguration({
	moduleFileExtensions: ['ts', 'cjs', 'js'],
	globals: {
		'ts-jest': {
			useESM: false,
		},
	},
})
