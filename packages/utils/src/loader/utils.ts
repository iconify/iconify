import type { Awaitable } from '@antfu/utils';
import { isUnsetKeyword } from '../svg/build';
import type { IconifyLoaderOptions } from './types';

const svgWidthRegex = /width\s*=\s*["'](\w+)["']/;
const svgHeightRegex = /height\s*=\s*["'](\w+)["']/;
const svgTagRegex = /<svg\s+/;

function configureSvgSize(
	svg: string,
	props: Record<string, string>,
	scale?: number
): [boolean, boolean] {
	const svgNode = svg.slice(0, svg.indexOf('>'));

	const check = (prop: 'width' | 'height', regex: RegExp): boolean => {
		const result = regex.exec(svgNode);
		const w = result != null;

		const propValue = props[prop];
		let value: string | undefined;

		if (!isUnsetKeyword(propValue)) {
			if (propValue) {
				// Do not change it
				return w;
			}

			if (typeof scale === 'number') {
				// Scale icon, unless scale is 0
				if (scale) {
					value = `${scale}em`;
				}
			} else if (result) {
				// Use result from iconToSVG()
				value = result[1];
			}
		}

		// Change / unset
		if (!value) {
			delete props[prop];
			return false;
		}
		props[prop] = value;
		return true;
	};

	return [check('width', svgWidthRegex), check('height', svgHeightRegex)];
}

export async function mergeIconProps(
	svg: string,
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions,
	propsProvider?: () => Awaitable<Record<string, string>>,
	afterCustomizations?: (props: Record<string, string>) => void
): Promise<string> {
	const { scale, addXmlNs = false } = options ?? {};
	const { additionalProps = {}, iconCustomizer } =
		options?.customizations ?? {};
	const props: Record<string, string> = (await propsProvider?.()) ?? {};

	await iconCustomizer?.(collection, icon, props);
	Object.keys(additionalProps).forEach((p) => {
		const v = additionalProps[p];
		if (v !== undefined && v !== null) props[p] = v;
	});
	afterCustomizations?.(props);

	const [widthOnSvg, heightOnSvg] = configureSvgSize(svg, props, scale);

	// add xml namespaces if necessary
	if (addXmlNs) {
		// add svg xmlns if missing
		if (!svg.includes('xmlns=') && !props['xmlns']) {
			props['xmlns'] = 'http://www.w3.org/2000/svg';
		}
		// add xmlns:xlink if xlink present and the xmlns missing
		if (
			!svg.includes('xmlns:xlink=') &&
			svg.includes('xlink:') &&
			!props['xmlns:xlink']
		) {
			props['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
		}
	}

	const propsToAdd = Object.keys(props)
		.map((p) =>
			(p === 'width' && widthOnSvg) || (p === 'height' && heightOnSvg)
				? null
				: `${p}="${props[p]}"`
		)
		.filter((p) => p != null);
	if (propsToAdd.length) {
		svg = svg.replace(svgTagRegex, `<svg ${propsToAdd.join(' ')} `);
	}

	if (options) {
		const { defaultStyle, defaultClass } = options;
		// additional props and iconCustomizer takes precedence
		if (defaultClass && !svg.includes('class=')) {
			svg = svg.replace(svgTagRegex, `<svg class="${defaultClass}" `);
		}
		// additional props and iconCustomizer takes precedence
		if (defaultStyle && !svg.includes('style=')) {
			svg = svg.replace(svgTagRegex, `<svg style="${defaultStyle}" `);
		}
	}

	const usedProps = options?.usedProps;
	if (usedProps) {
		Object.keys(additionalProps).forEach((p) => {
			const v = props[p];
			if (v !== undefined && v !== null) usedProps[p] = v;
		});
		if (typeof props.width !== 'undefined' && props.width !== null) {
			usedProps.width = props.width;
		}
		if (typeof props.height !== 'undefined' && props.height !== null) {
			usedProps.height = props.height;
		}
	}

	return svg;
}
