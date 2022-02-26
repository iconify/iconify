import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

// Core
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { stringToIcon } from '@iconify/utils/lib/icon/name';
import { getIconData } from '@iconify/core/lib/storage/functions';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { fullIcon } from '@iconify/utils/lib/icon';

// API
import { loadIcon } from '@iconify/core/lib/api/icons';

// Component stuff
import type { IconifyIconProps } from './props';
import type { RenderResult } from './render';
import { render } from './render';

/**
 * Type for loading status
 */
interface CurrentIconData {
	name: string;
	className: string;

	// Data if icon has been loaded
	data?: FullIconifyIcon;
}

/**
 * Empty icon
 */
const emptyIcon: RenderResult = {
	width: 16,
	height: 16,
	preserveAspectRatio: 'xMidYMid meet',
	viewBox: '0 0 16 16',
	className: '',
	body: '',
};

/**
 * Component
 */
export class IconifyIconComponent extends Component<IconifyIconProps> {
	// Dummy variable to force re-render
	@tracked _counter = 0;

	// Currently visible icon data, null if rendering object
	_icon: CurrentIconData | null = null;

	/**
	 * Render
	 */
	get data(): RenderResult {
		// Mention _counter to re-render
		this._counter;

		// Check icon
		const icon = this.args.icon;

		// Object
		if (
			typeof icon === 'object' &&
			icon !== null &&
			typeof icon.body === 'string'
		) {
			// Reset current icon
			this._icon = null;

			// Render object
			return render(fullIcon(icon), this.args, '');
		}

		// Already loaded
		if (this._icon) {
			const loaded = this._icon;
			if (loaded.name === icon && loaded.data) {
				return render(loaded.data, this.args, loaded.className);
			}
		}

		// Invalid icon?
		let iconName: IconifyIconName | null;
		if (
			typeof icon !== 'string' ||
			(iconName = stringToIcon(icon, false, true)) === null
		) {
			// Reset current icon, return empty icon
			this._icon = null;
			return emptyIcon;
		}

		// Get class name
		let className = 'iconify';
		if (iconName.prefix !== '') {
			className += ' iconify--' + iconName.prefix;
		}
		if (iconName.provider !== '') {
			className += ' iconify--' + iconName.provider;
		}

		// Load icon
		const data = getIconData(iconName);
		if (!data) {
			// Icon needs to be loaded
			if (!this._icon || this._icon.name !== icon) {
				// New icon to load
				this._icon = {
					name: icon,
					className,
				};

				loadIcon(iconName)
					.then((data) => {
						if (!this.isDestroyed && this._icon?.name === icon) {
							// Loaded
							this._icon = {
								name: icon,
								className,
								data,
							};
							this._counter++;

							if (this.args.onLoad) {
								this.args.onLoad(icon);
							}
						}
					})
					.catch(() => {
						// Failed to load icon
					});
			}
		} else {
			// Got icon data
			this._icon = {
				name: icon,
				className,
				data,
			};
			return render(data, this.args, className);
		}

		return emptyIcon;
	}
}
