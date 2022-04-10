/**
 * Encode SVG for use in url()
 *
 * Short alternative to encodeURIComponent() that encodes only stuff used in SVG, generating
 * smaller code.
 *
 * If icon is not optimised, run trimSVG() before this function to get rid of new lines.
 * This function is intended to be used with Iconify icon sets, which are already optimised
 * and do not contain new lines.
 */
export function encodeSVGforURL(svg: string): string {
	return (
		svg
			.replace(/"/g, "'")
			.replace(/%/g, '%25')
			.replace(/#/g, '%23')
			// .replace(/{/g, '%7B') // not needed in string inside double quotes
			// .replace(/}/g, '%7D') // not needed in string inside double quotes
			.replace(/</g, '%3C')
			.replace(/>/g, '%3E')
	);
}

/**
 * Generate url() from SVG
 */
export function svgToURL(svg: string): string {
	return 'url("data:image/svg+xml,' + encodeSVGforURL(svg) + '")';
}
