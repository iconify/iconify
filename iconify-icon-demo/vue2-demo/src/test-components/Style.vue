<template>
	<section>
		<h1>Style (components/Style.vue)</h1>
		<div>
			Default icon:
			<iconify-icon icon="experiment" />
		</div>
		<div>
			Red color:
			<iconify-icon icon="experiment" :style="{ color: 'red' }" />
			<iconify-icon icon="experiment" style="color: red" />
			<iconify-icon icon="experiment" :style="redIcon" />
		</div>
		<div>
			40px:
			<iconify-icon icon="experiment" height="40" />
			<iconify-icon icon="experiment" width="40" />
			<iconify-icon icon="experiment" :style="{ fontSize: '40px' }" />
			<iconify-icon icon="experiment" style="font-size: 40px" />
			<iconify-icon icon="experiment" :style="bigIcon" />
		</div>
		<div>
			Red and 40px:
			<iconify-icon icon="experiment" height="40" :style="redIcon" />
			<iconify-icon
				icon="experiment"
				:style="{ color: 'red', fontSize: '40px' }"
			/>
			<iconify-icon
				icon="experiment"
				style="color: red; font-size: 40px"
			/>
			<iconify-icon icon="experiment" :style="[bigIcon, redIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
	data: () => {
		return {
			redIcon: {
				color: 'red',
			},
			bigIcon: {
				fontSize: '40px',
			},
		};
	},
});
</script>
