<script>
	import Icon from '@iconify/svelte/dist/Icon.svelte';

	const adminUsers = 'dashicons:admin-users';
	const icon1Style = 'color: purple; vertical-align: 0; font-size: 2em;';
</script>

<section>
	<h1>Color and style (samples/ColorStyle.svelte)</h1>
	<div>
		Icon with color (red):
		<Icon icon={adminUsers} color="red" inline={true} />
	</div>
	<div>
		Icon size (2em):
		<Icon icon={adminUsers} height="2em" inline={true} />
	</div>
	<div>
		Icon style as string (red):
		<Icon icon={adminUsers} style="color: red;" />
	</div>
	<div>
		Inline icon with vertical-align style as string (aligned to top):
		<Icon icon={adminUsers} style="vertical-align: .25em;" inline={true} />
	</div>
	<div>
		Inline icon with variable style (purple, 2em, no alignment):
		<Icon icon={adminUsers} style={icon1Style} inline={true} color="green" />
	</div>
</section>
