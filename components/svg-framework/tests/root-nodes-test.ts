import { resetState, setupDOM, wrapHTML } from './helpers';
import {
	listRootNodes,
	addBodyNode,
	addRootNode,
	removeRootNode,
} from '../src/observer/root';

describe('Testing root nodes', () => {
	afterEach(resetState);

	it('Testing body element', () => {
		setupDOM('');
		expect(document.readyState).toBe('loading');

		// Add body node
		addBodyNode();

		// List should have document.body
		expect(listRootNodes()).toEqual([
			{
				node: document.documentElement,
				temporary: false,
			},
		]);
	});

	it('Adding and removing nodes', () => {
		setupDOM(
			wrapHTML('<div id="root-test"></div><div id="root-test2"></div>')
		);
		expect(document.readyState).toBe('loading');

		// Get test nodes, make sure they exist
		const node1 = document.getElementById('root-test');
		expect(node1.tagName).toBe('DIV');
		expect(node1.getAttribute('id')).toBe('root-test');

		const node2 = document.getElementById('root-test2');
		expect(node2.tagName).toBe('DIV');
		expect(node2.getAttribute('id')).toBe('root-test2');

		// Add body node and temporary nodes
		addBodyNode();
		addRootNode(node1);
		addRootNode(node2, true);

		// List nodes
		expect(listRootNodes()).toEqual([
			{
				node: document.documentElement,
				temporary: false,
			},
			{
				node: node1,
				temporary: false,
			},
			{
				node: node2,
				temporary: true,
			},
		]);

		// Switch type for node2
		addRootNode(node2);
		expect(listRootNodes()).toEqual([
			{
				node: document.documentElement,
				temporary: false,
			},
			{
				node: node1,
				temporary: false,
			},
			{
				node: node2,
				temporary: false,
			},
		]);

		// Remove node2
		removeRootNode(node2);
		expect(listRootNodes()).toEqual([
			{
				node: document.documentElement,
				temporary: false,
			},
			{
				node: node1,
				temporary: false,
			},
		]);

		// Add duplicate node1
		addRootNode(node1, true);
		expect(listRootNodes()).toEqual([
			{
				node: document.documentElement,
				temporary: false,
			},
			{
				node: node1,
				temporary: false,
			},
		]);
	});
});
