import { Icon } from '@iconify/css-react';
import { createElement, useMemo } from 'react';
import { getFallback } from './helpers/fallback-fi4iupre1o.js';

const viewBox = {"width":20,"height":24};

function Component({action, focus, width, height, ...props}) {
	const states = useMemo(() => ({ 'action': action, 'focus': focus }), [action, focus]);
	const fallback = useMemo(() => getFallback(["animated-line-24:",{"state":"action","values":["remove","search-flipped"]}], states), [states]);
	const className = useMemo(() => Object.entries(states).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' '), [states]);
	return createElement(Icon, {
		...props,
		className,
		width,
		height,
		viewBox,
		"content": `<style>.a8wtkc {
  stroke: var(--svg-primary-color, currentColor);
}

.g_1xrq {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hcv8fu {
  d: path('M10 12c0 0 -7 -7 -7 -7c0 0 7 7 7 7c0 0 7 7 7 7c0 0 -7 -7 -7 -7Z');
}

.hk5z5e {
  d: path('M17 5l-14 14');
  stroke: #fff;
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

.svg-focus-anchor:focus-within svg.state-action, .svg-hover-anchor:hover svg.state-action, svg.state-action.state-focus {
  .hcv8fu {
    d: path('M8.26 13.74c-2.34 -2.34 -2.34 -6.14 0 -8.48c2.34 -2.35 6.14 -2.35 8.48 0c2.35 2.34 2.35 6.14 0 8.48c-2.34 2.35 -6.14 2.35 -8.48 0Z');
  }

  .hk5z5e {
    d: path('M9 14.4l-6 7.6');
  }
}

.svg-focus-anchor:focus-within, .svg-hover-anchor:hover, svg.state-focus {
  .hcv8fu {
    d: path('M10 12c0 0 -8 -8 -8 -8c0 0 8 8 8 8c0 0 8 8 8 8c0 0 -8 -8 -8 -8Z');
  }

  .hk5z5e {
    d: path('M18 4l-16 16');
  }
}

svg.state-action {
  .hcv8fu {
    d: path('M8.61 13.39c-2.15 -2.15 -2.15 -5.63 0 -7.78c2.15 -2.15 5.63 -2.15 7.78 0c2.15 2.15 2.15 5.63 0 7.78c-2.15 2.15 -5.63 2.15 -7.78 0Z');
  }

  .hk5z5e {
    d: path('M8.5 13.5l-6.5 6.5');
  }
}

@media not (prefers-reduced-motion) {
  .hcv8fu {
    transition: d 0.4s linear;
  }

  .hk5z5e {
    transition: d 0.4s linear;
  }
}
</style><defs><mask id="SVGx6mfIdMN"><path class="g_1xrq hk5z5e p10gmg"/><path class="g_1xrq hcv8fu objeeb"/></mask></defs><path mask="url(#SVGx6mfIdMN)" class="mbb8cl"/><path class="a8wtkc g_1xrq hcv8fu p10gmg"/>`,
		fallback,
	});
}

export default Component;
