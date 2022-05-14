<template>
	<section class="icon-24">
		<h1>Usage (full module, offline mode)</h1>
		<div>
			Icon referenced by name:
			<iconify-icon icon="demo" />
		</div>
		<div>
			Icon referenced by object:
			<iconify-icon v-bind:icon="demoIcon" />
		</div>
		<div>
			2 icons imported from icon set:
			<iconify-icon icon="alert1" />
			<iconify-icon icon="link1" />
		</div>
		<div class="alert">
			<iconify-icon :icon="alertIcon" />Important notice with alert icon!
		</div>
	</section>
</template>

<script>
import demoIcon from '@iconify-icons/dashicons/info-outline';
import alertIcon from '@iconify-icons/bx/bx-error';

export default {
	data() {
		return {
			demoIcon: JSON.stringify(demoIcon),
			alertIcon: JSON.stringify(alertIcon),
		};
	},
};
</script>
