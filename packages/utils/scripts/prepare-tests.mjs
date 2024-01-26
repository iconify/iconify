import fs from 'fs'

fs.cpSync(
	'./tests/fixtures/plain-color-icons',
	'./node_modules/plain-color-icons',
	{ recursive: true }
)

fs.cpSync(
	'./tests/fixtures/@test-scope/test-color-icons',
	'./node_modules/@test-scope/test-color-icons',
	{ recursive: true }
)
