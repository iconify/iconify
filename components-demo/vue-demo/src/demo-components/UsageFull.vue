<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const loadedCalled = ref(false);
function loaded(name: string) {
	console.log('Loaded:', name);
	loadedCalled.value = true;
}

function customise1(
	content: string,
	name: string,
	prefix: string,
	provider: string
) {
	if (name !== 'arrow-right' || prefix !== 'line-md' || provider !== '') {
		throw new Error('Bad params in customise callback');
	}
	return content.replace(/stroke-width="2"/g, 'stroke-width="1.5"');
}
</script>
<template>
	<section class="icon-24">
		<h1>Usage (full module)</h1>
		<div>
			Icons referenced by name (rendered as SVG, then as SPAN):
			<Icon icon="mdi:home" @load="loaded" />
			<Icon icon="mdi:home" mode="style" />
		</div>
		<div>
			SSR prop: <Icon icon="mdi:home" :ssr="true" /><Icon
				icon="line-md:arrow-right"
				:ssr="true"
			/>
		</div>
		<div>
			Customising stroke width:
			<Icon icon="line-md:arrow-right" />
			<Icon icon="line-md:arrow-right" :customise="customise1" />
			<Icon
				icon="line-md:arrow-right"
				:customise="
					(content) =>
						content.replace(
							/stroke-width=&quot;2&quot;/g,
							'stroke-width=&quot;1&quot;'
						)
				"
			/>
		</div>
		<div class="alert">
			<Icon icon="mdi-light:alert" />Important notice with alert icon!
		</div>
		<div>Load event triggered: {{ loadedCalled }}</div>
	</section>
</template>
