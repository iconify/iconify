import {
	getCustomisations,
	haveCustomisationsChanged,
	defaultCustomisations,
} from '../src/attributes/customisations';
import { getInline } from '../src/attributes/inline';
import { cleanupGlobals, setupDOM } from './helpers';

describe('Testing customisations', () => {
	afterEach(cleanupGlobals);

	it('Get and compare customisations', () => {
		// Setup DOM
		const doc = setupDOM('').window.document;

		// Create node, test default values
		const node = doc.createElement('div');
		const emptyCustomisations = getCustomisations(node);
		expect(emptyCustomisations).toEqual(defaultCustomisations);
		expect(getInline(node)).toBe(false);
		expect(
			haveCustomisationsChanged(
				emptyCustomisations,
				defaultCustomisations
			)
		).toBe(false);

		// Test inline and height
		node.innerHTML = '<span inline="true" height="1em"></span>';
		let testNode = node.lastChild as HTMLSpanElement;

		const test1 = getCustomisations(testNode);
		expect(test1).toEqual({
			...defaultCustomisations,
			height: '1em',
		});
		expect(haveCustomisationsChanged(emptyCustomisations, test1)).toBe(
			true
		);
		expect(getInline(testNode)).toBe(true);

		// Test transformations
		node.innerHTML = '<span flip="horizontal" rotate="2"></span>';
		testNode = node.lastChild as HTMLSpanElement;

		const test2 = getCustomisations(testNode);
		expect(test2).toEqual({
			...defaultCustomisations,
			hFlip: true,
			rotate: 2,
		});
		expect(haveCustomisationsChanged(emptyCustomisations, test2)).toBe(
			true
		);
		expect(haveCustomisationsChanged(test1, test2)).toBe(true);
		expect(getInline(testNode)).toBe(false);

		// Dimensions and alignment. Empty value
		node.innerHTML =
			'<span align="left top" width="auto" height=""></span>';
		testNode = node.lastChild as HTMLSpanElement;

		const test3 = getCustomisations(testNode);
		expect(test3).toEqual({
			...defaultCustomisations,
			hAlign: 'left',
			vAlign: 'top',
			width: 'auto',
		});
		expect(haveCustomisationsChanged(test3, test2)).toBe(true);
		expect(haveCustomisationsChanged(test1, test3)).toBe(true);
		expect(getInline(testNode)).toBe(false);
	});
});
