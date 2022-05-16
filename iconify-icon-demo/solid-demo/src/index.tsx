/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';

// Import web component to bundle it
import 'iconify-icon';

/*
// Import type for properties
import type { IconifyIconAttributes } from 'iconify-icon';

// Add 'iconify-icon' to known web components
declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'iconify-icon': JSX.IntrinsicElements['span'] &
				IconifyIconAttributes;
		}
	}
}
*/

// Do stuff
render(() => <App />, document.getElementById('root') as HTMLElement);
