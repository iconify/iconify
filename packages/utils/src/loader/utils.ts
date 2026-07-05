import { isUnsetKeyword } from '../svg/build';
import { calculateSize } from '../svg/size';
import type { Awaitable, IconifyLoaderOptions } from './types';

const svgWidthRegex = /\swidth\s*=\s*["']([^"']+)["']/;
const svgHeightRegex = /\sheight\s*=\s*["']([^"']+)["']/;
const svgViewBoxRegex = /\sviewBox\s*=\s*["']([^"']+)["']/;
const svgTagRegex = /<svg\s+/;
export const loaderDefaultWidthProp = '__iconify_loader_width';
export const loaderDefaultHeightProp = '__iconify_loader_height';

function stringifySize(value: string | number | undefined): string | undefined {
	return value === undefined ? undefined : value.toString();
}

function getConfiguredSize(
	source: string | undefined,
	scale?: number
): string | undefined {
	if (typeof scale === 'number') {
		return scale > 0
			? stringifySize(calculateSize(source ?? '1em', scale))
			: undefined;
	}
	return source;
}

function getSvgAspectRatio(
	svgNode: string,
	props: Record<string, string>
): number | undefined {
	const viewBox = props.viewBox ?? svgViewBoxRegex.exec(svgNode)?.[1];
	if (!viewBox) {
		return;
	}

	const values = viewBox
		.trim()
		.split(/[\s,]+/)
		.map((value) => parseFloat(value));
	if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
		return;
	}

	const width = values[2];
	const height = values[3];
	if (width <= 0 || height <= 0) {
		return;
	}

	return width / height;
}

function configureSvgSize(
	svg: string,
	props: Record<string, string>,
	scale?: number
): [boolean, boolean] {
	const svgNode = svg.slice(0, svg.indexOf('>'));
	const widthOnSvg = svgWidthRegex.test(svgNode);
	const heightOnSvg = svgHeightRegex.test(svgNode);
	const defaultWidth =
		props[loaderDefaultWidthProp] ?? svgWidthRegex.exec(svgNode)?.[1];
	const defaultHeight =
		props[loaderDefaultHeightProp] ?? svgHeightRegex.exec(svgNode)?.[1];
	const aspectRatio = getSvgAspectRatio(svgNode, props);
	delete props[loaderDefaultWidthProp];
	delete props[loaderDefaultHeightProp];

	const customWidth = props.width;
	const customHeight = props.height;
	const hasCustomWidth = !!customWidth || isUnsetKeyword(customWidth);
	const hasCustomHeight = !!customHeight || isUnsetKeyword(customHeight);

	if (hasCustomWidth || hasCustomHeight) {
		if (!hasCustomWidth) {
			if (isUnsetKeyword(customHeight)) {
				delete props.width;
				delete props.height;
			} else if (aspectRatio) {
				props.width = stringifySize(
					calculateSize(customHeight as string, aspectRatio)
				) as string;
				props.height = customHeight as string;
			} else {
				delete props.width;
			}
		} else if (isUnsetKeyword(customWidth)) {
			delete props.width;
			if (!hasCustomHeight || isUnsetKeyword(customHeight)) {
				delete props.height;
			}
		}

		if (!hasCustomHeight) {
			if (isUnsetKeyword(customWidth)) {
				delete props.height;
			} else if (aspectRatio) {
				props.height = stringifySize(
					calculateSize(customWidth as string, 1 / aspectRatio)
				) as string;
				props.width = customWidth as string;
			} else {
				delete props.height;
			}
		} else if (isUnsetKeyword(customHeight)) {
			delete props.height;
		}
	} else {
		const width = getConfiguredSize(defaultWidth, scale);
		const height = getConfiguredSize(defaultHeight, scale);
		if (width) {
			props.width = width;
		}
		if (height) {
			props.height = height;
		}
	}

	return [widthOnSvg, heightOnSvg];
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

export function getPossibleIconNames(icon: string): string[] {
	return [
		icon,
		icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
		icon.replace(/([a-z])(\d+)/g, '$1-$2'),
	];
}
