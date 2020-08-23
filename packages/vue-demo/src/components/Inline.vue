<template>
	<section>
		<h1>Inline (components/Inline.vue)</h1>
		<div>
			Block icons (behaving like image):
			<Icon icon="experiment2" />
			<InlineIcon icon="experiment2" :inline="false" />
		</div>
		<div>
			Inline icons (behaving line text / icon font):
			<InlineIcon icon="experiment2" />
			<Icon icon="experiment2" :inline="true" />
		</div>
		<div>
			Using "vertical-align: 0" to override inline attribute:
			<inline-icon icon="experiment2" :style="{ verticalAlign: 0 }" />
			<icon
				icon="experiment2"
				:style="{ verticalAlign: 0 }"
				:inline="true"
			/>
		</div>
	</section>
</template>

<script lang="ts">
import { Icon, InlineIcon } from '@iconify/vue';

export default {
	components: {
		// Component with inline="false" by default
		Icon,
		// Component with inline="true" by default
		InlineIcon,
	},
};
</script>

<style scoped>
svg {
	color: #06a;
	margin-right: 8px;
	/* box-shadow: 0 0 0 1px #06a inset; */
	position: relative;
	z-index: 2;
	background: #fff;
}
div {
	position: relative;
	font-size: 16px;
	line-height: 1.5;
}
div:before,
div:after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	height: 0;
	border-top: 1px dashed #506874;
	opacity: 0.5;
	z-index: -1;
}
div:before {
	bottom: 5px;
}
div:after {
	bottom: 7px;
	border-top-color: #ba3329;
}
</style>
