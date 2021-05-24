import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';

const match = '-test.ts';

// Find files
let files = fs
	.readdirSync('tests')
	.sort()
	.filter((file) => file.slice(0 - match.length) === match);

// Remove suffix
files = files.map((file) => file.slice(0, file.length - match.length));

// Debug one test
// files = ['21-scan-dom-api'];

// Get config files
const tests = [];
const config = files.map((file) => {
	tests.push(file + '.js');
	return {
		input: 'lib/' + file + match.replace('.ts', '.js'),
		output: {
			file: 'dist/' + file + '.js',
			format: 'iife',
			globals: {
				mocha: 'mocha',
				chai: 'chai',
			},
		},
		external: ['mocha', 'chai'],
		plugins: [
			resolve({
				browser: true,
				extensions: ['.js'],
			}),
			commonjs({
				ignore: ['cross-fetch'],
			}),
			buble({
				objectAssign: 'Object.assign',
			}),
		],
	};
});

// Write tests.html
let content = fs.readFileSync(__dirname + '/tests/tests.html', 'utf8');
content = content.replace(
	'<!-- tests -->',
	tests
		.map((file) => {
			return '<script src="./' + file + '"></script>';
		})
		.join('')
);
try {
	fs.mkdirSync(__dirname + '/dist', 0o755);
} catch (err) {}
fs.writeFileSync(__dirname + '/dist/tests.html', content, 'utf8');

export default config;
