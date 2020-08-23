<template>
	<section>
		<h1>Vue attributes (components/VueAttributes.vue)</h1>
		<div>
			Icon with color (red):
			<iconify-icon :icon="icon" color="red" :inline="true" />
		</div>
		<div>
			Icon size (2em):
			<IconifyIcon icon="admin-users" height="2em" />
		</div>
		<div>
			Icon style as string (red):
			<IconifyIcon icon="admin-users" style="color: red;" />
		</div>
		<div>
			Inline icon with vertical-align style as string (aligned to top):
			<IconifyIcon
				icon="admin-users"
				style="vertical-align: .25em;"
				:inline="true"
			/>
		</div>
		<div>
			Inline icon with bound style as object (purple, 2em, no alignment):
			<IconifyIcon
				icon="admin-users"
				v-bind:style="icon1StyleObj"
				:inline="true"
				color="green"
			/>
		</div>
		<div>
			Inline icon with bound style as string (purple, 2em, no alignment):
			<IconifyIcon
				icon="admin-users"
				v-bind:style="icon1StyleStr"
				:inline="true"
				color="green"
			/>
		</div>
		<div>
			Combined styles (green, 2em, shadow):
			<IconifyIcon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, fontSizeStyleObj2]"
				:inline="true"
				color="green"
			/>
		</div>
		<div>
			Dynamic style (red / green, shadow):
			<IconifyIcon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, dynamicStyleObj]"
				:inline="true"
				v-on:click="
					dynamicStyleObj.color =
						dynamicStyleObj.color === 'red' ? 'green' : 'red'
				"
			/>&nbsp;(click it!)
		</div>
		<div>
			Dynamic style (shadow / color):
			<IconifyIcon
				icon="admin-users"
				v-bind:style="[
					showShadow ? boxShadowStyleObj : dynamicStyleObj,
				]"
				:inline="true"
				v-on:click="showShadow = !showShadow"
			/>&nbsp;(click it!)
		</div>
		<div>
			Reference:
			<IconifyIcon
				icon="admin-users"
				ref="icon1"
				@click="logReference"
			/>&nbsp;(click to log)
		</div>
	</section>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import adminUsers from '@iconify-icons/dashicons/admin-users';

IconifyIcon.addIcon('admin-users', adminUsers);

export default Vue.extend({
	components: {
		IconifyIcon,
	},
	data: () => {
		return {
			icon: adminUsers,
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
		logReference: function() {
			console.log('References:', this.$refs);
		},
	},
});
</script>
