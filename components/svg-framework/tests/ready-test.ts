import { cleanupGlobals, setupDOM } from './helpers';
import { onReady } from '../src/helpers/ready';

describe('Testing onReady callback', () => {
	afterEach(cleanupGlobals);

	it('Testing onReady before DOM is loaded', () => {
		return new Promise((fulfill) => {
			setupDOM('');
			expect(document.readyState).toBe('loading');
			onReady(() => {
				fulfill(true);
			});
		});
	});

	it('Testing onReady after DOM is loaded', () => {
		return new Promise((fulfill) => {
			setupDOM('');
			expect(document.readyState).toBe('loading');
			document.addEventListener('DOMContentLoaded', () => {
				expect(document.readyState).toBe('interactive');
				onReady(() => {
					fulfill(true);
				});
			});
		});
	});
});
