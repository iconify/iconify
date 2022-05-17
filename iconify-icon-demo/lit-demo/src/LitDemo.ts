import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

import { addIcon, addCollection, disableCache } from 'iconify-icon';
import calendarIcon from '@iconify-icons/line-md/calendar';

import accountIcon from '@iconify-icons/line-md/account';
import alertIcon from '@iconify-icons/line-md/alert';

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

export class LitDemo extends LitElement {
	@property({ type: String }) title = 'IconifyIcon Demo';

	static styles = css`
		:host {
			font-family: Helvetica, Arial, sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			text-align: left;
			color: #2c3e50;
			font-size: 16px;
			line-height: 1.5;
		}

		/* Sections */
		section {
			border-bottom: 1px dotted #ccc;
			padding: 16px;
		}
		section:last-child {
			border-bottom-width: 0;
		}
		section:after {
			content: ' ';
			display: table;
			clear: both;
		}
		h1,
		h2 {
			margin: 0 0 16px;
			padding: 0;
			font-size: 24px;
			font-weight: normal;
		}
		h2 {
			margin: 16px 0;
			font-size: 20px;
		}
		h1 + h2 {
			margin-top: -8px;
		}
		p {
			margin: 12px 0 4px;
			padding: 0;
		}

		/* Tests */
		.test-row {
			font-size: 16px;
			line-height: 1.5;
		}
		.test-row-icons {
			padding-right: 4px;
		}
		.test-row-icons > iconify-icon {
			color: #afafaf;
			display: none;
		}
		.test-row-icons > iconify-icon.hidden {
			display: none !important;
		}
		.test-row-icons > iconify-icon.visible {
			display: inline-block;
		}
		.test-row-icons > iconify-icon.success {
			color: #327335;
		}
		.test-row-icons > iconify-icon.failed {
			color: #ba3329;
		}

		/* 24px icon */
		.icon-24 iconify-icon {
			font-size: 24px;
			line-height: 1;
			vertical-align: -0.25em;
		}

		/* Alert demo */
		.alert {
			position: relative;
			margin: 8px;
			padding: 16px;
			padding-left: 48px;
			background: #ba3329;
			color: #fff;
			border-radius: 5px;
			float: left;
		}

		.alert + div {
			clear: both;
		}

		.alert iconify-icon {
			position: absolute;
			left: 12px;
			top: 50%;
			font-size: 24px;
			line-height: 1em;
			margin: -0.5em 0 0;
		}

		/* Checkbox component */
		.checkbox-container {
			margin: 8px 0;
		}

		.checkbox {
			cursor: pointer;
			/* color: #1769aa; */
			color: #626262;
			text-decoration: none;
		}
		.checkbox:hover {
			color: #ba3329;
			text-decoration: underline;
		}

		.checkbox iconify-icon {
			margin-right: 4px;
			color: #afafaf;
			font-size: 24px;
			line-height: 1em;
			vertical-align: -0.25em;
		}
		.checkbox--checked iconify-icon {
			color: #327335;
		}
		.checkbox:hover iconify-icon {
			color: inherit;
		}

		.checkbox-container small {
			margin-left: 4px;
			opacity: 0.7;
		}

		/* Inline demo */
		.inline-demo iconify-icon {
			color: #06a;
			margin: 0 8px;
			position: relative;
			z-index: 2;
			box-shadow: 0 0 0 2px rgba(255, 128, 0, 0.5) inset;
		}
		.inline-demo div {
			position: relative;
			font-size: 16px;
			line-height: 1.5;
		}
		.inline-demo div:before,
		.inline-demo div:after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			height: 0;
			border-top: 1px dashed #506874;
			opacity: 0.5;
		}
		.inline-demo div:before {
			bottom: 5px;
		}
		.inline-demo div:after {
			bottom: 7px;
			border-top-color: #ba3329;
		}
	`;

	render() {
		return html`
			<section class="icon-24">
				<h1>Usage (full module)</h1>
				<div>
					Icons referenced by name (as SVG, as SPAN):
					<iconify-icon icon="mdi:home"></iconify-icon>
					<iconify-icon icon="mdi:home" mode="style"></iconify-icon>
				</div>
				<div class="alert">
					<iconify-icon icon="mdi-light:alert"></iconify-icon>
					Important notice with alert icon!
				</div>
			</section>

			<section class="icon-24">
				<h1>Usage (offline mode: using preloaded icons)</h1>
				<div>
					Icons referenced by name (as SVG, as SPAN):
					<iconify-icon icon="demo"></iconify-icon>
					<iconify-icon icon="demo" mode="style"></iconify-icon>
				</div>
				<div>
					Icons referenced by stringified object (as SVG, as SPAN):
					<iconify-icon icon="${JSON.stringify(accountIcon)}"></iconify-icon>
					<iconify-icon
						icon="${JSON.stringify(accountIcon)}"
						mode="style"
					></iconify-icon>
				</div>
				<div>
					2 icons imported from icon set:
					<iconify-icon icon="test:alert1"></iconify-icon>
					<iconify-icon icon="test:link1" mode="style"></iconify-icon>
				</div>
				<div class="alert">
					<iconify-icon
						icon="${JSON.stringify(alertIcon)}"
						mode="mask"
					></iconify-icon>
					Important notice with alert icon!
				</div>
			</section>

			<section class="inline-demo">
				<h1>Inline demo</h1>
				<div>
					Block icon (behaving like image):
					<iconify-icon icon="experiment2"></iconify-icon>
					<iconify-icon
						icon="experiment2"
						inline
						style="vertical-align: 0;"
					></iconify-icon>
				</div>
				<div>
					Inline icon (behaving line text / icon font):
					<iconify-icon icon="experiment2" inline></iconify-icon>
					<iconify-icon
						icon="experiment2"
						style="vertical-align: -0.125em;"
					></iconify-icon>
				</div>
			</section>
		`;
	}
}
