<template>
	<section class="icon-24">
		<h1>Usage (full module)</h1>
		<div>
			Icon referenced by name:
			<Icon icon="mdi:home" />
		</div>
		<div class="alert">
			<Icon icon="mdi-light:alert" />Important notice with alert icon!
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';

export default {
	components: {
		Icon,
	},
};
</script>
