// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
export function encodeSvgForCss(svg: string): string {
	return svg.replace(/"/g, '\'')
		.replace(/%/g, '%25')
		.replace(/#/g, '%23')
		.replace(/{/g, '%7B')
		.replace(/}/g, '%7D')
		.replace(/</g, '%3C')
		.replace(/>/g, '%3E')
}
