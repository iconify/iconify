<template>
	<section class="icon-24">
		<h1>Usage (full module, offline mode)</h1>
		<div>
			Icons referenced by name (rendered as SVG, then as SPAN):
			<Icon icon="demo" /><Icon icon="demo" mode="style" />
		</div>
		<div>
			Icons referenced by object:
			<Icon v-bind:icon="demoIcon" /><Icon
				v-bind:icon="demoIcon"
				mode="style"
			/>
		</div>
		<div>
			2 icons imported from icon set:
			<Icon icon="alert1" />
			<Icon icon="link1" mode="style" />
		</div>
		<div class="alert">
			<Icon :icon="alertIcon" mode="style" />Important notice with alert
			icon!
		</div>
		<div>
			Icon without size, scaled to 48px with CSS:
			<Icon :icon="demoIcon" height="unset" style="height: 48px" />
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';
import demoIcon from '@iconify-icons/dashicons/info-outline';
import alertIcon from '@iconify-icons/bx/bx-error';

export default {
	components: {
		Icon,
	},
	data() {
		return {
			demoIcon,
			alertIcon,
		};
	},
};
</script>
