import { createMemo, splitProps, type JSX } from 'solid-js';
import { mergeProps, spread, template } from 'solid-js/web';
import { renderContent } from '@iconify/component-utils/helpers/content';
import { getSizeProps } from '@iconify/component-utils/helpers/size';
import type {
	CSSIconComponentProps,
	CSSIconElementProps,
	CSSIconComponentViewbox,
} from './props.js';

const _tmpl$ = /* @__PURE__ */ template(
	`<svg xmlns=http://www.w3.org/2000/svg>`
);

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export function Icon(props: CSSIconElementProps): JSX.Element {
	const [local, others] = splitProps(props, [
		'content',
		'fallback',
		'width',
		'height',
		'viewBox',
	]);

	// Content
	const renderedContent = createMemo(() =>
		renderContent(local.content || '')
	);

	// Icon size
	const size = createMemo(() =>
		getSizeProps(local.width, local.height, local.viewBox)
	);

	// Render icon
	return (() => {
		const _el$ = _tmpl$();
		spread(
			_el$,
			mergeProps(size, others, {
				get innerHTML() {
					return renderedContent();
				},
			}),
			true,
			true
		);
		return _el$;
	})();
}

export type {
	CSSIconComponentProps,
	CSSIconElementProps,
	CSSIconComponentViewbox,
};
