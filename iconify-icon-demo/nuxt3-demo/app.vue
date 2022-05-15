<template>
	<div>
		<span>
			<iconify-icon icon="mdi-animated:coffee" inline />
			Icon used by name (preloaded)
		</span>
		<span>
			<iconify-icon icon="mdi:email" inline />
			Icon used by name (loaded from API)
		</span>
		<span>
			<iconify-icon :icon="testIcon" inline />
			Icon used as stringified object
		</span>
	</div>
</template>

<script lang="ts">
import { disableCache, addIcon } from 'iconify-icon';

// Preload icon
addIcon('mdi-animated:coffee', {
	width: 24,
	height: 24,
	body: `<mask id="coffee-mask" x="0" y="0" width="24" height="24"><g fill="white"><path d="M20 13h-2v-3h2v3Zm0-5H4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"></path><path d="M8 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M16 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4" stroke="white" stroke-width="2" fill="none"><animateMotion path="M0 0v-8" calcMode="linear" dur="3s" repeatCount="indefinite"></animateMotion></path></g><g fill="black"><path d="M4 7h18v1H4zM4 0h18v2H4z"></path></g></mask><rect mask="url(#coffee-mask)" width="24" height="24" fill="currentColor"></rect>`,
});

// Disable cache to make sure other icons aren't cached after being loaded from API
disableCache('all');

export default {
	data() {
		return {
			testIcon: JSON.stringify({
				body: '<mask id="github-in-mask" x="0" y="0" width="24" height="24"><g fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g stroke-dashoffset="32" stroke-dasharray="32"><path d="M12 4c1.668 0 2.612.4 3 .5c.525-.425 1.938-1.5 3.5-1.5c.344 1 .286 2.22 0 3c.75 1 1 2 1 3.5c0 2.188-.483 3.582-1.5 4.5c-1.017.918-2.111 1.375-3.5 1.5c.65.538.5 1.874.5 2.5v3"/><path d="M12 4c-1.668 0-2.612.4-3 .5C8.475 4.075 7.062 3 5.5 3c-.344 1-.286 2.22 0 3c-.75 1-1 2-1 3.5c0 2.188.483 3.582 1.5 4.5c1.017.918 2.111 1.375 3.5 1.5c-.65.538-.5 1.874-.5 2.5v3"/><animate attributeName="stroke-dashoffset" values="32;0" dur="0.5s" fill="freeze"/></g><path d="M9 19" stroke-dashoffset="10" stroke-dasharray="10"><animate attributeName="stroke-dashoffset" values="10;0" dur="0.5s" begin="0.5s" fill="freeze"/><animate attributeName="d" values="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5;M9 19c-1.406 0-3-.5-4-.5-.532 0-1 0-2-.5;M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5" dur="3s" repeatCount="indefinite"/></path></g></mask><mask id="github-in-mask2" x="0" y="0" width="24" height="24"><g fill="white"><ellipse cx="9.5" cy="9" rx="1.5" ry="1"/><ellipse cx="14.5" cy="9" rx="1.5" ry="1"/></g></mask><rect mask="url(#github-in-mask)" x="0" y="0" width="24" height="24" fill="currentColor"/><rect mask="url(#github-in-mask2)" x="8" y="11" width="8" height="2" fill="currentColor"><animate attributeName="y" values="10;10;8;8;10;10" keyTimes="0;0.45;0.46;0.54;0.55;1" dur="10s" repeatCount="indefinite"/></rect>',
				width: 24,
				height: 24,
			}),
		};
	},
};
</script>

<style scoped>
div {
	font-size: 16px;
	line-height: 24px;
}
span {
	display: block;
}
</style>
