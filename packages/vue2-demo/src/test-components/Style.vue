<template>
	<section>
		<h1>Style (components/Style.vue)</h1>
		<div>
			Default icon:
			<Icon icon="experiment" />
		</div>
		<div>
			Red color:
			<Icon icon="experiment" color="red" />
			<Icon icon="experiment" :style="{ color: 'red' }" />
			<Icon icon="experiment" style="color: red" />
			<Icon icon="experiment" :style="redIcon" />
		</div>
		<div>
			40px:
			<Icon icon="experiment" height="40" />
			<Icon icon="experiment" :width="40" />
			<Icon icon="experiment" :style="{ fontSize: '40px' }" />
			<Icon icon="experiment" style="font-size: 40px" />
			<Icon icon="experiment" :style="bigIcon" />
		</div>
		<div>
			Red and 40px:
			<Icon icon="experiment" height="40" color="red" />
			<Icon icon="experiment" :width="40" :style="redIcon" />
			<Icon
				icon="experiment"
				:style="{ color: 'red', fontSize: '40px' }"
			/>
			<Icon icon="experiment" style="color: red; font-size: 40px" />
			<Icon icon="experiment" :style="[bigIcon, redIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { Icon } from '@iconify/vue2';

export default Vue.extend({
	components: {
		Icon,
	},
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
