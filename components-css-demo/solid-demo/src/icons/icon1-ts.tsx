import { Icon } from '@iconify/css-solid';
import { createMemo, splitProps } from 'solid-js';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/u2mluk.css';
import './css/ona74n.css';
import './css/b6dtxa.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

const viewBox = {"width":22,"height":24};
const content = `<path class="ona74n u2mluk"/><path class="b6dtxa ona74n"/>`;

interface Props {
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
};

function Component(props: Props) {
	const [local, others] = splitProps(props, ["halign","valign","focus","width","height"]);

	const states = createMemo(() => ({ 'halign': namedStateValue(local['halign'], 'left'), 'valign': namedStateValue(local['valign'], 'top'), 'focus': local['focus'] }));
	const fallback = createMemo(() => getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}],states()));
	const className = createMemo(() => Object.entries(states()).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' ').trim() || undefined);
	return (<Icon class={className()} width={local.width} height={local.height} viewBox={viewBox} content={content} fallback={fallback()} {...others} />);
}

export default Component;
