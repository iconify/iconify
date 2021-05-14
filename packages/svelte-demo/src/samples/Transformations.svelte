<script>
	import Icon from '@iconify/svelte';

	const paperclipIcon = 'dashicons:paperclip';
</script>

<style>
	section :global(svg) {
		font-size: 20px;
		line-height: 1em;
	}
</style>

<section>
	<h1>Transformations (samples/Transformations.svelte)</h1>
	<div>
		Default icon:
		<Icon icon={paperclipIcon} />
	</div>
	<div>
		Flip horizontally:
		<Icon icon={paperclipIcon} hFlip={true} />
		<Icon icon={paperclipIcon} flip="horizontal" />
	</div>
	<div>
		Flip vertically:
		<Icon icon={paperclipIcon} vFlip={true} />
		<Icon icon={paperclipIcon} flip="vertical" />
	</div>
	<div>
		Flip horizontally and vertically:
		<Icon icon={paperclipIcon} hFlip={true} vFlip={true} />
		<Icon icon={paperclipIcon} flip="horizontal,vertical" />
	</div>
	<div>
		90&deg; rotation:
		<Icon icon={paperclipIcon} rotate={1} />
		<Icon icon={paperclipIcon} rotate="90deg" />
		<Icon icon={paperclipIcon} rotate="25%" />
	</div>
	<div>
		180&deg; rotation:
		<Icon icon={paperclipIcon} rotate={2} />
		<Icon icon={paperclipIcon} rotate="180deg" />
		<Icon icon={paperclipIcon} rotate="50%" />
	</div>
	<div>
		270&deg; rotation:
		<Icon icon={paperclipIcon} rotate={3} />
		<Icon icon={paperclipIcon} rotate="270deg" />
		<Icon icon={paperclipIcon} rotate="-25%" />
	</div>
</section>
