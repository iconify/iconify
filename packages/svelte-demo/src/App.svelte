<script>
	import Icon from '@iconify/svelte';
	import adminCustomizer from '@iconify/icons-dashicons/admin-customizer';
	import bxUser from '@iconify/icons-bx/bx-user';
	import bxError from '@iconify/icons-bx/bx-error';

	import UsageSample from './components/Sample.svelte';
	import ColorStyle from './components/ColorStyle.svelte';
	import InlineDemo from './components/Inline.svelte';
	import AlignmentDemo from './components/Alignment.svelte';
	import TransformationsDemo from './components/Transformations.svelte';
	import StyleDemo from './components/Style.svelte';
</script>

<style>
	main {
		text-align: left;
		padding: 1em;
		font-size: 16px;
		line-height: 1.5;
		color: #2c3e50;
	}

	main :global(section) {
		border-bottom: 1px dotted #ccc;
		padding: 16px;
	}
	main :global(section:last-child) {
		border-bottom-width: 0;
	}
	main :global(section:after) {
		content: ' ';
		display: table;
		clear: both;
	}
	main :global(h1) {
		margin: 0 0 16px;
		padding: 0;
		font-size: 24px;
		font-weight: normal;
	}
	main :global(p) {
		margin: 12px 0 4px;
		padding: 0;
	}

	/* Alert demo */
	.alert {
		position: relative;
		margin: 8px;
		padding: 16px;
		padding-left: 48px;
		background: #ba3329;
		color: #fff;
		border-radius: 5px;
		float: left;
	}

	.alert + div {
		clear: both;
	}

	.alert :global(svg) {
		position: absolute;
		left: 12px;
		top: 50%;
		font-size: 24px;
		line-height: 1em;
		margin: -0.5em 0 0;
	}
</style>

<main>
	<section>
		<h1>Usage</h1>
		<div>
			Empty icon:
			<Icon />
		</div>
		<div>
			Simple icon:
			<Icon icon={bxUser} inline={true} />
		</div>
		<div class="alert">
			<Icon icon={bxError} />
			Important notice with alert icon!
		</div>
	</section>

	<section>
		<h1>Example file (components/Sample.svelte)</h1>
		<UsageSample />
	</section>

	<ColorStyle />
	<InlineDemo />
	<AlignmentDemo />
	<TransformationsDemo />
	<StyleDemo />
</main>
