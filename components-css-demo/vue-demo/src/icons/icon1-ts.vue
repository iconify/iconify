<script setup lang="ts">
import { Icon } from '@iconify/css-vue';
import { computed } from 'vue';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/u2mluk.css';
import './css/ona74n.css';
import './css/b6dtxa.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

const props = defineProps<{
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
}>();

const states = computed(() => ({ 'halign': namedStateValue(props['halign'], 'left'), 'valign': namedStateValue(props['valign'], 'top'), 'focus': props['focus'] }));
const fallback = computed(() => getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}],states.value));
const className = computed(() => Object.entries(states.value).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' ').trim() || undefined);
const viewBox = {"width":22,"height":24};
const content = `<path class="ona74n u2mluk"/><path class="b6dtxa ona74n"/>`;
</script>
<template><Icon :class="className" :width="width" :height="height" :viewBox="viewBox" :content="content" :fallback="fallback" /></template>
