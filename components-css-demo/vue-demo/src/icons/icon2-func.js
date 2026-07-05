import { Icon } from '@iconify/css-vue';
import { computed, defineComponent, h } from 'vue';
import { getFallback } from './helpers/fallback-fi4iupre1o.js';
import './css/g_1xrq.css';
import './css/zs6nhs.css';
import './css/a8wtkc.css';
import './css/p10gmg.css';
import './css/ae-3qn.css';
import './css/objeeb.css';
import './css/mbb8cl.css';

const Component = defineComponent(
	(props) => {
		const states = computed(() => ({ action: props['action'], focus: props['focus'] }));
		const fallback = computed(() =>
			getFallback(
				['animated-line-24:', { state: 'action', values: ['remove', 'search'] }],
				states.value
			)
		);
		const className = computed(
			() =>
				Object.entries(states.value)
					.map(([key, value]) => (value ? `state-${value === true ? key : value}` : ''))
					.join(' ')
					.trim() || undefined
		);
		const viewBox = { width: 20, height: 24 };
		return () =>
			h(Icon, {
				class: className.value,
				width: props.width,
				height: props.height,
				viewBox,
				content: `<defs><mask id="SVGRErrZbBT"><path class="ae-3qn g_1xrq p10gmg"/><path class="g_1xrq objeeb zs6nhs"/></mask></defs><path mask="url(#SVGRErrZbBT)" class="mbb8cl"/><path class="a8wtkc g_1xrq p10gmg zs6nhs"/>`,
				fallback: fallback.value,
			});
	},
	{
		props: ['action', 'focus', 'width', 'height'],
	}
);

export default Component;
