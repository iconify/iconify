import { appendCustomStyle, updateStyle } from '../src/render/style';
import {
	cleanupGlobals,
	expectedBlock,
	expectedInline,
	setupDOM,
	styleOpeningTag,
} from '../src/tests/helpers';

/**
 * Minimal stand-in for a ShadowRoot that supports adoptedStyleSheets.
 *
 * JSDOM implements CSSStyleSheet and replaceSync(), but not adoptedStyleSheets,
 * so the adopted path has to be exercised with a fake parent.
 */
function createAdoptingParent() {
	const doc = document;
	const node = doc.createElement('div') as HTMLDivElement & {
		adoptedStyleSheets: CSSStyleSheet[];
	};
	node.adoptedStyleSheets = [];
	return node;
}

function ruleTexts(sheet: CSSStyleSheet): string[] {
	return Array.from(sheet.cssRules).map((rule) => rule.cssText);
}

describe('Testing rendering style', () => {
	beforeEach(() => {
		const dom = setupDOM('');
		(global as unknown as Record<string, unknown>).CSSStyleSheet =
			dom.window.CSSStyleSheet;
	});

	afterEach(() => {
		appendCustomStyle('');
		delete (global as unknown as Record<string, unknown>).CSSStyleSheet;
		cleanupGlobals();
	});

	it('updateStyle falls back to <style> node without adoptedStyleSheets', () => {
		// Create container node
		const node = document.createElement('div');

		// Add style to empty parent
		updateStyle(node, false);
		expect(node.innerHTML).toBe(styleOpeningTag + expectedBlock + '</style>');

		// Change inline mode
		updateStyle(node, true);
		expect(node.innerHTML).toBe(styleOpeningTag + expectedInline + '</style>');

		// Do not change anything
		updateStyle(node, true);
		expect(node.innerHTML).toBe(styleOpeningTag + expectedInline + '</style>');

		// Change to block
		updateStyle(node, false);
		expect(node.innerHTML).toBe(styleOpeningTag + expectedBlock + '</style>');
	});

	it('updateStyle shares one constructed sheet between parents', () => {
		const first = createAdoptingParent();
		const second = createAdoptingParent();

		updateStyle(first, false);
		updateStyle(second, false);

		// No <style> node is created
		expect(first.innerHTML).toBe('');
		expect(second.innerHTML).toBe('');

		// Same sheet instance is adopted by both
		expect(first.adoptedStyleSheets.length).toBe(1);
		expect(second.adoptedStyleSheets.length).toBe(1);
		expect(first.adoptedStyleSheets[0]).toBe(second.adoptedStyleSheets[0]);

		// Content matches block style
		const rules = ruleTexts(first.adoptedStyleSheets[0]);
		expect(rules.length).toBe(2);
		expect(rules[0]).toContain('display: inline-block');
		expect(rules[0]).toContain('vertical-align: 0');
		expect(rules[1]).toContain('display: block');
	});

	it('updateStyle swaps inline and block sheets without duplicates', () => {
		const node = createAdoptingParent();

		// Sheet adopted by the consumer must survive
		const consumerSheet = new CSSStyleSheet();
		consumerSheet.replaceSync('svg{color:red}');
		node.adoptedStyleSheets = [consumerSheet];

		updateStyle(node, false);
		expect(node.adoptedStyleSheets.length).toBe(2);
		const blockSheet = node.adoptedStyleSheets[1];
		expect(ruleTexts(blockSheet)[0]).toContain('vertical-align: 0');

		// Change to inline: block sheet is replaced, not appended
		updateStyle(node, true);
		expect(node.adoptedStyleSheets.length).toBe(2);
		expect(node.adoptedStyleSheets[0]).toBe(consumerSheet);
		const inlineSheet = node.adoptedStyleSheets[1];
		expect(inlineSheet).not.toBe(blockSheet);
		expect(ruleTexts(inlineSheet)[0]).toContain('vertical-align: -0.125em');

		// Do not change anything
		updateStyle(node, true);
		expect(node.adoptedStyleSheets.length).toBe(2);
		expect(node.adoptedStyleSheets[1]).toBe(inlineSheet);

		// Back to block: original block sheet instance is reused
		updateStyle(node, false);
		expect(node.adoptedStyleSheets.length).toBe(2);
		expect(node.adoptedStyleSheets[1]).toBe(blockSheet);
	});

	it('appendCustomStyle updates shared sheets and new style nodes', () => {
		const adopting = createAdoptingParent();
		updateStyle(adopting, false);
		const sheet = adopting.adoptedStyleSheets[0];
		expect(ruleTexts(sheet).length).toBe(2);

		appendCustomStyle('svg{fill:currentColor}');

		// Already adopted sheet is updated in place
		expect(ruleTexts(sheet).length).toBe(3);
		expect(ruleTexts(sheet)[2]).toContain('fill: currentcolor');

		// Fallback path includes custom style in node content
		const legacy = document.createElement('div');
		updateStyle(legacy, true);
		expect(legacy.innerHTML).toBe(
			styleOpeningTag + expectedInline + 'svg{fill:currentColor}</style>'
		);
	});
});
