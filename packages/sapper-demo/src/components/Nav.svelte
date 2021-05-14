<script>
	import Icon from '@iconify/svelte';
	import homeIcon from '@iconify-icons/bi/house-door';
	import blogIcon from '@iconify-icons/bi/file-text';
	import aboutIcon from '@iconify-icons/bi/question-octagon';

	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255, 62, 0, 0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255, 62, 0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	a :global(svg) {
		vertical-align: -0.125em;
		margin-right: 2px;
		opacity: 0.5;
		transition: opacity 0.2s;
	}
	a:hover :global(svg) {
		opacity: 1;
	}
</style>

<nav>
	<ul>
		<li>
			<a aria-current={segment === undefined ? 'page' : undefined} href=".">
				<Icon icon={homeIcon} />
				Home
			</a>
		</li>
		<li>
			<a aria-current={segment === 'about' ? 'page' : undefined} href="about">
				<Icon icon={aboutIcon} />
				About
			</a>
		</li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li>
			<a
				rel="prefetch"
				aria-current={segment === 'blog' ? 'page' : undefined}
				href="blog">
				<Icon icon={blogIcon} />
				Blog
			</a>
		</li>
	</ul>
</nav>
