<script>
	import { generateIcon } from './generate-icon';

	// Generated data
	let data;

	$: {
		data = generateIcon($$props);
	}
</script>

<svg {...data.attributes}>
	{@html data.body}
</svg>
