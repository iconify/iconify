/**
 * Tags to skip
 */
const skipTags = ['script', 'style'];

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

	// Add space for self closing tags
	content = content.replace(/(\s)*\/>/g, ' />');

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

		// Check tag
		const lastChar = content.slice(closeIndex - 1, closeIndex);
		const isClosing = content.slice(0, 2) === '</';
		let isSelfClosing = lastChar === '/' || lastChar === '?';
		if (isClosing && isSelfClosing) {
			// Bad code
			return null;
		}

		// Check if tag content should be added as is
		const tagName = content
			.slice(isClosing ? 2 : 1)
			.split(/[\s>]/)
			.shift() as string;
		const ignoreTagContent =
			!isSelfClosing && !isClosing && skipTags.includes(tagName);

		// Check for bad content after tag
		if (!ignoreTagContent) {
			const nextOpenIndex = content.indexOf('<', 1);
			if (nextOpenIndex !== -1 && nextOpenIndex < closeIndex) {
				// Fail: unexpected '<'
				return null;
			}
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

		// Add content after tag
		if (ignoreTagContent) {
			const closingIndex = content.indexOf('</' + tagName);
			const closingEnd = content.indexOf('>', closingIndex);
			if (closingIndex < 0 || closingEnd < 0) {
				// Failed to find closing tag
				return null;
			}
			result += content.slice(0, closingEnd + 1);
			content = content.slice(closingEnd + 1);

			// Mask as self-closing
			isSelfClosing = true;
		}

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
