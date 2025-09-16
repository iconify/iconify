<script>
	import Icon from '@iconify/css-svelte';
	import iconProps from '../../misc/setup.js';
	import viewBox from '../../viewbox/0-0-24-24.js';
	import '../../css/svgo/svgonx2de.css';
	
	let props = $props();
</script>
<Icon
	{...props}
	{...iconProps}
	content='<path class="svgonx2de" />'
	fallback='mdi:home'
	{viewBox}
/>
