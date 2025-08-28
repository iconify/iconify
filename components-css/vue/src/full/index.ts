import './init.js';
import {
	defineComponent,
	onUnmounted,
	shallowRef,
	watch,
	h,
	computed,
} from 'vue';
import type { CSSIconComponentProps } from '../props.js';
import type { IconifyIcon } from '@iconify/types';
import { calculateSize } from '@iconify/utils/lib/svg/size';
import { renderContent } from '@iconify/component-utils/helpers/content';
import { subscribeToIconData } from '@iconify/component-utils/icons/subscribe';
import { renderCSS } from './status.js';

/**
 * Icon component
 */
export const Icon = defineComponent<CSSIconComponentProps>(
	(props: CSSIconComponentProps) => {
		// Content
		const content = computed(() => renderContent(props.content || ''));

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
		const viewBox = computed(
			() =>
				`${props.viewBox.left || 0} ${props.viewBox.top || 0} ${
					props.viewBox.width
				} ${props.viewBox.height}`
		);

		interface Size {
			width: string | undefined;
			height: string | undefined;
		}
		const size = computed<Size>(() => {
			const width = props.width;
			const height = props.height;

			if ((!width && !height) || (width && height)) {
				// None or both sizes are set
				return {
					width: width || undefined,
					height: height || undefined,
				};
			}

			// One size is set
			const viewBox = props.viewBox;
			const iconWidth = viewBox.width;
			const iconHeight = viewBox.height;
			if (width) {
				// Set height based on width
				return {
					width,
					height: width
						? calculateSize(width, iconHeight / iconWidth)
						: undefined,
				};
			}

			// Set width based on height
			return {
				height,
				width: height
					? calculateSize(height, iconWidth / iconHeight)
					: undefined,
			};
		});

		// Render icon
		return () =>
			h('svg', {
				xmlns: 'http://www.w3.org/2000/svg',
				...size.value,
				viewBox: viewBox.value,
				innerHTML: fallbackIcon.value || content.value,
			});
	},
	{
		props: ['width', 'height', 'viewBox', 'content', 'fallback'],
	}
);
