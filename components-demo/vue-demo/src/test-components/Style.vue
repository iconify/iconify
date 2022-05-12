<template>
	<section>
		<h1>Style (components/Style.vue)</h1>
		<div>
			Default icon:
			<Icon icon="demo" />
		</div>
		<div>
			Red color:
			<Icon icon="demo" color="red" />
			<Icon
				icon="demo"
				:inline="true"
				:style="{ color: 'red', verticalAlign: 0 }"
			/>
			<Icon
				icon="demo"
				:inline="true"
				style="color: red; vertical-align: 0"
			/>
			<Icon icon="demo" :style="redIcon" />
		</div>
		<div>
			40px:
			<Icon icon="demo" height="40" />
			<Icon icon="demo" :width="40" />
			<Icon
				icon="demo"
				:inline="true"
				:style="{ fontSize: '40px', verticalAlign: 0 }"
			/>
			<Icon icon="demo" style="font-size: 40px" />
			<Icon icon="demo" :style="bigIcon" />
		</div>
		<div>
			Red and 40px:
			<Icon icon="demo" height="40" color="red" />
			<Icon icon="demo" :width="40" :style="redIcon" />
			<Icon icon="demo" :style="{ color: 'red', fontSize: '40px' }" />
			<Icon icon="demo" style="color: red; font-size: 40px" />
			<Icon icon="demo" :style="[bigIcon, redIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';

export default {
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
};
</script>
