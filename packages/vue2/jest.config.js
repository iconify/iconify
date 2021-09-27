module.exports = {
	moduleFileExtensions: ['js', 'json', 'vue'],
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.vue$': '@vue/vue2-jest',
	},
	testMatch: ['**/tests/**/*.test.js'],
};
