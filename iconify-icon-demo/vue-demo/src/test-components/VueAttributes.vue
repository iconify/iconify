<template>
	<section>
		<h1>Vue attributes (components/VueAttributes.vue)</h1>
		<div>
			Icon size (2em) with title:
			<iconify-icon icon="admin-users" height="2em" title="Big icon" />
		</div>
		<div>
			Icon style as string (red):
			<iconify-icon
				icon="admin-users"
				style="color: red"
				title="Red icon"
			/>
		</div>
		<div>
			Inline icon with vertical-align style as string (aligned to top):
			<iconify-icon
				icon="admin-users"
				style="vertical-align: 0.25em"
				inline
			/>
		</div>
		<div>
			Inline icon with bound style as object (purple, 2em, no alignment):
			<iconify-icon icon="admin-users" v-bind:style="icon1StyleObj" />
		</div>
		<div>
			Inline icon with bound style as string (purple, 2em, no alignment):
			<iconify-icon icon="admin-users" v-bind:style="icon1StyleStr" />
		</div>
		<div>
			Combined styles (green, 2em, shadow):
			<iconify-icon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, fontSizeStyleObj2]"
			/>
		</div>
		<div>
			Dynamic style (red / green, shadow):
			<iconify-icon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, dynamicStyleObj]"
				v-on:click="
					dynamicStyleObj.color =
						dynamicStyleObj.color === 'red' ? 'green' : 'red'
				"
			/>&nbsp;(click it!)
		</div>
		<div>
			Dynamic style (shadow / color):
			<iconify-icon
				icon="admin-users"
				v-bind:style="[
					showShadow ? boxShadowStyleObj : dynamicStyleObj,
				]"
				v-on:click="showShadow = !showShadow"
			/>&nbsp;(click it!)
		</div>
		<div>
			Reference:
			<iconify-icon
				icon="admin-users"
				ref="icon1"
				@click="logReference"
			/>&nbsp;(click to log)
		</div>
	</section>
</template>

<script lang="ts">
import { addIcon } from 'iconify-icon';
import adminUsers from '@iconify-icons/dashicons/admin-users';

addIcon('admin-users', adminUsers);

export default {
	data: () => {
		return {
			icon: 'admin-users',
			icon1StyleObj: {
				fontSize: '2em',
				color: 'purple',
				verticalAlign: 0,
			},
			icon1StyleStr: 'color: purple; vertical-align: 0; font-size: 2em;',
			colorStyleStr: 'color: purple',
			colorStyleObj: {
				color: 'purple',
			},
			fontSizeStyleStr: 'font-size: 2em',
			fontSizeStyleObj: {
				fontSize: '2em',
			},
			fontSizeStyleObj2: {
				'font-size': '2em',
			},
			boxShadowStyleStr: 'box-shadow: 0 0 2px #000;',
			boxShadowStyleObj: {
				boxShadow: '0 0 2px #000',
			},
			dynamicStyleObj: {
				color: 'red',
			},
			showShadow: true,
		};
	},
	methods: {
		logReference: function () {
			console.log('References:', this.$refs);
		},
	},
};
</script>
