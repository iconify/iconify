<script>
	import { Icon } from '@iconify/svelte';

	const paperclipIcon = 'dashicons:paperclip';
</script>

<style>
	section :global(svg) {
		color: #06a;
		font-size: 32px;
		line-height: 1em;
		margin-right: 8px;
		box-shadow: 0 0 0 1px #ccc;
		vertical-align: top;
	}
</style>

<section>
	<h1>Alignment (samples/Alignment.svelte)</h1>
	<div>
		<p>Icon with correct width/heigh ratio:</p>
		<Icon icon={paperclipIcon} />
	</div>
	<div>
		<p>Bad width/height ratio, default alignment (slice = false):</p>
		<Icon icon={paperclipIcon} width="2em" height="1em" />
		<Icon icon={paperclipIcon} width="1em" height="2em" />
	</div>
	<div>
		<p>Slice:</p>
		<Icon icon={paperclipIcon} width="2em" height="1em" slice={true} />
		<Icon icon={paperclipIcon} width="2em" height="1em" align="slice" />
	</div>
	<div>
		<p>Slice:</p>
		<Icon icon={paperclipIcon} width="1em" height="2em" slice={true} />
		<Icon icon={paperclipIcon} width="1em" height="2em" align="slice" />
	</div>
	<div>
		<p>Left:</p>
		<Icon icon={paperclipIcon} width="2em" height="1em" hAlign="left" />
		<Icon icon={paperclipIcon} width="2em" height="1em" align="left" />
	</div>
	<div>
		<p>Left with slice:</p>
		<Icon
			icon={paperclipIcon}
			width="1em"
			height="2em"
			hAlign="left"
			slice={true} />
		<Icon
			icon={paperclipIcon}
			width="1em"
			height="2em"
			align="left"
			slice={true} />
		<Icon icon={paperclipIcon} width="1em" height="2em" align="left,slice" />
	</div>
	<div>
		<p>Right:</p>
		<Icon icon={paperclipIcon} width="2em" height="1em" hAlign="right" />
		<Icon icon={paperclipIcon} width="2em" height="1em" align="right" />
	</div>
	<div>
		<p>Right with slice:</p>
		<Icon
			icon={paperclipIcon}
			width="1em"
			height="2em"
			hAlign="right"
			slice={true} />
		<Icon
			icon={paperclipIcon}
			width="1em"
			height="2em"
			align="right"
			slice={true} />
		<Icon icon={paperclipIcon} width="1em" height="2em" align="right,slice" />
	</div>
	<div>
		<p>Top:</p>
		<Icon icon={paperclipIcon} width="1em" height="2em" vAlign="top" />
		<Icon icon={paperclipIcon} width="1em" height="2em" align="top" />
	</div>
	<div>
		<p>Top with slice:</p>
		<Icon
			icon={paperclipIcon}
			width="2em"
			height="1em"
			vAlign="top"
			slice={true} />
		<Icon
			icon={paperclipIcon}
			width="2em"
			height="1em"
			align="top"
			slice={true} />
		<Icon icon={paperclipIcon} width="2em" height="1em" align="top,slice" />
	</div>
	<div>
		<p>Bottom:</p>
		<Icon icon={paperclipIcon} width="1em" height="2em" vAlign="bottom" />
		<Icon icon={paperclipIcon} width="1em" height="2em" align="bottom" />
	</div>
	<div>
		<p>Bottom with slice:</p>
		<Icon
			icon={paperclipIcon}
			width="2em"
			height="1em"
			vAlign="bottom"
			slice={true} />
		<Icon
			icon={paperclipIcon}
			width="2em"
			height="1em"
			align="bottom"
			slice={true} />
		<Icon icon={paperclipIcon} width="2em" height="1em" align="bottom,slice" />
	</div>
</section>
