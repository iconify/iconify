<template>
	<section>
		<h1>Alignment (components/Alignment.vue)</h1>
		<div>
			<p>Icon with correct width/heigh ratio:</p>
			<Icon icon="demo" />
		</div>
		<div>
			<p>Bad width/height ratio, default alignment (slice = false):</p>
			<Icon icon="demo" width="2em" height="1em" />
			<Icon icon="demo" width="1em" height="2em" />
		</div>
		<div>
			<p>Slice:</p>
			<Icon icon="demo" width="2em" height="1em" :slice="true" />
			<Icon icon="demo" width="2em" height="1em" align="slice" />
		</div>
		<div>
			<p>Slice:</p>
			<Icon icon="demo" width="1em" height="2em" :slice="true" />
			<Icon icon="demo" width="1em" height="2em" align="slice" />
		</div>
		<div>
			<p>Left:</p>
			<Icon icon="demo" width="2em" height="1em" hAlign="left" />
			<Icon icon="demo" width="2em" height="1em" h-align="left" />
			<Icon icon="demo" width="2em" height="1em" horizontalAlign="left" />
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				horizontal-align="left"
			/>
			<Icon icon="demo" width="2em" height="1em" align="left" />
		</div>
		<div>
			<p>Left with slice:</p>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				hAlign="left"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				h-align="left"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				horizontalAlign="left"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				horizontal-align="left"
				:slice="true"
			/>
			<Icon icon="demo" width="1em" height="2em" align="left,slice" />
		</div>
		<div>
			<p>Right:</p>
			<Icon icon="demo" width="2em" height="1em" hAlign="right" />
			<Icon icon="demo" width="2em" height="1em" h-align="right" />
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				horizontalAlign="right"
			/>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				horizontal-align="right"
			/>
			<Icon icon="demo" width="2em" height="1em" align="right" />
		</div>
		<div>
			<p>Right with slice:</p>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				hAlign="right"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				h-align="right"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				horizontalAlign="right"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				horizontal-align="right"
				:slice="true"
			/>
			<Icon icon="demo" width="1em" height="2em" align="right,slice" />
		</div>
		<div>
			<p>Top:</p>
			<Icon icon="demo" width="1em" height="2em" verticalAlign="top" />
			<Icon icon="demo" width="1em" height="2em" vertical-align="top" />
			<Icon icon="demo" width="1em" height="2em" v-bind:v-align="'top'" />
			<Icon icon="demo" width="1em" height="2em" align="top" />
		</div>
		<div>
			<p>Top with slice:</p>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				verticalAlign="top"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				vertical-align="top"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				v-bind:v-align="'top'"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				align="top"
				:slice="true"
			/>
		</div>
		<div>
			<p>Bottom:</p>
			<Icon icon="demo" width="1em" height="2em" verticalAlign="bottom" />
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				vertical-align="bottom"
			/>
			<Icon
				icon="demo"
				width="1em"
				height="2em"
				v-bind:v-align="'bottom'"
			/>
			<Icon icon="demo" width="1em" height="2em" align="bottom" />
		</div>
		<div>
			<p>Bottom with slice:</p>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				verticalAlign="bottom"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				vertical-align="bottom"
				:slice="true"
			/>
			<Icon
				icon="demo"
				width="2em"
				height="1em"
				v-bind:v-align="'bottom'"
				:slice="true"
			/>
			<Icon icon="demo" width="2em" height="1em" align="bottom,slice" />
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';

export default {
	components: {
		Icon,
	},
};
</script>

<style scoped>
svg {
	color: #06a;
	font-size: 32px;
	line-height: 1em;
	margin-right: 8px;
	box-shadow: 0 0 0 1px #ccc;
	vertical-align: top;
}
</style>
