<script>
	import Icon from '@iconify/svelte';

	const paperclipIcon = 'dashicons:paperclip';
	const redIcon = 'color: red;';
	const bigIcon = 'font-size: 40px;';
</script>

<style>
	/* using :global because class name passed to a child component cannot be targeted in Svelte */
	section :global(.red-icon) {
		color: red;
	}
	section :global(.big-icon) {
		font-size: 40px;
	}
</style>

<section>
	<h1>Style (samples/Style.svelte)</h1>
	<div>
		Default icon:
		<Icon icon={paperclipIcon} />
	</div>
	<div>
		Red color:
		<Icon icon={paperclipIcon} color="red" />
		<Icon icon={paperclipIcon} style="color: red" />
		<Icon icon={paperclipIcon} style={redIcon} />
		<Icon icon={paperclipIcon} class="red-icon" />
	</div>
	<div>
		40px:
		<Icon icon={paperclipIcon} height="40" />
		<Icon icon={paperclipIcon} width={40} />
		<Icon icon={paperclipIcon} style="font-size: 40px;" />
		<Icon icon={paperclipIcon} style={bigIcon} />
		<Icon icon={paperclipIcon} class="big-icon" />
	</div>
	<div>
		Red and 40px:
		<Icon icon={paperclipIcon} color="red" width="40" />
		<Icon icon={paperclipIcon} style="color: red" height={40} />
		<Icon icon={paperclipIcon} style={redIcon + bigIcon} />
		<Icon icon={paperclipIcon} class="red-icon big-icon" />
	</div>
</section>
