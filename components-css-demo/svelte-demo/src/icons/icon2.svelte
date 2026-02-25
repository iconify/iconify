<script>
import Icon from '@iconify/css-svelte';
import { getFallback } from './helpers/fallback-fi4iupre1o.js';

/** @type {{action?: boolean; focus?: boolean; width?: string; height?: string;}} */
let {action, focus, width, height, ...props} = $props();

let states = $derived(({ 'action': action, 'focus': focus }));
let fallback = $derived(getFallback(["animated-line-24:",{"state":"action","values":["remove","search-flipped"]}],states));
let className = $derived(Object.entries(states).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' '));
const viewBox = {"width":20,"height":24};
const content = `<defs><mask id="SVGx6mfIdMN"><path class="g_1xrq hk5z5e p10gmg"/><path class="g_1xrq hcv8fu objeeb"/></mask></defs><path mask="url(#SVGx6mfIdMN)" class="mbb8cl"/><path class="a8wtkc g_1xrq hcv8fu p10gmg"/>`;
</script>
<Icon class={className} width={width} height={height} viewBox={viewBox} content={content} fallback={fallback} {...props}></Icon>
<style>
:global(.a8wtkc) {
  stroke: var(--svg-primary-color, currentColor);
}

:global(.g_1xrq) {
  stroke-linecap: round;
  stroke-linejoin: round;
}

:global(.hcv8fu) {
  d: path('M10 12c0 0 -7 -7 -7 -7c0 0 7 7 7 7c0 0 7 7 7 7c0 0 -7 -7 -7 -7Z');
}

:global(.hk5z5e) {
  d: path('M17 5l-14 14');
  stroke: #fff;
}

:global(.mbb8cl) {
  fill: var(--svg-secondary-color, currentColor);
  d: path('M0 0h20v24H0z');
}

:global(.objeeb) {
  stroke-width: var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));
  fill: #000;
  stroke: #000;
}

:global(.p10gmg) {
  stroke-width: var(--svg-stroke-width, 1.5px);
  fill: none;
}

:global(.svg-focus-anchor:focus-within svg.state-action), :global(.svg-hover-anchor:hover svg.state-action), :global(svg.state-action.state-focus) {
  :global(.hcv8fu) {
    d: path('M8.26 13.74c-2.34 -2.34 -2.34 -6.14 0 -8.48c2.34 -2.35 6.14 -2.35 8.48 0c2.35 2.34 2.35 6.14 0 8.48c-2.34 2.35 -6.14 2.35 -8.48 0Z');
  }

  :global(.hk5z5e) {
    d: path('M9 14.4l-6 7.6');
  }
}

:global(.svg-focus-anchor:focus-within), :global(.svg-hover-anchor:hover), :global(svg.state-focus) {
  :global(.hcv8fu) {
    d: path('M10 12c0 0 -8 -8 -8 -8c0 0 8 8 8 8c0 0 8 8 8 8c0 0 -8 -8 -8 -8Z');
  }

  :global(.hk5z5e) {
    d: path('M18 4l-16 16');
  }
}

:global(svg.state-action) {
  :global(.hcv8fu) {
    d: path('M8.61 13.39c-2.15 -2.15 -2.15 -5.63 0 -7.78c2.15 -2.15 5.63 -2.15 7.78 0c2.15 2.15 2.15 5.63 0 7.78c-2.15 2.15 -5.63 2.15 -7.78 0Z');
  }

  :global(.hk5z5e) {
    d: path('M8.5 13.5l-6.5 6.5');
  }
}

@media not (prefers-reduced-motion) {
  :global(.hcv8fu) {
    transition: d 0.4s linear;
  }

  :global(.hk5z5e) {
    transition: d 0.4s linear;
  }
}

</style>
