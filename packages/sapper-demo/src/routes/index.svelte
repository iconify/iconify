<script>
	// Render icon on server
	import IconifyIcon from '@iconify/svelte';
	import successIcon from '@iconify-icons/openmoji/artist-medium-light-skin-tone';

	// Dynamically load icon component, icon data and render it on client side
	// Also replace <IconifyIcon /> with <svelte:component this={IconifyIcon} />
	/*
	import { onMount } from 'svelte';

	let IconifyIcon;
	let successIcon;

	onMount(async () => {
		let promises = [
			import('@iconify/svelte'),
			import('@iconify-icons/openmoji/artist-medium-light-skin-tone'),
		];
		const results = await Promise.all(promises);
		IconifyIcon = results[0].default;
		successIcon = results[1].default;
	});
	*/
</script>

<style>
	h1,
	figure,
	p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	figure :global(svg) {
		width: 100%;
		height: auto;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
		text-align: left;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Sapper Iconify demo</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
	<IconifyIcon icon={successIcon} />
	<!-- <svelte:component this={IconifyIcon} icon={successIcon} /> -->
</figure>

<p>Icon above and icons in navigation are rendered by Sapper on server side.</p>
<p>See components/Nav.svelte and routes/index.svelte</p>
<hr />
<p>
	List of blog posts (click "Blog" in navigation) uses same icon multiple times.
	It does not make sense to render it on server side and send multiple SVG
	elements to browser, so icon data is loaded asynchronously and component is
	rendered on client side.
</p>
<p>See routes/blog/index.svelte</p>
