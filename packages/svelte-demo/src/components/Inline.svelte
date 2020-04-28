<script>
	import Icon from '@iconify/svelte';

	const demoIcon = {
		width: 16,
		height: 16,
		body:
			'<circle fill-opacity="0.2" cx="8" cy="8" r="7" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="currentColor"/><path d="M7 9L5 7L3.5 8.5L7 12L13 6L11.5 4.5L7 9Z" fill="currentColor"/>',
	};
</script>

<style>
	section :global(svg) {
		color: #06a;
		margin-right: 8px;
		/* box-shadow: 0 0 0 1px #06a inset; */
		position: relative;
		z-index: 2;
		background: #fff;
	}
	div {
		position: relative;
		font-size: 16px;
		line-height: 1.5;
		font-family: Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	div:before,
	div:after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 0;
		border-top: 1px dashed #506874;
		opacity: 0.5;
		z-index: -1;
	}
	div:before {
		bottom: 5px;
	}
	div:after {
		bottom: 7px;
		border-top-color: #ba3329;
	}
</style>

<section>
	<h1>Inline (components/Inline.svelte)</h1>
	<div>
		Block icon (behaving like image):
		<Icon icon={demoIcon} />
	</div>
	<div>
		Inline icon (behaving line text / icon font):
		<Icon icon={demoIcon} inline={true} />
	</div>
	<div>
		Using "vertical-align: 0" to override inline attribute:
		<Icon icon={demoIcon} style="vertical-align: 0" />
		<Icon icon={demoIcon} style="vertical-align: 0;" inline={true} />
	</div>
</section>
