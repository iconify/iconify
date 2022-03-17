import pkg from './jest.shared.config.cjs';

export default pkg.buildConfiguration({
	moduleFileExtensions: ['ts', 'mjs', 'js'],
	globals: {
		'ts-jest': {
			useESM: true,
		},
	},
})
