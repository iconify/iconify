<script>
import Icon from '@iconify/css-svelte';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/u2mluk.css';
import './css/ona74n.css';
import './css/b6dtxa.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

/** @type {{halign?: 'left' | 'center' | 'right'; valign?: 'top' | 'middle' | 'bottom' | 'stretch'; focus?: boolean; width?: string; height?: string;}} */
let {halign, valign, focus, width, height, ...props} = $props();

let states = $derived(({ 'halign': namedStateValue(halign, 'left'), 'valign': namedStateValue(valign, 'top'), 'focus': focus }));
let fallback = $derived(getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}],states));
let className = $derived(Object.entries(states).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' ').trim() || undefined);
const viewBox = {"width":22,"height":24};
const content = `<path class="ona74n u2mluk"/><path class="b6dtxa ona74n"/>`;
</script>
<Icon class={className} width={width} height={height} viewBox={viewBox} content={content} fallback={fallback} {...props}></Icon>
