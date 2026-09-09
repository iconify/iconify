/**
 * Encode SVG for use in url()
 *
 * Short alternative to encodeURIComponent() that encodes only stuff used in SVG, generating
 * smaller code.
 */
export function encodeSVGforURL(svg: string): string {
	return (
		svg
			.replace(/"/g, "'")
			.replace(/%/g, '%25')
			.replace(/#/g, '%23')
			.replace(/</g, '%3C')
			.replace(/>/g, '%3E')
			.replace(/\s+/g, ' ') // Replace all whitespace with space to get rid of '\r', '\n' and '\t'
			// .replace(/{/g, '%7B') // not needed in string inside double quotes
			// .replace(/}/g, '%7D') // not needed in string inside double quotes
			// Some reverse proxies blindly rewrite every "http://" occurrence in
			// served text to "https://" to avoid mixed content warnings. Left
			// unescaped, a literal "http://" can survive inside the encoded SVG
			// (most commonly from an injected `xmlns="http://www.w3.org/2000/svg"`)
			// and get corrupted by such rewrites, breaking the SVG namespace.
			// Escaping ':' and '/' removes that substring while staying fully
			// reversible by the browser's normal data URI percent-decoding.
			.replace(/:/g, '%3A')
			.replace(/\//g, '%2F')
	);
}

/**
 * Generate data: URL from SVG
 */
export function svgToData(svg: string): string {
	return 'data:image/svg+xml,' + encodeSVGforURL(svg);
}

/**
 * Generate url() from SVG
 */
export function svgToURL(svg: string): string {
	return 'url("' + svgToData(svg) + '")';
}
