<template>
	<section>
		<h1>Dynamically loading icons (test-components/LoadingDemo.vue)</h1>
		<div>
			Left arrow:
			<LoadingIcon icon="line-md:chevron-left">&lt;</LoadingIcon>
		</div>
	</section>
</template>

<script lang="ts">
import LoadingIcon from './LoadingIcon';

export default {
	components: {
		LoadingIcon,
	},
};
</script>
