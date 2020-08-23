<template>
	<section>
		<h1>Class (components/Class.vue)</h1>
		<div>
			Default icon:
			<Icon icon="experiment" />
		</div>
		<div>
			Red color:
			<Icon icon="experiment" class="red-color" />
			<Icon icon="experiment" :class="redClass" />
		</div>
		<div>
			Red color and 20px:
			<Icon icon="experiment" class="red-color big-icon" />
			<Icon icon="experiment" :class="[redClass, bigIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';

export default {
	components: {
		Icon,
	},
	data: () => {
		return {
			redClass: 'red-color',
			bigIcon: 'big-icon',
		};
	},
};
</script>

<style>
.red-color {
	color: red;
}
.big-icon {
	font-size: 20px;
}
</style>
