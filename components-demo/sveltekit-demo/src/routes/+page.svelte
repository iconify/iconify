<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<p>Icon tests: <Icon icon="mdi:home" /><Icon icon="mdi-light:alert" /></p>
</section>

<style>
	p {
		font-size: 16px;
		line-height: 24px;
	}
	p :global(svg) {
		font-size: 24px;
		line-height: 24px;
		vertical-align: -0.125em;
	}
	p:hover {
		color: red;
	}
</style>
