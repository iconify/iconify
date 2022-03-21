/**
 * Remove whitespace
 */
export function trimSVG(str: string): string {
	return (
		str
			// Replace new line only after one of allowed characters that are not part of common attributes
			.replace(/(["';{}><])\s*\n\s*/g, '$1')
			// Keep one space in case it is inside attribute
			.replace(/\s*\n\s*/g, ' ')
			// Trim attribute values
			.replace(/\s+"/g, '"')
			.replace(/="\s+/g, '="')
			// Trim it
			.trim()
	);
}
