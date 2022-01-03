<template>
	<section class="icon-24">
		<h1>Usage (offline module)</h1>
		<div>
			Icon referenced by name:
			<Icon icon="demo" />
		</div>
		<div>
			Icon referenced by object:
			<Icon v-bind:icon="demoIcon" />
		</div>
		<div>
			2 icons imported from icon set:
			<Icon icon="offline-mdi-light:account-alert" />
			<Icon icon="offline-mdi-light:link" />
		</div>
		<div class="alert">
			<Icon :icon="alertIcon" />Important notice with alert icon!
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';
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
