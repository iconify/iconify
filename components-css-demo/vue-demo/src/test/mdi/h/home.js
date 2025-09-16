import { defineComponent, h } from 'vue';
import { Icon } from '@iconify/css-vue';
import iconProps from '../../misc/setup.js';
import viewBox from '../../viewbox/0-0-24-24.js';
import '../../css/svgo/svgonx2de.css';

const IconComponent = defineComponent((props) => {
	return () =>
		h(Icon, {
			...props,
			content: '<path class="svgonx2de" />',
			fallback: 'mdi:home',
			viewBox,
		});
}, iconProps);

export default IconComponent;
