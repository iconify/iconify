import type { Config } from '@jest/types'

// see https://jestjs.io/docs/ecmascript-modules

export const buildConfiguration = (configuration: Partial<Config.InitialOptions>): Config.InitialOptions => {
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
