/**
 * Jest shared configuration: see https://jestjs.io/docs/ecmascript-modules.
 *
 * @param {import('ts-jest/dist/types').InitialOptionsTsJest} configuration
 * @return {import('ts-jest/dist/types').InitialOptionsTsJest}
 */
function buildConfiguration(configuration) {
	return Object.assign(
		{},
		{
			verbose: true,
			testEnvironment: 'node',
			moduleDirectories: ['node_modules', 'src'],
			extensionsToTreatAsEsm: ['.ts'],
			transform: {
				'^.+\\.ts$': 'ts-jest',
			},
			testMatch: ['**/tests/**/*-test.ts'],
		},
		configuration
	);
}

exports.buildConfiguration = buildConfiguration;
module.exports = { buildConfiguration };
