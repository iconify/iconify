module.exports = {
	moduleFileExtensions: ['js', 'json', 'vue'],
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.vue$': '@vue/vue3-jest',
	},
	testMatch: ['**/tests/**/*.test.js'],
};
