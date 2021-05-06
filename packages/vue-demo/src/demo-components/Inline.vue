<template>
	<section class="inline-demo">
		<h1>Inline demo</h1>
		<div>
			Block icon (behaving like image):
			<OfflineIcon icon="experiment2" />
			<FullIcon icon="experiment2" />
		</div>
		<div>
			Inline icon (behaving line text / icon font):
			<OfflineIcon icon="experiment2" :inline="true" />
			<FullIcon icon="experiment2" :inline="true" />
		</div>
		<div>
			Using "vertical-align: 0" to override inline attribute:
			<OfflineIcon icon="experiment2" style="vertical-align: 0" />
			<FullIcon icon="experiment2" style="vertical-align: 0" />
			<OfflineIcon
				icon="experiment2"
				style="vertical-align: 0"
				:inline="true"
			/>
			<FullIcon
				icon="experiment2"
				style="vertical-align: 0"
				:inline="true"
			/>
		</div>
	</section>
</template>

<script>
import { Icon as OfflineIcon } from '@iconify/vue/dist/offline';
import { Icon as FullIcon } from '@iconify/vue';

export default {
	components: {
		OfflineIcon,
		FullIcon,
	},
};
</script>
