import { createMemo, splitProps, type JSX } from 'solid-js';
import { mergeProps, createDynamic } from 'solid-js/web';
import { renderContent } from '@iconify/component-utils/helpers/content';
import { getSizeProps } from '@iconify/component-utils/helpers/size';
import type {
	CSSIconComponentProps,
	CSSIconElementProps,
	CSSIconComponentViewbox,
} from './props.js';

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export function Icon(props: CSSIconElementProps): JSX.Element {
	const [local, others] = splitProps(props, ['content', 'fallback', 'width', 'height', 'viewBox']);

	// Content
	const renderedContent = createMemo(() => renderContent(local.content || ''));

	// Icon size
	const size = createMemo(() => getSizeProps(local.width, local.height, local.viewBox));

	// Render icon
	// Render icon
	return createDynamic(
		() => 'svg',
		mergeProps(size, others, {
			get innerHTML() {
				return renderedContent();
			},
		})
	);
}

export type { CSSIconComponentProps, CSSIconElementProps, CSSIconComponentViewbox };
