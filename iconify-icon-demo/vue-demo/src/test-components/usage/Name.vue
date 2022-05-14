<template>
	<iconify-icon icon="customizer" height="20" :style="{ color: 'purple' }" />
</template>

<script>
import { addIcon } from 'iconify-icon';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);
</script>
