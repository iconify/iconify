import { replaceIDs } from '../lib/svg/id';

describe('Testing replaceIDs', () => {
	test('Simple code', () => {
		const body =
			'<defs><path id="test1"></defs><use fill="#FFA000" xlink:href="#test1"/>';
		const expected =
			'<defs><path id="callback-0"></defs><use fill="#FFA000" xlink:href="#callback-0"/>';

		// Using callback
		let counter = 0;
		expect(replaceIDs(body, () => 'callback-' + counter++)).toBe(expected);
	});

	test('Many IDs', () => {
		const body =
			'<defs><path id="ssvg-id-1st-place-medala" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medald" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalf" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalh" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalj" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalm" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="ssvg-id-1st-place-medalp"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="ssvg-id-1st-place-medalb"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="ssvg-id-1st-place-medalk"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="ssvg-id-1st-place-medalo"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalc" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medala"/></mask><path fill="url(#ssvg-id-1st-place-medalb)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalc)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medale" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medald"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medale)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalg" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalf"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalg)"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medali" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalh"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medali)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medall" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalj"/></mask><path fill="url(#ssvg-id-1st-place-medalk)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medall)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medaln" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalm"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medaln)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#ssvg-id-1st-place-medalo)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#ssvg-id-1st-place-medalp"/><use fill="#FFA000" xlink:href="#ssvg-id-1st-place-medalp"/></g>';

		// Counter starts with 0, so first id is test-0
		expect(replaceIDs(body, 'test-')).toBe(
			'<defs><path id="test-0" d="M.93.01h120.55v58.36H.93z"/><path id="test-1" d="M.93.01h120.55v58.36H.93z"/><path id="test-2" d="M.93.01h120.55v58.36H.93z"/><path id="test-3" d="M.93.01h120.55v58.36H.93z"/><path id="test-4" d="M.93.01h120.55v58.36H.93z"/><path id="test-5" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="test-6"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="test-7"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="test-8"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="test-9"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="test-10" fill="#fff"><use xlink:href="#test-0"/></mask><path fill="url(#test-7)" fill-rule="nonzero" mask="url(#test-10)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="test-11" fill="#fff"><use xlink:href="#test-1"/></mask><g opacity=".2" mask="url(#test-11)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="test-12" fill="#fff"><use xlink:href="#test-2"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#test-12)"/></g><g transform="translate(3 4)"><mask id="test-13" fill="#fff"><use xlink:href="#test-3"/></mask><g opacity=".2" mask="url(#test-13)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="test-14" fill="#fff"><use xlink:href="#test-4"/></mask><path fill="url(#test-8)" fill-rule="nonzero" mask="url(#test-14)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="test-15" fill="#fff"><use xlink:href="#test-5"/></mask><g opacity=".2" mask="url(#test-15)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#test-9)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#test-6"/><use fill="#FFA000" xlink:href="#test-6"/></g>'
		);

		// Using callback
		let counter = 0;
		expect(replaceIDs(body, () => 'callback-' + counter++)).toBe(
			body
				.replace(/ssvg-id-1st-place-medala/g, 'callback-0')
				.replace(/ssvg-id-1st-place-medalb/g, 'callback-7')
				.replace(/ssvg-id-1st-place-medalc/g, 'callback-10')
				.replace(/ssvg-id-1st-place-medald/g, 'callback-1')
				.replace(/ssvg-id-1st-place-medale/g, 'callback-11')
				.replace(/ssvg-id-1st-place-medalf/g, 'callback-2')
				.replace(/ssvg-id-1st-place-medalg/g, 'callback-12')
				.replace(/ssvg-id-1st-place-medalh/g, 'callback-3')
				.replace(/ssvg-id-1st-place-medali/g, 'callback-13')
				.replace(/ssvg-id-1st-place-medalj/g, 'callback-4')
				.replace(/ssvg-id-1st-place-medalk/g, 'callback-8')
				.replace(/ssvg-id-1st-place-medall/g, 'callback-14')
				.replace(/ssvg-id-1st-place-medalm/g, 'callback-5')
				.replace(/ssvg-id-1st-place-medaln/g, 'callback-15')
				.replace(/ssvg-id-1st-place-medalo/g, 'callback-9')
				.replace(/ssvg-id-1st-place-medalp/g, 'callback-6')
		);
	});

	test('Matching parts', () => {
		let body =
			'<defs><path id="test1"><path id="test"></defs><use fill="#FFA000" xlink:href="#test1"/><use fill="#00f" xlink:href="#test"/>';
		const expected =
			'<defs><path id="callback-0"><path id="callback-1"></defs><use fill="#FFA000" xlink:href="#callback-0"/><use fill="#00f" xlink:href="#callback-1"/>';

		let counter = 0;
		expect(replaceIDs(body, () => 'callback-' + counter++)).toBe(expected);

		// Reverse order
		body =
			'<defs><path id="test"><path id="test1"></defs><use fill="#FFA000" xlink:href="#test"/><use fill="#00f" xlink:href="#test1"/>';

		counter = 1;
		expect(replaceIDs(body, () => 'callback-' + counter--)).toBe(expected);
	});

	test('With animation', () => {
		const body =
			'<path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" fill="currentColor"><animateTransform id="ssvg-id-compassb" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="0 12 12" dur="1s" begin="0;ssvg-id-compassa.end"/><animateTransform id="ssvg-id-compassc" attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="-90 12 12" dur="1s" begin="ssvg-id-compassb.end"/><animateTransform id="ssvg-id-compassa" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="270 12 12" dur="1s" begin="ssvg-id-compassc.end"/></path>';

		// To avoid messing up counter, using custom callback
		let counter = 0;
		expect(replaceIDs(body, () => 'callback-' + counter++)).toBe(
			body
				.replace(/ssvg-id-compassa/g, 'callback-2')
				.replace(/ssvg-id-compassb/g, 'callback-0')
				.replace(/ssvg-id-compassc/g, 'callback-1')
		);
	});

	test('Matching parts in attributes, tags and content', () => {
		// 'path' matches tag -> callback-0
		// 'M12' matches path value -> callback-1
		// 'd' matches attribute -> callback-2
		const body =
			'<path d="M12 10.9c1.1zM12 8.M12" fill="currentColor"><animateTransform id="d" attributeName="transform" begin="0;M12.end"/><animateTransform id="path" attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="-90 12 12" dur="1s" begin="d.end"/><animateTransform id="M12" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="270 12 12" dur="1s" begin="path.end"/></path>';
		const expected =
			'<path d="M12 10.9c1.1zM12 8.M12" fill="currentColor"><animateTransform id="callback-2" attributeName="transform" begin="0;callback-1.end"/><animateTransform id="callback-0" attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="-90 12 12" dur="1s" begin="callback-2.end"/><animateTransform id="callback-1" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="270 12 12" dur="1s" begin="callback-0.end"/></path>';

		// To avoid messing up counter, using custom callback
		let counter = 0;
		expect(replaceIDs(body, () => 'callback-' + counter++)).toBe(expected);
	});
});
