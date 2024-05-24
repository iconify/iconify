/* eslint-disable */
const { readFileSync, writeFileSync } = require('fs');

// Text to ad
const text = "'use client'";

// List of files to fix
['iconify', 'offline'].forEach((prefix) => {
	['js', 'cjs', 'mjs'].forEach((ext) => {
		const file = `dist/${prefix}.${ext}`;
		try {
			const content = readFileSync(file, 'utf8');
			if (!content.startsWith(text)) {
				writeFileSync(file, text + '\n\n' + content, 'utf8');
				console.log('Added client only statement to ' + file);
			}
		} catch {
			//
		}
	});
});
