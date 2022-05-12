import { cleanupGlobals, setupDOM } from './helpers';
import { onReady } from '../src/helpers/ready';

describe('Testing onReady callback', () => {
	afterEach(cleanupGlobals);

	it('Testing onReady before DOM is loaded', (done) => {
		setupDOM('');
		expect(document.readyState).toBe('loading');
		onReady(() => {
			done();
		});
	});

	it('Testing onReady after DOM is loaded', (done) => {
		setupDOM('');
		expect(document.readyState).toBe('loading');
		document.addEventListener('DOMContentLoaded', () => {
			expect(document.readyState).toBe('interactive');
			onReady(() => {
				done();
			});
		});
	});
});
