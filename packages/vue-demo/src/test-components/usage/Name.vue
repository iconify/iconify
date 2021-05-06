<template>
	<Icon icon="customizer" height="20" :style="{ color: 'purple' }" />
</template>

<script>
import { Icon, addIcon } from '@iconify/vue/dist/offline';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);

export default {
	components: {
		Icon,
	},
};
</script>
