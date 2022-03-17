import type { Awaitable } from '@antfu/utils';
import type { IconifyLoaderOptions } from './types';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
/*
const svgWidthRegex = /(width\s*=\s*["'](\w+)["'])/d
const svgHeightRegex = /(height\s*=\s*["'](\w+)["'])/d

function configureSvgSize(svg: string, props: Record<string, string>, scale: number) {
	if (props.width && props.height) {
		return;
	}

	const svgNode = svg.slice(0, svg.indexOf('>'))
	let height: string | undefined
	let width: string | undefined

	let result = svgWidthRegex.exec(svgNode)
	if (result) {

	}
	if (!width) {
		width = props.widht ?? `${scale}em`
	}

	result = svgHeightRegex.exec(svgNode)
	if (result) {

	}
	if (!height) {
		height = props.height ?? `${scale}em`
	}

}

*/
export async function mergeIconProps(
	svg: string,
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions,
	propsProvider?: () => Awaitable<Record<string, string>>
): Promise<string> {
	const { scale, addXmlNs = false } = options ?? {};
	const { additionalProps = {}, iconCustomizer } =
		options?.customizations ?? {};
	const props: Record<string, string> = (await propsProvider?.()) ?? {};
	if (
		!svg.includes(' width=') &&
		!svg.includes(' height=') &&
		typeof scale === 'number'
	) {
		if (
			(typeof props.width === 'undefined' || props.width === null) &&
			(typeof props.height === 'undefined' || props.height === null)
		) {
			props.width = `${scale}em`;
			props.height = `${scale}em`;
		}
	}

	await iconCustomizer?.(collection, icon, props);
	Object.keys(additionalProps).forEach((p) => {
		const v = additionalProps[p];
		if (v !== undefined && v !== null) props[p] = v;
	});

	const addUsedProps = options && options.usedProps;
	// we need to parse the svg if we need to also return used props
	// and there are no width nor height in the props
	// if (addUsedProps) {
	// 	if (typeof props.width === 'undefined' || props.width === null)
	// }

	// add xml namespaces if necessary
	if (addXmlNs) {
		// add svg xmlns if missing
		if (!svg.includes(' xmlns=') && !props['xmlns']) {
			props['xmlns'] = 'http://www.w3.org/2000/svg';
		}
		// add xmlns:xlink if xlink present and the xmlns missing
		if (
			!svg.includes(' xmlns:xlink=') &&
			svg.includes('xlink:') &&
			!props['xmlns:xlink']
		) {
			props['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
		}
	}

	svg = svg.replace(
		'<svg ',
		`<svg ${Object.keys(props)
			.map((p) => `${p}="${props[p]}"`)
			.join(' ')}`
	);

	if (svg && options) {
		const { defaultStyle, defaultClass } = options;
		// additional props and iconCustomizer takes precedence
		if (defaultClass && !svg.includes(' class=')) {
			svg = svg.replace('<svg ', `<svg class="${defaultClass}" `);
		}
		// additional props and iconCustomizer takes precedence
		if (defaultStyle && !svg.includes(' style=')) {
			svg = svg.replace('<svg ', `<svg style="${defaultStyle}" `);
		}
	}

	if (addUsedProps) {
		options!.usedProps = Object.keys(props).reduce((acc, k) => {
			if (k) {
				switch (k) {
					case 'scale':
					case 'xmlns':
					case 'xmlns:xlink':
						break;
					default:
						acc[k] = props[k];
						break;
				}
			}
			return acc;
		}, {} as Record<string, string>);
	}

	return svg;
}
