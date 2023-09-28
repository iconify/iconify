/**
 * Prettify SVG
 */
export function prettifySVG(
	content: string,
	tab = '\t',
	depth = 0
): string | null {
	let result = '';
	let level = 0;

	while (content.length > 0) {
		const openIndex = content.indexOf('<');
		let closeIndex = content.indexOf('>');

		// Should have both '<' and '>'
		if (openIndex === -1 && closeIndex === -1) {
			// Done
			return result;
		}

		if (openIndex === -1 || closeIndex === -1 || closeIndex < openIndex) {
			// Fail: either incomplete code or unescaped '<' or '>'
			return null;
		}

		// Add content before tag as is
		const text = content.slice(0, openIndex);
		const trimmedText = text.trim();
		if (trimmedText.length) {
			if (text.trimStart() !== text && text.trimEnd() !== text) {
				// Spacing is present on both sides: can safely add spacing
				result += trimmedText + '\n' + tab.repeat(level + depth);
			} else {
				// Add as is
				result = result.trim() + text;
			}
		}
		content = content.slice(openIndex);
		closeIndex -= openIndex;

		// Check for bad tag
		const nextOpenIndex = content.indexOf('<', 1);
		if (nextOpenIndex !== -1 && nextOpenIndex < closeIndex) {
			// Fail: unexpected '<'
			return null;
		}

		// Check tag
		const lastChar = content.slice(closeIndex - 1, closeIndex);
		const isClosing = content.slice(0, 2) === '</';
		const isSelfClosing = lastChar === '/' || lastChar === '?';
		if (isClosing && isSelfClosing) {
			// Bad code
			return null;
		}

		// Add tag
		if (isClosing && tab.length) {
			// Remove one level
			if (result.slice(0 - tab.length) === tab) {
				result = result.slice(0, result.length - tab.length);
			}
		}
		result += content.slice(0, closeIndex + 1);
		content = content.slice(closeIndex + 1);

		// Prepare for next tag
		if (isClosing) {
			level--;
			if (level < 0) {
				return null;
			}
		} else if (!isSelfClosing) {
			level++;
		}
		result += '\n' + tab.repeat(level + depth);
	}

	return level === 0 ? result : null;
}
