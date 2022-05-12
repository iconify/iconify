module.exports = {
	root: true,
	env: {
		browser: true,
		jest: true,
		es6: true,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js'],
			},
		},
		'import/extensions': ['.js'],
	},
	extends: ['plugin:vue/recommended'],
};
