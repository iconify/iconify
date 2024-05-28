import { readFileSync, writeFileSync } from 'node:fs';

// Text to ad
const text = "'use client'";

// List of files to fix
['iconify', 'offline'].forEach((prefix) => {
	// Add 'use client' to files
	['js', 'cjs', 'mjs'].forEach((ext) => {
		const file = `dist/${prefix}.${ext}`;
		try {
			const content = readFileSync(file, 'utf8');
			if (!content.startsWith(text)) {
				writeFileSync(file, text + ';\n\n' + content, 'utf8');
				console.log('Added client only statement to ' + file);
			}
		} catch {
			//
		}
	});

	// Copy .d.ts to .d.mts
	const source = `dist/${prefix}.d.ts`;
	const target = `dist/${prefix}.d.cts`;
	writeFileSync(target, readFileSync(source, 'utf8'), 'utf8');
});
