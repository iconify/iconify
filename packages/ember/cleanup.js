const fs = require('fs');

/**
 * Fix default export syntax
 */
function fixDefaultExport(filename) {
	const source = __dirname + '/' + filename;
	const data = fs.readFileSync(source, 'utf8');
	const search = 'IconifyIconComponent as default';
	if (data.indexOf(search) === -1) {
		console.log(`Exports are fine in ${filename}`);
		return;
	}

	let foundMatch = 0;
	const lines = data.split(',').filter((line) => {
		if (line.trim() === search) {
			foundMatch++;
			return false;
		}
		return true;
	});
	if (foundMatch !== 1) {
		throw new Error(`Error fixing exports in ${filename}`);
	}
	const newCode =
		lines.join(',') + '\nexport default IconifyIconComponent;\n';

	fs.writeFileSync(source, newCode, 'utf8');
	console.log(`Fixed default export in ${filename}`);
}

/**
 * Restore decorator in component
 */
function restoreDecorator(filename) {
	const source = __dirname + '/' + filename;
	let data = fs.readFileSync(source, 'utf8');

	// Code to find/replace
	const decorateStart = 'var __decorate =';
	const decorateEnd = '};';

	const decorate2Start =
		'function __decorate(decorators, target, key, desc) {';
	const decorate2End = '}';

	const componentHeader =
		'export class IconifyIconComponent extends Component {';
	const componentHeader2 = 'class IconifyIconComponent extends Component {';
	const addedLine = '@tracked _counter = 0;';

	const footerStart = `__decorate([`;
	const footerEnd = '], IconifyIconComponent.prototype, "_counter", void 0);';

	// Check if already parsed
	if (
		data.indexOf(addedLine) !== -1 &&
		data.indexOf(decorateStart) === -1 &&
		data.indexOf(decorate2Start) === -1 &&
		data.indexOf(footerStart) === -1
	) {
		console.log(`${filename} is already cleaned up`);
		return;
	}

	// Split lines
	let lines = data.split('\n');

	/**
	 *
	 * @param {string} firstMatch First match, line must start with it
	 * @param {string} lastMatch Last match, exact line
	 * @param {number} middleCount Number of lines between start and end, all will be removed
	 * @param {string} key Text for error message
	 */
	const removeLines = (firstMatch, lastMatch, middleCount, key) => {
		let found = false;
		let removed = 0;
		let replaced = false;

		lines = lines.filter((line) => {
			if (replaced) {
				return true;
			}

			// Check for start
			if (!found) {
				const trimmed = line.trim();
				if (trimmed.slice(0, firstMatch.length) === firstMatch) {
					found = true;
					return false;
				}
				return true;
			}

			// Remove line?
			if (removed < middleCount) {
				removed++;
				return false;
			}

			// Last line
			if (line.trim() !== lastMatch) {
				throw new Error(
					`Mismatch for last line for ${key} in ${filename}: "${line}"`
				);
			}
			replaced = true;
			return false;
		});

		if (!found) {
			throw new Error(
				`Could not do replacement for ${key} in ${filename}`
			);
		}
	};

	// Remove __decorate() polyfill
	if (data.indexOf(decorate2Start) !== -1) {
		removeLines(decorate2Start, decorate2End, 4, 'decorator polyfill 2');
	} else {
		removeLines(decorateStart, decorateEnd, 4, 'decorator polyfill');
	}

	// Remove __decorate()
	removeLines(footerStart, footerEnd, 1, 'decorate()');

	// Add decorator after class declaration
	let added = false;
	lines = lines.map((line) => {
		if (added) {
			return line;
		}
		const trimmed = line.trim();
		if (trimmed === componentHeader || trimmed === componentHeader2) {
			added = true;
			return line + '\n    ' + addedLine;
		}
		return line;
	});
	if (!added) {
		throw new Error(`Could not find class declaration in ${filename}`);
	}

	// Save file
	fs.writeFileSync(source, lines.join('\n'), 'utf8');
	console.log(`Cleaned up ${filename}`);
}

function copyFile(source, target) {
	fs.writeFileSync(
		__dirname + '/' + target,
		fs.readFileSync(__dirname + '/' + source)
	);
	console.log(`Created ${target}`);
}

restoreDecorator('lib/component.js');
fixDefaultExport('addon/components/iconify-icon.js');
restoreDecorator('addon/components/iconify-icon.js');
copyFile('src/iconify-icon.hbs', 'addon/components/iconify-icon.hbs');
