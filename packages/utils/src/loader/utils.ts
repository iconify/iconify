import type { Awaitable } from '@antfu/utils';
import type { IconCustomizer } from './types';

export const isNode = typeof process < 'u' && typeof process.stdout < 'u'

export async function mergeIconProps(
	svg: string,
	collection: string,
	icon: string,
	additionalProps: Record<string, string | undefined>,
	propsProvider?: () => Awaitable<Record<string, string>>,
	iconCustomizer?: IconCustomizer
): Promise<string> {
	const props: Record<string, string> = (await propsProvider?.()) ?? {};
	await iconCustomizer?.(collection, icon, props);
	Object.keys(additionalProps).forEach((p) => {
		const v = additionalProps[p];
		if (v !== undefined && v !== null) props[p] = v;
	});
	// add svg xmlns if missing
	if (!svg.includes(' xmlns=') && !additionalProps['xmlns']) {
		additionalProps['xmlns'] = 'http://www.w3.org/2000/svg';
	}
	// add xmlns:xlink if xlink present and the xmlns missing
	if (!svg.includes('xmlns:xlink') && svg.includes('xlink:') && !additionalProps['xmlns:xlink']) {
		additionalProps['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
	}
	const replacement = svg.startsWith('<svg ') ? '<svg ' : '<svg';
	return svg.replace(
		replacement,
		`${replacement}${Object.keys(props).map((p) => `${p}="${props[p]}"`).join(' ')}`
	);
}

// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
export function encodeCssSvg(svg: string): string {
	return svg.replace(/"/g, '\'')
		.replace(/%/g, '%25')
		.replace(/#/g, '%23')
		.replace(/{/g, '%7B')
		.replace(/}/g, '%7D')
		.replace(/</g, '%3C')
		.replace(/>/g, '%3E')
}
