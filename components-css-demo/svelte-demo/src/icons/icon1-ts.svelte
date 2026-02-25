<script lang="ts">
import Icon from '@iconify/css-svelte';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/ona74n.css';
import './css/mfq4_u.css';
import './css/mfxbmu.css';
import './css/fabh7v.css';
import './css/ek9rqv.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

interface Props {
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
};

let {halign, valign, focus, width, height, ...props}: Props = $props();

let states = $derived(({ 'halign': namedStateValue(halign, 'left'), 'valign': namedStateValue(valign, 'top'), 'focus': focus }));
let fallback = $derived(getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}],states));
let className = $derived(Object.entries(states).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' '));
const viewBox = {"width":22,"height":24};
const content = `<path class="fabh7v mfq4_u ona74n"/><path class="ek9rqv mfxbmu ona74n"/>`;
</script>
<Icon class={className} width={width} height={height} viewBox={viewBox} content={content} fallback={fallback} {...props}></Icon>
