<template>
	<section class="icon-24">
		<h1>Usage (offline mode)</h1>
		<div>
			Icons referenced by name (rendered as SVG, then as SPAN):
			<iconify-icon icon="demo" /><iconify-icon
				icon="demo"
				mode="style"
			/>
		</div>
		<div>
			Icons referenced by object:
			<iconify-icon v-bind:icon="demoIcon" /><iconify-icon
				v-bind:icon="demoIcon"
				mode="style"
			/>
		</div>
		<div>
			2 icons imported from icon set:
			<iconify-icon icon="alert1" />
			<iconify-icon icon="link1" mode="style" />
		</div>
		<div class="alert">
			<iconify-icon :icon="alertIcon" mode="style" />Important notice with
			alert icon!
		</div>
	</section>
</template>

<script lang="ts">
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
