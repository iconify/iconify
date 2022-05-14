<template>
	<section>
		<h1>Vue attributes (components/VueAttributes.vue)</h1>
		<div>
			Icon size (2em):
			<iconify-icon icon="admin-users" height="2em" />
		</div>
		<div>
			Icon style as string (red):
			<iconify-icon icon="admin-users" style="color: red" />
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
			<iconify-icon
				icon="admin-users"
				v-bind:style="icon1StyleObj"
				inline
			/>
		</div>
		<div>
			Inline icon with bound style as string (purple, 2em, no alignment):
			<iconify-icon
				icon="admin-users"
				v-bind:style="icon1StyleStr"
				inline
			/>
		</div>
		<div>
			Combined styles (green, 2em, shadow):
			<iconify-icon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, fontSizeStyleObj2]"
				inline
			/>
		</div>
		<div>
			Dynamic style (red / green, shadow):
			<iconify-icon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, dynamicStyleObj]"
				inline
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
				inline
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
import { Vue } from 'vue-property-decorator';
import { addIcon } from 'iconify-icon';
import adminUsers from '@iconify-icons/dashicons/admin-users';

addIcon('admin-users', adminUsers);

export default Vue.extend({
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
});
</script>
