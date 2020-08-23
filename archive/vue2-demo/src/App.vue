<template>
	<div id="app">
		<section>
			<h1>Usage</h1>
			<div>
				Empty Icon:
				<IconifyIcon />
			</div>
			<div>
				Icon referenced by name:
				<IconifyIcon icon="minus" />
			</div>
			<div>
				Icon referenced by object:
				<iconify-icon v-bind:icon="userIcon" inline="true" />
			</div>
			<div class="alert">
				<iconify-icon :icon="alertIcon" />
				Important notice with alert icon!
			</div>
		</section>
		<section>
			<h1>Example file (components/usage/*.vue)</h1>
			<UsageExample />
		</section>

		<VueAttributes />
		<InlineDemo />
		<AlignmentDemo />
		<TransformationsDemo />
		<StyleDemo />
		<ClassDemo />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import { PluginObject } from 'vue';

import IconifyIcon from '@iconify/vue';
import paperclipIcon from '@iconify-icons/dashicons/paperclip';
import bxMinusCircle from '@iconify-icons/bx/bx-minus-circle';
import bxError from '@iconify-icons/bx/bx-error';
import bxUser from '@iconify-icons/bx/bx-user';

import VueAttributes from './components/VueAttributes.vue';
import InlineDemo from './components/Inline.vue';
import AlignmentDemo from './components/Alignment.vue';
import TransformationsDemo from './components/Transform.vue';
import StyleDemo from './components/Style.vue';
import ClassDemo from './components/Class.vue';
import UsageExample from './components/usage/Object.vue';

// Vue.use((IconifyIcon as unknown) as PluginObject<unknown>);
IconifyIcon.addIcon('minus', bxMinusCircle);
IconifyIcon.addIcon('experiment', paperclipIcon);

// Add custom icon as 'experiment2'
IconifyIcon.addIcon('experiment2', {
	width: 16,
	height: 16,
	body:
		'<circle fill-opacity="0.2" cx="8" cy="8" r="7" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="currentColor"/><path d="M7 9L5 7L3.5 8.5L7 12L13 6L11.5 4.5L7 9Z" fill="currentColor"/>',
});

@Component({
	components: {
		IconifyIcon,
		VueAttributes,
		InlineDemo,
		AlignmentDemo,
		TransformationsDemo,
		StyleDemo,
		ClassDemo,
		UsageExample,
	},
	data: () => {
		return {
			userIcon: bxUser,
			alertIcon: bxError,
		};
	},
})
export default class App extends Vue {}
</script>

<style>
#app {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: left;
	color: #2c3e50;
	font-size: 16px;
	line-height: 1.5;
}
section {
	border-bottom: 1px dotted #ccc;
	padding: 16px;
}
section:last-child {
	border-bottom-width: 0;
}
section:after {
	content: ' ';
	display: table;
	clear: both;
}
h1 {
	margin: 0 0 16px;
	padding: 0;
	font-size: 24px;
	font-weight: normal;
}
p {
	margin: 12px 0 4px;
	padding: 0;
}

/* Alert demo */
.alert {
	position: relative;
	margin: 8px;
	padding: 16px;
	padding-left: 48px;
	background: #ba3329;
	color: #fff;
	border-radius: 5px;
	float: left;
}

.alert + div {
	clear: both;
}

.alert svg {
	position: absolute;
	left: 12px;
	top: 50%;
	font-size: 24px;
	line-height: 1em;
	margin: -0.5em 0 0;
}
</style>
