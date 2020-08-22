<template>
	<iconify-icon :icon="icons.chart" height="20" :style="{ color: 'red' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

export default Vue.extend({
	components: {
		IconifyIcon,
	},
	data() {
		return {
			icons: {
				chart: adminCustomizer,
			},
		};
	},
});
</script>
