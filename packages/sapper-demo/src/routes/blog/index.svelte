<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`blog.json`)
			.then(r => r.json())
			.then(posts => {
				return { posts };
			});
	}
</script>

<script>
	// Dynamically load icon component, icon data and render it on client side
	import { onMount } from 'svelte';

	let IconifyIcon;
	let postIcon;

	onMount(async () => {
		const promises = [
			import('@iconify/svelte'),
			import('@iconify/icons-bi/link-45deg'),
		];
		const results = await Promise.all(promises);
		IconifyIcon = results[0].default;
		postIcon = results[1].default;
	});

	export let posts;
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		padding: 0;
		line-height: 1.5;
		list-style: none;
	}

	li {
		margin: 0.5em 0;
		padding: 0;
	}

	/* Move link while icon is being loaded */
	li :global(a:first-child) {
		margin-left: 1.25em;
	}

	/* Use :global to target SVG element */
	li :global(svg) {
		vertical-align: -0.125em;
		opacity: 0.5;
		transition: opacity 0.2s;
	}
	li:hover :global(svg) {
		opacity: 1;
	}
</style>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<h1>Recent posts</h1>

<ul>
	{#each posts as post}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li>
			<svelte:component this={IconifyIcon} icon={postIcon} />
			<a rel="prefetch" href="blog/{post.slug}">{post.title}</a>
		</li>
	{/each}
</ul>
