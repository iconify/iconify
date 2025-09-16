import { useMemo, createElement } from 'react';
import type { JSX } from 'react';
import { renderContent } from '@iconify/component-utils/helpers/content';
import type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
	CSSIconElementProps,
} from './props.js';
import { getSizeProps } from './size.js';
import { cleanUpInnerHTML } from '@iconify/utils/lib/svg/inner-html';

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export function Icon({
	content,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	fallback,
	width,
	height,
	viewBox,
	...props
}: CSSIconElementProps): JSX.Element {
	// Content
	const renderedContent = useMemo(
		() => renderContent(content || ''),
		[content]
	);

	// Icon size
	const size = useMemo(
		() => getSizeProps(width, height, viewBox),
		[width, height, viewBox]
	);

	// Render icon
	return createElement('svg', {
		xmlns: 'http://www.w3.org/2000/svg',
		...size,
		...props,
		dangerouslySetInnerHTML: { __html: cleanUpInnerHTML(renderedContent) },
	});
}

export type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
	CSSIconElementProps,
};
