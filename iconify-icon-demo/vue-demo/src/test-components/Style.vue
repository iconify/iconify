<template>
	<section>
		<h1>Style (components/Style.vue)</h1>
		<div>
			Default icon:
			<iconify-icon icon="demo" />
		</div>
		<div>
			Red color:
			<iconify-icon
				icon="demo"
				inline
				:style="{ color: 'red', verticalAlign: 0 }"
			/>
			<iconify-icon
				icon="demo"
				inline
				style="color: red; vertical-align: 0"
			/>
			<Icon icon="demo" :style="redIcon" />
		</div>
		<div>
			40px:
			<iconify-icon icon="demo" height="40" />
			<iconify-icon icon="demo" width="40" />
			<iconify-icon
				icon="demo"
				inline
				:style="{ fontSize: '40px', verticalAlign: 0 }"
			/>
			<iconify-icon icon="demo" style="font-size: 40px" />
			<iconify-icon icon="demo" :style="bigIcon" />
		</div>
		<div>
			Red and 40px:
			<iconify-icon icon="demo" height="40" style="color: red" />
			<iconify-icon icon="demo" width="40" :style="redIcon" />
			<iconify-icon
				icon="demo"
				:style="{ color: 'red', fontSize: '40px' }"
			/>
			<iconify-icon icon="demo" style="color: red; font-size: 40px" />
			<iconify-icon icon="demo" :style="[bigIcon, redIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
export default {
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
