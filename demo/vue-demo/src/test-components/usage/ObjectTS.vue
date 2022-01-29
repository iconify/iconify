<template>
	<Icon :icon="icons.chart" height="20" :style="{ color: 'red' }" />
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

export default {
	components: {
		Icon,
	},
	data() {
		return {
			icons: {
				chart: adminCustomizer,
			},
		};
	},
};
</script>
