import './init.js';
import {
	defineComponent,
	onUnmounted,
	shallowRef,
	watch,
	h,
	computed,
} from 'vue';
import type { CSSIconComponentProps, CSSIconElementProps } from '../props.js';
import type { IconifyIcon } from '@iconify/types';
import { renderContent } from '@iconify/component-utils/helpers/content';
import { subscribeToIconData } from '@iconify/component-utils/icons/subscribe';
import { renderCSS } from './status.js';
import { getSizeProps } from '../size.js';

/**
 * Icon component
 */
export const Icon = defineComponent<CSSIconElementProps>(
	(props: CSSIconComponentProps) => {
		// Content
		const renderedContent = computed(() =>
			renderContent(props.content || '')
		);

		// Icon to render from API, set to empty string if CSS rendering is used
		const fallbackToRender = computed(() =>
			renderCSS && props.content ? '' : props.fallback || ''
		);

		// Data for icon to render
		const iconData = shallowRef<IconifyIcon | null | undefined>(null);

		// Subscribe to icon data updates and watch prop changes
		const subscriber = subscribeToIconData(
			fallbackToRender.value,
			(newData) => {
				iconData.value = newData;
			}
		);
		iconData.value = subscriber.data;

		watch(fallbackToRender, subscriber.change);
		onUnmounted(subscriber.unsubscribe);

		// Render fallback icon
		const fallbackIcon = computed(() => {
			const data = iconData.value;
			return data ? renderContent(data) : '';
		});

		// Icon size
		const size = computed(() =>
			getSizeProps(props.width, props.height, props.viewBox)
		);

		// Render icon
		return () =>
			h('svg', {
				xmlns: 'http://www.w3.org/2000/svg',
				...size.value,
				innerHTML: fallbackIcon.value || renderedContent.value,
			});
	},
	{
		props: ['width', 'height', 'viewBox', 'content', 'fallback'],
	}
);
