module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:prettier/recommended',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['tsconfig.json', 'tests/tsconfig.json'],
		extraFileExtensions: ['.cjs'],
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'no-mixed-spaces-and-tabs': ['off'],
		'no-unused-vars': ['off'],
	},
	overrides: [
		{
			files: ['src/**/*.ts', 'tests/*.ts'],
		},
	],
};
