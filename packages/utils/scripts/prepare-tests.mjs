import { cpSync } from 'node:fs';

cpSync(
	'./tests/fixtures/plain-color-icons',
	'./node_modules/plain-color-icons',
	{ recursive: true }
);

cpSync(
	'./tests/fixtures/@test-scope/test-color-icons',
	'./node_modules/@test-scope/test-color-icons',
	{ recursive: true }
);
