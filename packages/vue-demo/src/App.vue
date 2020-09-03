<template>
	<div id="app">
		<section>
			<h1>Usage</h1>
			<div>
				Empty Icon:
				<Icon />
			</div>
			<div>
				Icon referenced by name:
				<Icon icon="minus" />
			</div>
			<div>
				Icon referenced by object (also aligned below baseline, like
				icon from icon font):
				<InlineIcon v-bind:icon="userIcon" />
			</div>
			<div>
				2 icons imported from icon set:
				<Icon
					icon="mdi-light:account-alert"
					style="font-size: 24px; line-height: 1em; vertical-align: -0.125em"
				/>
				<Icon
					icon="mdi-light:link"
					:style="{fontSize: '24px', lineHeight: '1em', verticalAlign: '-0.125em'}"
				/>
			</div>
			<div class="alert">
				<Icon :icon="alertIcon" />Important notice with alert icon!
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
import { Icon, InlineIcon, addIcon, addCollection } from '@iconify/vue';

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

addIcon('minus', bxMinusCircle);
addIcon('experiment', paperclipIcon);

// Add custom icon as 'experiment2'
addIcon('experiment2', {
	width: 16,
	height: 16,
	body:
		'<circle fill-opacity="0.2" cx="8" cy="8" r="7" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="currentColor"/><path d="M7 9L5 7L3.5 8.5L7 12L13 6L11.5 4.5L7 9Z" fill="currentColor"/>',
});

// Add few mdi-light: icons
addCollection({
	prefix: 'mdi-light',
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

export default {
	name: 'App',
	components: {
		// Component with inline="false" by default
		Icon,
		// Component with inline="true" by default
		InlineIcon,
		// Demo blocks
		VueAttributes,
		InlineDemo,
		AlignmentDemo,
		TransformationsDemo,
		StyleDemo,
		ClassDemo,
		UsageExample,
	},
	data() {
		return {
			userIcon: bxUser,
			alertIcon: bxError,
		};
	},
};
</script>
