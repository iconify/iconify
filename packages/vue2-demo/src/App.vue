<template>
	<div id="app">
		<OfflineUsageDemo />
		<FullOfflineUsageDemo />
		<FullUsageDemo />

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

import {
	addIcon as addOfflineIcon,
	addCollection as addOfflineCollection,
} from '@iconify/vue2/dist/offline';
import {
	addIcon as addOnlineIcon,
	addCollection as addOnlineCollection,
	disableCache,
} from '@iconify/vue2/dist/iconify';
import bxBarChartAlt from '@iconify-icons/bx/bx-bar-chart-alt';
import bxShapes from '@iconify-icons/bx/bxs-shapes';

import Checkbox from './demo-components/Checkbox.vue';
import InlineDemo from './demo-components/Inline.vue';
import OfflineUsageDemo from './demo-components/UsageOffline.vue';
import FullOfflineUsageDemo from './demo-components/UsageFullOffline.vue';
import FullUsageDemo from './demo-components/UsageFull.vue';

// Disable cache
disableCache('all');

// Add 'bx:bx-bar-chart-alt' as 'demo' for offline module
addOfflineIcon('demo', bxBarChartAlt);

// Add 'bx:bxs-shapes' as 'demo' for full module
addOnlineIcon('demo', bxShapes);

// Add different custom icons as 'experiment2' for offline and online modes
addOfflineIcon('experiment2', {
	width: 16,
	height: 16,
	body:
		'<circle fill-opacity="0.2" cx="8" cy="8" r="7" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="currentColor"/><path d="M7 9L5 7L3.5 8.5L7 12L13 6L11.5 4.5L7 9Z" fill="currentColor"/>',
});
addOnlineIcon('experiment2', {
	width: 16,
	height: 16,
	body:
		'<g fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 8.9c.1.6.2 1.1.4 1.7l.6 1.7l-.5.7H10c0 .5-.2 1-.6 1.4c-.4.4-.9.6-1.4.6c-.5 0-1.1-.2-1.4-.6c-.4-.4-.6-.9-.6-1.4H2.5l-.5-.7l.6-1.7c.2-.8.4-1.6.4-2.4V6c0-.7.1-1.4.4-2c.3-.7.7-1.2 1.2-1.7s1.1-.8 1.8-1C6.9 1.1 7.5 1 8 1c-.2.3-.4.7-.6 1.1c-.2 0-.4 0-.7.2c-.5.1-1 .4-1.4.8c-.4.3-.8.8-1 1.3c-.2.5-.3 1-.3 1.6v2.2c0 .9-.2 1.8-.4 2.7L3.2 12h9.6l-.4-1.1c-.175-.526-.274-1.13-.363-1.674L12 9c.4 0 .7 0 1-.1zM8 14c.2 0 .5-.1.7-.3c.2-.2.3-.4.3-.7H7c0 .3.1.5.3.7c.2.2.5.3.7.3zm7-10a3 3 0 1 1-6 0a3 3 0 0 1 6 0z"></path></g>',
});

// Add few mdi-light: icons
addOfflineCollection({
	prefix: 'offline-mdi-light',
	icons: {
		'account-alert': {
			body:
				'<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
		},
		'link': {
			body:
				'<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
		},
	},
	width: 24,
	height: 24,
});
addOnlineCollection({
	prefix: '',
	icons: {
		alert1: {
			body:
				'<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
		},
		link1: {
			body:
				'<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
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
		FullOfflineUsageDemo,
		FullUsageDemo,
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
.icon-24 svg {
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

.alert svg {
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

.checkbox svg {
	margin-right: 4px;
	color: #afafaf;
	font-size: 24px;
	line-height: 1em;
	vertical-align: -0.25em;
}
.checkbox--checked svg {
	color: #327335;
}
.checkbox:hover svg {
	color: inherit;
}

.checkbox-container small {
	margin-left: 4px;
	opacity: 0.7;
}

/* Inline demo */
.inline-demo svg {
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
