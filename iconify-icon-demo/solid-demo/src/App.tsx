import type { Component } from 'solid-js';
import {
	Icon,
	addIcon,
	addCollection,
	disableCache,
} from '@iconify-icon/solid';
import calendarIcon from '@iconify-icons/line-md/calendar';

import UsageAPI from './demo/UsageAPI';
import UsageOffline from './demo/UsageOffline';
import InlineDemo from './demo/Inline';

// Disable cache
disableCache('all');

// Add few custom icons
addIcon('demo', calendarIcon);
addIcon('experiment2', {
	width: 16,
	height: 16,
	body: '<g fill="none" stroke-linecap="round" stroke-width="1" stroke="currentColor"><circle cx="8" cy="8" r="7.5" stroke-dasharray="48" stroke-dashoffset="48"><animate id="circle" attributeName="stroke-dashoffset" values="48;0" dur="0.5s" fill="freeze" /></circle><path d="M8 5v3" stroke-width="2" stroke-dasharray="5" stroke-dashoffset="5"><animate attributeName="stroke-dashoffset" values="5;0" dur="0.3s" begin="circle.end+0.1s" fill="freeze" /></path></g><circle cx="8" cy="11" r="1" fill="currentColor" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.2s" begin="circle.end+0.5s" fill="freeze" /></circle>',
});

// Add mdi-light icons with custom prefix
addCollection({
	prefix: 'test',
	icons: {
		alert1: {
			body: '<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
		},
		link1: {
			body: '<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
		},
	},
	width: 24,
	height: 24,
});

const App: Component = () => {
	return (
		<>
			<UsageAPI />
			<UsageOffline />

			<InlineDemo />

			<section class="icon-24">
				<h1>Tests</h1>
				<p>Testing to make sure various attributes work...</p>
				<div>
					Rotation (same icon, 4 different directions):
					<Icon icon="line-md:arrow-left" />
					<Icon icon="line-md:arrow-left" rotate="1" />
					<Icon icon="line-md:arrow-left" rotate={2} />
					<Icon icon="line-md:arrow-left" rotate="270deg" />
				</div>
				<div>
					Flip (should be same as above):
					<Icon icon="line-md:arrow-left" />
					<Icon icon="line-md:arrow-up" />
					<Icon icon="line-md:arrow-left" flip="horizontal" />
					<Icon icon="line-md:arrow-up" flip="vertical" />
				</div>
				<div>
					Color:
					<Icon icon="demo" style="color: red;" />
				</div>
				<div>
					Big icons:
					<span style="font-size: 24px;">
						<Icon icon="demo" style="font-size: 2em" />
						<Icon icon="demo" height="48" />
						<Icon icon="demo" height={48} />
						<Icon icon="demo" height="2em" />
					</span>
				</div>
			</section>
		</>
	);
};

export default App;
