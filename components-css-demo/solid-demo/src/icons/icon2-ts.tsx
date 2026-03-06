import { Icon } from '@iconify/css-solid';
import { createMemo, splitProps } from 'solid-js';
import { getFallback } from './helpers/fallback-fi4iupre1o.js';

const viewBox = {"width":20,"height":24};
const content = `<style>.a8wtkc {
  stroke: var(--svg-primary-color, currentColor);
}

.ae-3qn {
  d: path('M17 5l-14 14M17 19l0 0');
  stroke: #fff;
}

.g_1xrq {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mbb8cl {
  fill: var(--svg-secondary-color, currentColor);
  d: path('M0 0h20v24H0z');
}

.objeeb {
  stroke-width: var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));
  fill: #000;
  stroke: #000;
}

.p10gmg {
  stroke-width: var(--svg-stroke-width, 1.5px);
  fill: none;
}

.zs6nhs {
  d: path('M17 19c0 0 -7 -7 -7 -7c0 0 -7 -7 -7 -7c0 0 7 7 7 7c0 0 7 7 7 7Z');
}

button:focus-visible:not(:disabled) svg.state-action, button:hover:not(:disabled) svg.state-action, input:focus-visible:not(:disabled) svg.state-action, input:hover:not(:disabled) svg.state-action, svg.state-action.state-focus {
  .ae-3qn {
    d: path('M11 14.4l0 0M11 14.4l6 7.6');
  }

  .zs6nhs {
    d: path('M11.74 13.74c-2.34 2.35 -6.14 2.35 -8.48 0c-2.35 -2.34 -2.35 -6.14 0 -8.48c2.34 -2.35 6.14 -2.35 8.48 0c2.35 2.34 2.35 6.14 0 8.48Z');
  }
}

button:focus-visible:not(:disabled), button:hover:not(:disabled), input:focus-visible:not(:disabled), input:hover:not(:disabled), svg.state-focus {
  .ae-3qn {
    d: path('M18 4l-16 16M18 20l0 0');
  }

  .zs6nhs {
    d: path('M18 20c0 0 -8 -8 -8 -8c0 0 -8 -8 -8 -8c0 0 8 8 8 8c0 0 8 8 8 8Z');
  }
}

svg.state-action {
  .ae-3qn {
    d: path('M11.5 13.5l0 0M11.5 13.5l6.5 6.5');
  }

  .zs6nhs {
    d: path('M11.4 13.4c-2.16 2.14 -5.64 2.14 -7.79 -0.01c-2.15 -2.15 -2.15 -5.63 0 -7.78c2.15 -2.15 5.63 -2.15 7.78 0c2.15 2.15 2.15 5.63 0 7.78Z');
  }
}

@media not (prefers-reduced-motion) {
  .ae-3qn {
    transition: d 0.4s linear;
  }

  .zs6nhs {
    transition: d 0.4s linear;
  }
}
</style><defs><mask id="SVGRErrZbBT"><path class="ae-3qn g_1xrq p10gmg"/><path class="g_1xrq objeeb zs6nhs"/></mask></defs><path mask="url(#SVGRErrZbBT)" class="mbb8cl"/><path class="a8wtkc g_1xrq p10gmg zs6nhs"/>`;

interface Props {
	action?: boolean;
	focus?: boolean;
	width?: string;
	height?: string;
};

function Component(props: Props) {
	const [local, others] = splitProps(props, ["action","focus","width","height"]);

	const states = createMemo(() => ({ 'action': local['action'], 'focus': local['focus'] }));
	const fallback = createMemo(() => getFallback(["animated-line-24:",{"state":"action","values":["remove","search"]}],states()));
	const className = createMemo(() => Object.entries(states()).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' ').trim() || undefined);
	return (<Icon class={className()} width={local.width} height={local.height} viewBox={viewBox} content={content} fallback={fallback()} {...others} />);
}

export default Component;
