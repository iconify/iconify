<template>
	<section class="icon-24">
		<h1>Usage (full module)</h1>
		<div>
			Icons referenced by name (rendered as SVG, then as SPAN):
			<Icon icon="mdi:home" />
			<Icon icon="mdi:home" mode="style" />
		</div>
		<div>
			SSR prop: <Icon icon="mdi:home" :ssr="true" /><Icon
				icon="line-md:arrow-right"
				:ssr="true"
			/>
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
