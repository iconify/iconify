const fs = require('fs');

const reactSearch = "import React from 'react';";
const reactImport = 'React';

function fixTypes(filename) {
	let content = fs.readFileSync(__dirname + filename, 'utf8');
	if (content.indexOf(reactSearch) === -1) {
		throw new Error(`Missing React import in ${filename}`);
	}
	let replaced = false;

	['Icon', 'InlineIcon'].forEach((name) => {
		const searchStart = `export declare const ${name}: ${reactImport}.ForwardRefExoticComponent`;
		const searchEnd = `& ${reactImport}.RefAttributes<IconRef>>;`;
		const replace = `export declare const ${name}: (props: IconProps) => ${reactImport}.ReactElement<IconProps, string | ${reactImport}.JSXElementConstructor<any>>;`;

		if (content.indexOf(replace) !== -1) {
			// Already replaced
			return;
		}
		const parts = content.split(searchStart);
		if (parts.length !== 2) {
			throw new Error(
				`Error replacing types for component ${name} in ${filename}`
			);
		}
		const contentStart = parts.shift();
		const parts2 = parts.shift().split(searchEnd);
		if (parts2.length < 2) {
			throw new Error(
				`Error replacing types for component ${name} in ${filename}`
			);
		}
		parts2.shift();

		content = contentStart + replace + parts2.join(searchEnd);
		replaced = true;
	});

	if (replaced) {
		fs.writeFileSync(__dirname + filename, content, 'utf8');
		console.log(`Fixed component types in ${filename}`);
	}
}

fixTypes('/lib/iconify.d.ts');
fixTypes('/lib/offline.d.ts');
