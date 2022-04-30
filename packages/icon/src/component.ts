import {
	getCustomisations,
	haveCustomisationsChanged,
	RenderedIconCustomisations,
} from './attributes/customisations';
import { parseIconValue } from './attributes/icon';
import type {
	CurrentIconData,
	RenderedCurrentIconData,
} from './attributes/icon/state';
import { getInline } from './attributes/inline';
import { getRenderMode } from './attributes/mode';
import type { IconifyIconAttributes } from './attributes/types';
import { exportFunctions, IconifyExportedFunctions } from './functions';
import { renderIcon } from './render/icon';
import { updateStyle } from './render/style';
import { IconState, setPendingState } from './state';

/**
 * Interface
 */
declare interface PartialIconifyIconHTMLElement extends HTMLElement {
	// Restart animation for animated icons
	restartAnimation: () => void;
}

// Add dynamically generated getters and setters
export declare interface IconifyIconHTMLElement
	extends PartialIconifyIconHTMLElement,
		// Functions added dynamically after class creation
		IconifyExportedFunctions,
		Required<IconifyIconAttributes> {}

/**
 * Constructor
 */
interface PartialIconifyIconHTMLElementClass {
	new (): PartialIconifyIconHTMLElement;
	prototype: PartialIconifyIconHTMLElement;
}

export interface IconifyIconHTMLElementClass
	// Functions added dynamically as static methods and methods on instance
	extends IconifyExportedFunctions {
	new (): IconifyIconHTMLElement;
	prototype: IconifyIconHTMLElement;
}

/**
 * Register 'iconify-icon' component, if it does not exist
 */
export function defineIconifyIcon(
	name = 'iconify-icon'
): IconifyIconHTMLElementClass | undefined {
	// Check for custom elements registry and HTMLElement
	let customElements: CustomElementRegistry;
	let ParentClass: typeof HTMLElement;
	try {
		customElements = window.customElements;
		ParentClass = window.HTMLElement;
	} catch {
		return;
	}

	// Make sure registry and HTMLElement exist
	if (!customElements || !ParentClass) {
		return;
	}

	// Check for duplicate
	const ConflictingClass = customElements.get(name);
	if (ConflictingClass) {
		return ConflictingClass as IconifyIconHTMLElementClass;
	}

	// All attributes
	const attributes: (keyof IconifyIconAttributes)[] = [
		// Icon
		'icon',
		// Mode
		'mode',
		'inline',
		// Customisations
		'width',
		'height',
		'rotate',
		'flip',
		'align',
	];

	/**
	 * Component class
	 */
	const IconifyIcon: PartialIconifyIconHTMLElementClass = class extends ParentClass {
		// Root
		_shadowRoot: ShadowRoot;

		// State
		_state: IconState;

		/**
		 * Constructor
		 */
		constructor() {
			super();

			// Attach shadow DOM
			const root = (this._shadowRoot = this.attachShadow({
				mode: 'closed',
			}));

			// Add style
			const inline = getInline(this);
			updateStyle(root, inline);

			// Create empty state
			const value = this.getAttribute('icon');
			this._state = setPendingState(
				{
					value,
				},
				inline
			);

			// Update icon
			this._iconChanged(value);
		}

		/**
		 * Observed attributes
		 */
		static get observedAttributes() {
			return attributes.slice(0);
		}

		/**
		 * Attribute has changed
		 */
		attributeChangedCallback(
			name: string,
			oldValue: unknown,
			newValue: unknown
		) {
			const state = this._state;
			switch (name as keyof IconifyIconAttributes) {
				case 'icon': {
					this._iconChanged(newValue);
					return;
				}

				case 'inline': {
					const newInline = !!newValue;
					if (newInline !== state.inline) {
						// Update style if inline mode changed
						state.inline = newInline;
						updateStyle(this._shadowRoot, newInline);
					}
					return;
				}

				case 'mode': {
					if (state.rendered) {
						// Re-render if icon is currently being renrered
						this._renderIcon(state.icon);
					}
					return;
				}

				default: {
					if (state.rendered) {
						// Check customisations only if icon has been rendered
						const newCustomisations = getCustomisations(this);
						if (
							haveCustomisationsChanged(
								newCustomisations,
								state.customisations
							)
						) {
							// Re-render
							this._renderIcon(state.icon, newCustomisations);
						}
					}
				}
			}
		}

		/**
		 * Get/set icon
		 */
		get icon() {
			const value = this.getAttribute('icon');
			if (value && value.slice(0, 1) === '{') {
				try {
					return JSON.parse(value);
				} catch {
					//
				}
			}
			return value;
		}

		set icon(value) {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			}
			this.setAttribute('icon', value);
		}

		/**
		 * Get/set inline
		 */
		get inline() {
			return getInline(this);
		}

		set inline(value) {
			this.setAttribute('inline', value ? 'true' : null);
		}

		/**
		 * Restart animation
		 */
		restartAnimation() {
			const state = this._state;
			if (state.rendered) {
				const root = this._shadowRoot;
				if (state.renderedMode === 'svg') {
					// Update root node
					try {
						(root.lastChild as SVGSVGElement).setCurrentTime(0);
						return;
					} catch {
						// Failed: setCurrentTime() is not supported
					}
				}
				renderIcon(root, state);
			}
		}

		/**
		 * Icon value has changed
		 */
		_iconChanged(newValue: unknown) {
			const icon = parseIconValue(newValue, (value, name, data) => {
				// Asynchronous callback: re-check values to make sure stuff wasn't changed
				const state = this._state;
				if (state.rendered || state.icon.value !== value) {
					// Icon data is already available or icon attribute was changed
					return;
				}

				// Change icon
				const icon: CurrentIconData = {
					value,
					name,
					data,
				};

				if (icon.data) {
					// Render icon
					this._renderIcon(icon as RenderedCurrentIconData);
				} else {
					// Nothing to render: update icon in state
					state.icon = icon;
				}
			});

			if (icon.data) {
				// Icon is ready to render
				this._renderIcon(icon as RenderedCurrentIconData);
			} else {
				// Pending icon
				this._state = setPendingState(
					icon,
					this._state.inline,
					this._state
				);
			}
		}

		/**
		 * Re-render based on icon data
		 */
		_renderIcon(
			icon: RenderedCurrentIconData,
			customisations?: RenderedIconCustomisations
		) {
			// Get mode
			const attrMode = this.getAttribute('mode');
			const renderedMode = getRenderMode(icon.data.body, attrMode);

			// Inline was not changed
			const inline = this._state.inline;

			// Set state and render
			renderIcon(
				this._shadowRoot,
				(this._state = {
					rendered: true,
					icon,
					inline,
					customisations: customisations || getCustomisations(this),
					attrMode,
					renderedMode,
				})
			);
		}
	};

	// Add getters and setters
	attributes.forEach((attr) => {
		if (!Object.hasOwn(IconifyIcon.prototype, attr)) {
			Object.defineProperty(IconifyIcon.prototype, attr, {
				get: function () {
					return this.getAttribute(attr);
				},
				set: function (value) {
					this.setAttribute(attr, value);
				},
			});
		}
	});

	// Add exported functions: both as static and instance methods
	const functions = exportFunctions();
	for (const key in functions) {
		IconifyIcon[key] = IconifyIcon.prototype[key] = functions[key];
	}

	// Define new component
	customElements.define(name, IconifyIcon);

	return IconifyIcon as IconifyIconHTMLElementClass;
}
