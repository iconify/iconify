<template>
	<iconify-icon :icon="icons.chart" height="20" :style="{ color: 'red' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

export default Vue.extend({
	data() {
		return {
			icons: {
				chart: JSON.stringify(adminCustomizer),
			},
		};
	},
});
</script>
