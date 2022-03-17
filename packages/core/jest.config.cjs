const { buildConfiguration } = require('./jest.shared.config.cjs');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = buildConfiguration({
	moduleFileExtensions: ['ts', 'cjs', 'js'],
	globals: {
		'ts-jest': {
			useESM: false,
		},
	},
});
