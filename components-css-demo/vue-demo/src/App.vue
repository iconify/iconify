<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import type { IconifyIcon } from '@iconify/types';
import { type CSSIconComponentViewbox, Icon } from '@iconify/css-vue';
import { Icon as BasicIcon } from '@iconify/css-vue/basic';
import { loadIcon } from '@iconify/css-vue/helpers/load-icon';
import GitHubIcon from '@iconify-vue/ri/github-line';
import TwitterIcon from '@iconify-vue/ri/twitter-x-line';
import LinkedInIcon from '@iconify-vue/ri/linkedin-box-line';
import BlueSkyIcon from '@iconify-vue/ri/bluesky-line';
import GitHubIconTest from '@iconify/ri-vue-test/github-line';
import TwitterIconTest from '@iconify/ri-vue-test/twitter-x-line';
import LinkedInIconTest from '@iconify/ri-vue-test/linkedin-box-line';
import BlueSkyIconTest from '@iconify/ri-vue-test/bluesky-line';
import TestIcon1 from './icons/icon1.vue';
import TestIcon2 from './icons/icon2.vue';
import TestIcon3 from './icons/icon3.vue';
import TestIcon1b from './icons/icon1-ts.vue';
import TestIcon2b from './icons/icon2-ts.vue';
import TestIcon3b from './icons/icon3-ts.vue';
import TestIcon1c from './icons/icon1-func.js';
import TestIcon2c from './icons/icon2-func.js';
import TestIcon3c from './icons/icon3-func.js';

const grid24: CSSIconComponentViewbox = {
	width: 24,
	height: 24,
};
const refreshViewbox: CSSIconComponentViewbox = {
	width: 22,
	height: 24,
};

const tablerHomeIcon = `<g class="tabler-group">
		<path class="tabler-home-path1" />
		<path class="tabler-home-path2" />
	</g>`;
const tablerUserIcon = `<path class="eh1pdv i_g6gd zosa6w" /><path class="eh1pdv gb90pv yc6i9w" />`;
const tablerUserFilledIcon = `<path class="jhh48i qlbhpj ydovum" /><path class="a0ixkd kfci3p u7lp5j" /><path class="h4r4ew kfci3p yc6i9w ydovum" />`;

const msDrafts = `<path class="ms-drafts" />`;
const msMail = `<path class="ms-mail" />`;

const targetIcon = `<defs><mask id="SVGYEQb6bSe"><path class="g_1xrq in7b1h iy2otu k63a6f y4wbml"></path><path class="al390y eq8iua g_1xrq ivbn6z y4wbml"></path></mask></defs><path mask="url(#SVGYEQb6bSe)" class="lsejuv ydovum"></path><path class="eq8iua g_1xrq ivbn6z iy2otu s8e22g y4wbml"></path><path class="g_1xrq iy2otu odtl1h s8e22g ydovum znaocm"></path>`;

const refreshIcon = `<defs>
	<mask id="SVGYCxuLdPe">
		<path class="iy2otu r1menc ullnga w-_u6e zxndow"></path>
		<path class="hgfl7k iy2otu jcsjqr r1menc zxndow"></path>
		<path class="al390y hgfl7k r1menc z77veu"></path>
	</mask>
</defs>
<path mask="url(#SVGYCxuLdPe)" class="axv--x"></path>
<path class="hgfl7k iy2otu r1menc s8e22g z77veu"></path>`;

const iconData = shallowRef<IconifyIcon | null>(null);
loadIcon('material-symbols:mail-lock-outline-rounded')
	.then((data) => {
		iconData.value = data;
	})
	.catch(console.error);

const hideAnimated = ref(false);
function restartAnimations() {
	hideAnimated.value = true;
	setTimeout(() => {
		hideAnimated.value = false;
	}, 100);
}

const hAlignValues = ['left', 'center', 'right'] as const;
const vAlignValues = ['top', 'middle', 'bottom', 'stretch'] as const;
const fillValues = [
	'no-fill',
	'light-filled',
	'dark-filled',
	'filled',
] as const;
const modeValues = ['auto', 'light', 'dark'] as const;

const halign = ref<(typeof hAlignValues)[number]>(hAlignValues[0]);
const valign = ref<(typeof vAlignValues)[number]>(vAlignValues[0]);
const fill = ref<(typeof fillValues)[number]>(fillValues[0]);
const mode = ref<(typeof modeValues)[number]>(modeValues[0]);
const action = ref(false);

