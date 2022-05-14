<template>
	<div id="app">
		<OfflineUsageDemo />
		<UsageDemo />

		<section>
			<h1>Checkbox</h1>
			<div>
				<Checkbox
					:checked="true"
					text="Checkbox example"
					hint="(click to toggle)"
				/>
				<Checkbox
					:checked="false"
					text="Another checkbox example"
					hint="(click to toggle)"
				/>
			</div>
		</section>

		<InlineDemo />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import { PluginObject } from 'vue';

import { addIcon, addCollection, disableCache } from 'iconify-icon';
import bxShapes from '@iconify-icons/bx/bxs-shapes';

import Checkbox from './demo-components/Checkbox.vue';
import InlineDemo from './demo-components/Inline.vue';
import OfflineUsageDemo from './demo-components/UsageOffline.vue';
import UsageDemo from './demo-components/Usage.vue';

// Disable cache
disableCache('all');

// Add few icons
addIcon('demo', bxShapes);
addIcon('experiment2', {
	width: 16,
	height: 16,
	body: '<mask id="coffee-mask" x="0" y="0" width="16" height="16"><g fill="white"><path d="M5-2c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M8.5-2c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12-2c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4" stroke="white" stroke-width="1" fill="none"><animateMotion path="M0 0v-8" calcMode="linear" dur="3s" repeatCount="indefinite" /></path></g><rect y="4" width="16" height="12" fill="black" /><path d="M2 5H13C14.1046 5 15 5.89543 15 7V8C15 9.10457 14.1046 10 13 10H12V14C12 15.1046 11.1046 16 10 16H4C2.89543 16 2 15.1046 2 14V5Z" fill="white" /><path d="M12 6H13C13.5523 6 14 6.44772 14 7V8C14 8.55228 13.5523 9 13 9H12V6Z" fill="black" /></mask><rect mask="url(#coffee-mask)" width="16" height="16" fill="currentColor" />',
});

// Add few mdi-light: icons
addCollection({
	prefix: '',
	icons: {
		alert1: {
			body: '<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
		},
		link1: {
			body: '<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
		},
	},
	width: 24,
	height: 24,
});

@Component({
	components: {
		Checkbox,
		InlineDemo,
		OfflineUsageDemo,
		UsageDemo,
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

/* 24px icon */
.icon-24 iconify-icon {
	font-size: 24px;
	line-height: 1;
	vertical-align: -0.25em;
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

.alert iconify-icon {
	position: absolute;
	left: 12px;
	top: 50%;
	font-size: 24px;
	line-height: 1em;
	margin: -0.5em 0 0;
}

/* Checkbox component */
.checkbox-container {
	margin: 8px 0;
}

.checkbox {
	cursor: pointer;
	/* color: #1769aa; */
	color: #626262;
	text-decoration: none;
}
.checkbox:hover {
	color: #ba3329;
	text-decoration: underline;
}

.checkbox iconify-icon {
	margin-right: 4px;
	color: #afafaf;
	font-size: 24px;
	line-height: 1em;
	vertical-align: -0.25em;
}
.checkbox--checked iconify-icon {
	color: #327335;
}
.checkbox:hover iconify-icon {
	color: inherit;
}

.checkbox-container small {
	margin-left: 4px;
	opacity: 0.7;
}

/* Inline demo */
.inline-demo iconify-icon {
	color: #06a;
	margin: 0 8px;
	position: relative;
	z-index: 2;
	background: #fff;
}
.inline-demo div {
	position: relative;
	font-size: 16px;
	line-height: 1.5;
}
.inline-demo div:before,
.inline-demo div:after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	height: 0;
	border-top: 1px dashed #506874;
	opacity: 0.5;
	z-index: -1;
}
.inline-demo div:before {
	bottom: 5px;
}
.inline-demo div:after {
	bottom: 7px;
	border-top-color: #ba3329;
}
</style>
