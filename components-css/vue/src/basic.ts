import { defineComponent, h, computed } from 'vue';
import { renderContent } from '@iconify/component-utils/helpers/content';
import type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
	CSSIconElementProps,
} from './props.js';
import { getSizeProps } from './size.js';

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export const Icon = defineComponent<CSSIconElementProps>(
	(props: CSSIconComponentProps) => {
		// Content
		const renderedContent = computed(() =>
			renderContent(props.content || '')
		);

		// Icon size
		const size = computed(() =>
			getSizeProps(props.width, props.height, props.viewBox)
		);

		// Render icon
		return () =>
			h('svg', {
				xmlns: 'http://www.w3.org/2000/svg',
				...size.value,
				innerHTML: renderedContent.value,
			});
	},
	{
		props: ['width', 'height', 'viewBox', 'content', 'fallback'],
	}
);

export type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
	CSSIconElementProps,
};
