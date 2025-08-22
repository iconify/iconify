import { defineComponent, h, computed } from 'vue';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
} from './props.js';
import { calculateSize } from '@iconify/utils/lib/svg/size';
import { iconToSVG } from '@iconify/utils/lib/svg/build';

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export const Icon = defineComponent<CSSIconComponentProps>(
	(props: CSSIconComponentProps) => {
		// Content
		const content = computed(() => {
			const data = props.content || '';
			const html = typeof data === 'object' ? iconToSVG(data).body : data;
			return replaceIDs(html);
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
				innerHTML: content.value,
			});
	},
	{
		props: ['width', 'height', 'viewBox', 'content', 'fallback'],
	}
);

export type { CSSIconComponentProps, CSSIconComponentViewbox };