function nextHAlign() {
	const index = hAlignValues.indexOf(halign.value);
	halign.value = hAlignValues[(index + 1) % hAlignValues.length];
}
function nextVAlign() {
	const index = vAlignValues.indexOf(valign.value);
	valign.value = vAlignValues[(index + 1) % vAlignValues.length];
}
function nextFill() {
	const index = fillValues.indexOf(fill.value);
	fill.value = fillValues[(index + 1) % fillValues.length];
}
function nextMode() {
	const index = modeValues.indexOf(mode.value);
	mode.value = modeValues[(index + 1) % modeValues.length];
}
</script>
<template>
	<div id="app" :class="{ 'hide-animated': hideAnimated }">
		<section>
			<h1>Demo for SVG+CSS</h1>
			<p>This browser <span class="status"></span> SVG+CSS</p>
			<p>
				Known browsers that do not support SVG+CSS: Safari 26.3
				(currently latest stable version)
			</p>
		</section>
		<section>
			<h1>Test icons</h1>
			<div class="icons-list">
				Home icon (+check for fallback):
				<div>
					<Icon
						:content="tablerHomeIcon"
						:viewBox="grid24"
						height="24"
						fallback="tabler:home-check"
					/>
				</div>
			</div>
			<div class="icons-list">
				Mail icons (locked for fallback):
				<div>
					<Icon
						:content="msDrafts"
						:viewBox="grid24"
						height="24"
						fallback="material-symbols:mail-lock-outline-rounded"
					/>
					<Icon
						:content="msMail"
						:viewBox="grid24"
						height="24"
						fallback="material-symbols:mail-lock-outline-rounded"
					/>
				</div>
			</div>
			<div class="restart-animations">
				<button @click="restartAnimations">
					<Icon
						:content="refreshIcon"
						:viewBox="refreshViewbox"
						height="24"
						fallback=""
					/>
					Restart animations
				</button>
			</div>
			<div class="icons-list has-animations">
				Animated icons:
				<div>
					<Icon
						:content="targetIcon"
						:viewBox="grid24"
						height="24"
						fallback="tabler:current-location-filled"
					/>
					<Icon
						:content="tablerUserIcon"
						:viewBox="grid24"
						height="24"
						fallback="tabler:user"
					/><Icon
						:content="tablerUserFilledIcon"
						:viewBox="grid24"
						height="24"
						fallback="tabler:user-filled"
					/>
				</div>
			</div>
		</section>
		<section>
			<h1>
				No size set (container limited to 100x200 px,
				preserveAspectRatio aligns icon to bottom)
			</h1>
			<div style="width: 100px; height: 200px; display: flex">
				<Icon
					:content="tablerHomeIcon"
					:viewBox="grid24"
					fallback="tabler:home-check"
					preserveAspectRatio="xMidYMax meet"
				/>
			</div>
		</section>
		<section>
			<h1>Testing various params</h1>
			<div class="icons-list">
				No fallback (should render icon in modern browser only), 2
				icons:
				<div>
					<Icon :content="msDrafts" :viewBox="grid24" height="24" />
					<BasicIcon
						:content="msDrafts"
						:viewBox="grid24"
						height="24"
					/>
				</div>
			</div>
			<div class="icons-list">
				Fallback only as string (used as Iconify Icon component):
				<div>
					<Icon
						:viewBox="grid24"
						height="24"
						fallback="material-symbols:mail-lock-outline-rounded"
					/>
				</div>
			</div>
			<div class="icons-list" v-if="iconData">
				Fallback only as IconifyIcon (used as Iconify Icon component):
				<div>
					<Icon :viewBox="grid24" height="24" :fallback="iconData" />
				</div>
			</div>
		</section>
		<section>
			<h1>Test generated icon component</h1>
			<div class="icons-list">
				From @iconify-vue/ri:
				<div>
					<GitHubIcon height="24" />
					<TwitterIcon height="24" />
					<LinkedInIcon height="24" />
					<BlueSkyIcon height="24" />
				</div>
			</div>
			<div class="icons-list">
				From test package:
				<div>
					<GitHubIconTest height="24" />
					<TwitterIconTest height="24" />
					<LinkedInIconTest height="24" />
					<BlueSkyIconTest height="24" />
				</div>
			</div>
			<div class="icons-list svg-hover-anchor">
				Generated stateful icons (one with ts, one without, one
				functional):
				<div>
					<TestIcon1 height="24" :halign="halign" :valign="valign" />
					<TestIcon1b
						height="24"
						:halign="halign"
						:valign="valign"
					/><TestIcon1c
						height="24"
						:halign="halign"
						:valign="valign"
					/>
					<TestIcon2 height="24" :action="action" />
					<TestIcon2b height="24" :action="action" />
					<TestIcon2c height="24" :action="action" />
					<TestIcon3 height="24" :fill="fill" :mode="mode" />
					<TestIcon3b height="24" :fill="fill" :mode="mode" />
					<TestIcon3c height="24" :fill="fill" :mode="mode" />
				</div>
			</div>
			<div style="display: flex; gap: 8px; flex-wrap: wrap">
				<button @click="nextHAlign">hAlign: {{ halign }}</button>
				<button @click="nextVAlign">vAlign: {{ valign }}</button>
				<button @click="nextMode">Mode: {{ mode }}</button>
				<button @click="nextFill">Fill: {{ fill }}</button>
				<button @click="() => (action = !action)">Toggle</button>
			</div>
		</section>
	</div>
</template>
