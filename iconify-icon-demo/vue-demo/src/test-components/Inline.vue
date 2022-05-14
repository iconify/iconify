<template>
	<section>
		<h1>Inline (components/Inline.vue)</h1>
		<div>
			Block icons (behaving like image):
			<iconify-icon icon="experiment2" />
		</div>
		<div>
			Inline icons (behaving line text / icon font):
			<iconify-icon icon="experiment2" inline />
		</div>
		<div>
			Using "vertical-align: 0" to override inline attribute:
			<iconify-icon
				icon="experiment2"
				:style="{ verticalAlign: 0 }"
				inline
			/>
		</div>
	</section>
</template>

<style scoped>
iconify-icon {
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
