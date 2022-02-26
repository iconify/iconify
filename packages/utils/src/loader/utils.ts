import type { Awaitable } from '@antfu/utils';
import type { IconCustomizer } from './types';

export const isNode = typeof process < 'u' && typeof process.stdout < 'u'

export async function mergeIconProps(
	svg: string,
	collection: string,
	icon: string,
	additionalProps: Record<string, string | undefined>,
	addXmlNs: boolean,
	propsProvider?: () => Awaitable<Record<string, string>>,
	iconCustomizer?: IconCustomizer,
): Promise<string> {
	const props: Record<string, string> = (await propsProvider?.()) ?? {};
	await iconCustomizer?.(collection, icon, props);
	Object.keys(additionalProps).forEach((p) => {
		const v = additionalProps[p];
		if (v !== undefined && v !== null) props[p] = v;
	});
	// add xml namespaces if necessary
	if (addXmlNs) {
		// add svg xmlns if missing
		if (!svg.includes(' xmlns=') && !props['xmlns']) {
			props['xmlns'] = 'http://www.w3.org/2000/svg';
		}
		// add xmlns:xlink if xlink present and the xmlns missing
		if (!svg.includes(' xmlns:xlink=') && svg.includes('xlink:') && !props['xmlns:xlink']) {
			props['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
		}
	}

	return svg.replace(
		'<svg ',
		`<svg ${Object.keys(props).map((p) => `${p}="${props[p]}"`).join(' ')}`
	);
}
