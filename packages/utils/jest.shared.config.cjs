// see https://jestjs.io/docs/ecmascript-modules

/** @type {() => typeof import('ts-jest/dist/types').InitialOptionsTsJest} */
/** @return {import('ts-jest/dist/types').InitialOptionsTsJest} */
const buildConfiguration = (configuration) => {
	return Object.assign({}, {
		verbose: true,
		testEnvironment: 'node',
		moduleDirectories: [
			'node_modules',
			'src',
		],
		extensionsToTreatAsEsm: ['.ts'],
		transform: {
			'^.+\\.ts$': 'ts-jest',
		},
		testMatch: [
			'**/tests/*-test.ts',
		],
	}, configuration)
}

exports.buildConfiguration = buildConfiguration;
module.exports = { buildConfiguration };
