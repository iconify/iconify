<script>
	import { Icon, addIcon } from '@iconify/svelte';
	import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';
	import bxUser from '@iconify-icons/bx/bx-user';
	import bxError from '@iconify-icons/bx/bx-error';

	import UsageSample from './components/Sample.svelte';
	import ColorStyle from './components/ColorStyle.svelte';
	import InlineDemo from './components/Inline.svelte';
	import AlignmentDemo from './components/Alignment.svelte';
	import TransformationsDemo from './components/Transformations.svelte';
	import StyleDemo from './components/Style.svelte';


	const iconDataWithID = {
		body:
			'<defs><path id="ssvg-id-1st-place-medala" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medald" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalf" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalh" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalj" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalm" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="ssvg-id-1st-place-medalp"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="ssvg-id-1st-place-medalb"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="ssvg-id-1st-place-medalk"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="ssvg-id-1st-place-medalo"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalc" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medala"/></mask><path fill="url(#ssvg-id-1st-place-medalb)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalc)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medale" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medald"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medale)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalg" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalf"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalg)"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medali" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalh"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medali)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medall" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalj"/></mask><path fill="url(#ssvg-id-1st-place-medalk)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medall)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medaln" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalm"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medaln)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#ssvg-id-1st-place-medalo)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#ssvg-id-1st-place-medalp"/><use fill="#FFA000" xlink:href="#ssvg-id-1st-place-medalp"/></g>',
		width: 128,
		height: 128,
	};	

	addIcon('demo', adminCustomizer);
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

	.alert :global(+ div) {
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
		<div>
			Icon refenced by name:
			<Icon icon="demo" inline={true} />
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

	<section>
		<h1>Tests</h1>
		<p>Testing replacing ids in icon: <Icon icon={iconDataWithID} /> <Icon icon={iconDataWithID} /> (default handler) <Icon icon={iconDataWithID} id="test" /> <Icon icon={iconDataWithID} id="test2" /> (custom handler)</p>
	</section>
</main>
