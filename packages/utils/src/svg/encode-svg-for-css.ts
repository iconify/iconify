// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
export function encodeSvgForCss(svg: string): string {
	let useSvg = svg.startsWith('<svg>') ? svg.replace('<svg>', '<svg >') : svg;
	if (!useSvg.includes(' xmlns:xlink=') && useSvg.includes(' xlink:')) {
		useSvg = useSvg.replace(
			'<svg ',
			'<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
		);
	}
	if (!useSvg.includes(' xmlns=')) {
		useSvg = useSvg.replace(
			'<svg ',
			'<svg xmlns="http://www.w3.org/2000/svg" '
		);
	}
	return useSvg
		.replace(/"/g, "'")
		.replace(/%/g, '%25')
		.replace(/#/g, '%23')
		.replace(/{/g, '%7B')
		.replace(/}/g, '%7D')
		.replace(/</g, '%3C')
		.replace(/>/g, '%3E');
}
