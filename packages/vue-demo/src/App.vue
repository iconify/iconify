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
			<div class="alert">
				<Icon :icon="alertIcon" />
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
import { Icon, InlineIcon, addIcon } from '@iconify/vue';

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
