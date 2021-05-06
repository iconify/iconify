module.exports = {
	verbose: true,
	moduleFileExtensions: ['js', 'json', 'vue'],
	transform: {
		'.*\\.(vue)$': 'vue-jest',
		'^.+\\.js$': '<rootDir>/node_modules/babel-jest',
	},
	collectCoverage: false,
	testMatch: ['**/tests/**/*.test.js'],
};
