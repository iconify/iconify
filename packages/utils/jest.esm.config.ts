import { buildConfiguration } from './jest.shared.config'

export default buildConfiguration({
	moduleFileExtensions: ['ts', 'mjs', 'js'],
	globals: {
		'ts-jest': {
			useESM: true,
		},
	},
})
