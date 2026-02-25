<script setup>
import { Icon } from '@iconify/css-vue';
import { computed } from 'vue';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/ona74n.css';
import './css/mfq4_u.css';
import './css/mfxbmu.css';
import './css/fabh7v.css';
import './css/ek9rqv.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

const props = defineProps(["halign","valign","focus","width","height"]);

const states = computed(() => ({ 'halign': namedStateValue(props['halign'], 'left'), 'valign': namedStateValue(props['valign'], 'top'), 'focus': props['focus'] }));
const fallback = computed(() => getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}],states.value));
const className = computed(() => Object.entries(states.value).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' '));
const viewBox = {"width":22,"height":24};
const content = `<path class="fabh7v mfq4_u ona74n"/><path class="ek9rqv mfxbmu ona74n"/>`;
</script>
<template><Icon :class="className" :width="width" :height="height" :viewBox="viewBox" :content="content" :fallback="fallback" /></template>
