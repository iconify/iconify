<script lang="ts">
	import Icon, { addIcon } from '@iconify/svelte';
	import { page } from '$app/stores';

	addIcon('corner-left', {
		body: '<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" fill="currentColor" />',
		width: 2,
		height: 3
	});
	addIcon('corner-right', {
		body: '<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" fill="currentColor" />',
		width: 2,
		height: 3
	});
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<Icon icon="logos:svelte-icon" title="SvekteKit" />
		</a>
	</div>

	<nav data-sveltekit-prefetch>
		<Icon icon="corner-left" height="auto" />
		<ul>
			<li class:active={$page.url.pathname === '/'}>
				<a href="/">Home</a>
			</li>
			<li class:active={$page.url.pathname === '/about'}>
				<a href="/about">About</a>
			</li>
			<li class:active={$page.url.pathname === '/todos'}>
				<a href="/todos">Todos</a>
			</li>
		</ul>
		<Icon icon="corner-right" height="auto" />
	</nav>

	<div class="corner">
		<a href="https://github.com/iconify/iconify/tree/main/components/svelte">
			<Icon icon="line-md:iconify1" title="Iconify" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner :global(svg) {
		font-size: 2em;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	nav :global(svg) {
		width: 2em;
		height: 3em;
		display: block;
		color: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
