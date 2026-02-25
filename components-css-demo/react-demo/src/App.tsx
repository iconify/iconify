import './App.css';
import { useEffect, useState } from 'react';
import type { IconifyIcon } from '@iconify/types';
import { type CSSIconComponentViewbox, Icon } from '@iconify/css-react';
import { Icon as BasicIcon } from '@iconify/css-react/basic';
import { loadIcon } from '@iconify/css-react/helpers/load-icon';
import TestIcon1 from './icons/icon1.js';
import TestIcon2 from './icons/icon2.js';

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

function AnimatedDemo() {
	const [restartCount, setRestartCount] = useState(0);
	function restartAnimations() {
		setRestartCount((count) => count + 1);
	}

	return (
		<div key={restartCount}>
			<div className="restart-animations">
				<button onClick={restartAnimations}>
					<Icon
						content={refreshIcon}
						viewBox={refreshViewbox}
						height="24"
						fallback=""
					/>
					Restart animations
				</button>
			</div>
			<div className="icons-list has-animations">
				Animated icons:
				<div>
					<Icon
						content={targetIcon}
						viewBox={grid24}
						height="24"
						fallback="tabler:current-location-filled"
					/>
					<Icon
						content={tablerUserIcon}
						viewBox={grid24}
						height="24"
						fallback="tabler:user"
					/>
					<Icon
						content={tablerUserFilledIcon}
						viewBox={grid24}
						height="24"
						fallback="tabler:user-filled"
					/>
				</div>
			</div>
		</div>
	);
}

function StatefulDemo() {
	const [hAlign, setHAlign] = useState<'left' | 'center' | 'right'>('left');
	const [vAlign, setVAlign] = useState<
		'top' | 'middle' | 'bottom' | 'stretch'
	>('top');
	const [action, setAction] = useState(false);

	function nextHAlign() {
		switch (hAlign) {
			case 'left':
				setHAlign('center');
				break;
			case 'center':
				setHAlign('right');
				break;
			case 'right':
				setHAlign('left');
				break;
		}
	}

	function nextVAlign() {
		switch (vAlign) {
			case 'top':
				setVAlign('middle');
				break;
			case 'middle':
				setVAlign('bottom');
				break;
			case 'bottom':
				setVAlign('stretch');
				break;
			case 'stretch':
				setVAlign('top');
				break;
		}
	}

	return (
		<div>
			<div className="icons-list svg-hover-anchor">
				Generated stateful icons:
				<div>
					<TestIcon1 height="24" halign={hAlign} valign={vAlign} />
					<TestIcon2 height="24" action={action} />
				</div>
			</div>
			<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
				<button onClick={() => nextHAlign()}>hAlign: {hAlign}</button>
				<button onClick={() => nextVAlign()}>vAlign: {vAlign}</button>
				<button onClick={() => setAction(!action)}>Toggle</button>
			</div>
		</div>
	);
}

function App() {
	const [iconData, setIconData] = useState<IconifyIcon | null>(null);

	useEffect(() => {
		loadIcon('material-symbols:mail-lock-outline-rounded')
			.then(setIconData)
			.catch(console.error);
	});

	return (
		<div className="App">
			<section>
				<h1>Demo for SVG+CSS</h1>
				<p>
					This browser <span className="status"></span> SVG+CSS
				</p>
				<p>
					Known browsers that do not support SVG+CSS: Safari 18.6
					(currently latest stable version)
				</p>
			</section>
			<section>
				<h1>Test icons</h1>
				<div className="icons-list">
					Home icon (+check for fallback):
					<div>
						<Icon
							content={tablerHomeIcon}
							viewBox={grid24}
							height="24"
							fallback="tabler:home-check"
						/>
					</div>
				</div>
				<div className="icons-list">
					Mail icons (locked for fallback):
					<div>
						<Icon
							content={msDrafts}
							viewBox={grid24}
							height="24"
							fallback="material-symbols:mail-lock-outline-rounded"
						/>
						<Icon
							content={msMail}
							viewBox={grid24}
							height="24"
							fallback="material-symbols:mail-lock-outline-rounded"
						/>
					</div>
				</div>
				<AnimatedDemo />
			</section>
			<section>
				<h1>
					No size set (container limited to 100x200 px,
					preserveAspectRatio aligns icon to bottom)
				</h1>
				<div
					style={{ width: '100px', height: '200px', display: 'flex' }}
				>
					<Icon
						content={tablerHomeIcon}
						viewBox={grid24}
						fallback="tabler:home-check"
						preserveAspectRatio="xMidYMax meet"
					/>
				</div>
			</section>
			<section>
				<h1>Testing various params</h1>
				<div className="icons-list">
					No fallback (should render icon in modern browser only), 2
					icons:
					<div>
						<Icon content={msDrafts} viewBox={grid24} height="24" />
						<BasicIcon
							content={msDrafts}
							viewBox={grid24}
							height="24"
						/>
					</div>
				</div>
				<div className="icons-list">
					Fallback only as string (used as Iconify Icon component):
					<div>
						<Icon
							viewBox={grid24}
							height="24"
							fallback="material-symbols:mail-lock-outline-rounded"
						/>
					</div>
				</div>
				{iconData && (
					<div className="icons-list">
						Fallback only as IconifyIcon (used as Iconify Icon
						component):
						<div>
							<Icon
								viewBox={grid24}
								height="24"
								fallback={iconData}
							/>
						</div>
					</div>
				)}
				<StatefulDemo />
			</section>
		</div>
	);
}

export default App;
