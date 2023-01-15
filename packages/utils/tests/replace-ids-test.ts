import { replaceIDs } from '../lib/svg/id';

describe('Testing replaceIDs', () => {
	test('Simple code', () => {
		const body =
			'<defs><path id="test1"></defs><use fill="#FFA000" xlink:href="#test1"/>';
		const expected =
			'<defs><path id="callback0"></defs><use fill="#FFA000" xlink:href="#callback0"/>';

		// Using callback
		let counter = 0;
		expect(
			replaceIDs(body, () => 'callback' + (counter++).toString())
		).toBe(expected);
	});

	test('Many IDs', () => {
		const body =
			'<defs><path id="ssvg-id-1st-place-medala" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medald" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalf" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalh" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalj" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalm" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="ssvg-id-1st-place-medalp"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="ssvg-id-1st-place-medalb"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="ssvg-id-1st-place-medalk"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="ssvg-id-1st-place-medalo"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalc" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medala"/></mask><path fill="url(#ssvg-id-1st-place-medalb)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalc)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medale" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medald"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medale)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalg" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalf"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalg)"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medali" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalh"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medali)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medall" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalj"/></mask><path fill="url(#ssvg-id-1st-place-medalk)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medall)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medaln" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalm"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medaln)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#ssvg-id-1st-place-medalo)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#ssvg-id-1st-place-medalp"/><use fill="#FFA000" xlink:href="#ssvg-id-1st-place-medalp"/></g>';

		// Counter starts with 0, so first id is testID0
		expect(replaceIDs(body, 'testID')).toBe(
			'<defs><path id="testID0" d="M.93.01h120.55v58.36H.93z"/><path id="testID1" d="M.93.01h120.55v58.36H.93z"/><path id="testID2" d="M.93.01h120.55v58.36H.93z"/><path id="testID3" d="M.93.01h120.55v58.36H.93z"/><path id="testID4" d="M.93.01h120.55v58.36H.93z"/><path id="testID5" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="testID6"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="testID7"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="testID8"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="testID9"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="testID10" fill="#fff"><use xlink:href="#testID0"/></mask><path fill="url(#testID7)" fill-rule="nonzero" mask="url(#testID10)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="testID11" fill="#fff"><use xlink:href="#testID1"/></mask><g opacity=".2" mask="url(#testID11)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="testID12" fill="#fff"><use xlink:href="#testID2"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#testID12)"/></g><g transform="translate(3 4)"><mask id="testID13" fill="#fff"><use xlink:href="#testID3"/></mask><g opacity=".2" mask="url(#testID13)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="testID14" fill="#fff"><use xlink:href="#testID4"/></mask><path fill="url(#testID8)" fill-rule="nonzero" mask="url(#testID14)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="testID15" fill="#fff"><use xlink:href="#testID5"/></mask><g opacity=".2" mask="url(#testID15)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#testID9)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#testID6"/><use fill="#FFA000" xlink:href="#testID6"/></g>'
		);

		// Using callback
		let counter = 0;
		const replaced = replaceIDs(
			body,
			() => 'callbackID' + (counter++).toString()
		);

		expect(replaced).toBe(
			body
				.replace(/ssvg-id-1st-place-medala/g, 'callbackID0')
				.replace(/ssvg-id-1st-place-medalb/g, 'callbackID7')
				.replace(/ssvg-id-1st-place-medalc/g, 'callbackID10')
				.replace(/ssvg-id-1st-place-medald/g, 'callbackID1')
				.replace(/ssvg-id-1st-place-medale/g, 'callbackID11')
				.replace(/ssvg-id-1st-place-medalf/g, 'callbackID2')
				.replace(/ssvg-id-1st-place-medalg/g, 'callbackID12')
				.replace(/ssvg-id-1st-place-medalh/g, 'callbackID3')
				.replace(/ssvg-id-1st-place-medali/g, 'callbackID13')
				.replace(/ssvg-id-1st-place-medalj/g, 'callbackID4')
				.replace(/ssvg-id-1st-place-medalk/g, 'callbackID8')
				.replace(/ssvg-id-1st-place-medall/g, 'callbackID14')
				.replace(/ssvg-id-1st-place-medalm/g, 'callbackID5')
				.replace(/ssvg-id-1st-place-medaln/g, 'callbackID15')
				.replace(/ssvg-id-1st-place-medalo/g, 'callbackID9')
				.replace(/ssvg-id-1st-place-medalp/g, 'callbackID6')
		);

		// Replacing it again to test double replacement with overlapping numbers
		counter = 10;
		expect(
			replaceIDs(replaced, () => 'callbackID' + (counter++).toString())
		).toBe(
			body
				.replace(/ssvg-id-1st-place-medala/g, 'callbackID10')
				.replace(/ssvg-id-1st-place-medalb/g, 'callbackID17')
				.replace(/ssvg-id-1st-place-medalc/g, 'callbackID20')
				.replace(/ssvg-id-1st-place-medald/g, 'callbackID11')
				.replace(/ssvg-id-1st-place-medale/g, 'callbackID21')
				.replace(/ssvg-id-1st-place-medalf/g, 'callbackID12')
				.replace(/ssvg-id-1st-place-medalg/g, 'callbackID22')
				.replace(/ssvg-id-1st-place-medalh/g, 'callbackID13')
				.replace(/ssvg-id-1st-place-medali/g, 'callbackID23')
				.replace(/ssvg-id-1st-place-medalj/g, 'callbackID14')
				.replace(/ssvg-id-1st-place-medalk/g, 'callbackID18')
				.replace(/ssvg-id-1st-place-medall/g, 'callbackID24')
				.replace(/ssvg-id-1st-place-medalm/g, 'callbackID15')
				.replace(/ssvg-id-1st-place-medaln/g, 'callbackID25')
				.replace(/ssvg-id-1st-place-medalo/g, 'callbackID19')
				.replace(/ssvg-id-1st-place-medalp/g, 'callbackID16')
		);
	});

	test('Matching parts', () => {
		const body =
			'<defs><path id="test1"><path id="test"></defs><use fill="#FFA000" xlink:href="#test1"/><use fill="#00f" xlink:href="#test"/>';
		const expected =
			'<defs><path id="callbackID0"><path id="callbackID1"></defs><use fill="#FFA000" xlink:href="#callbackID0"/><use fill="#00f" xlink:href="#callbackID1"/>';

		expect(
			replaceIDs(body, (id: string) => {
				switch (id) {
					case 'test1':
						return 'callbackID0';
					case 'test':
						return 'callbackID1';
					default:
						throw new Error(`Unexpected id "${id}""`);
				}
			})
		).toBe(expected);
	});

	test('With animation', () => {
		const body =
			'<path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" fill="currentColor"><animateTransform id="ssvg-id-compassb" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="0 12 12" dur="1s" begin="0;ssvg-id-compassa.end"/><animateTransform id="ssvg-id-compassc" attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="-90 12 12" dur="1s" begin="ssvg-id-compassb.end"/><animateTransform id="ssvg-id-compassa" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="270 12 12" dur="1s" begin="ssvg-id-compassc.end"/></path>';

		// To avoid messing up counter, using custom callback
		let counter = 0;
		expect(
			replaceIDs(body, () => 'callbackID' + (counter++).toString())
		).toBe(
			body
				.replace(/ssvg-id-compassa/g, 'callbackID2')
				.replace(/ssvg-id-compassb/g, 'callbackID0')
				.replace(/ssvg-id-compassc/g, 'callbackID1')
		);
	});

	test('Animation with calculations', () => {
		const body =
			'<rect x="2" y="2" width="20" height="10" fill="currentColor"><animate id="animation1" attributeName="height" values="10;5" dur="0.5s" fill="freeze" /><animate id="animation2" attributeName="width" values="20;5" dur="0.2s" begin="animation1.end+1s" fill="freeze" /></rect><rect x="2" y="12" width="20" height="5" fill="currentColor"><animate attributeName="height" values="5;10;5" begin="animation1.end+0.2s;animation2.end-0.2s" dur="0.3s" /></rect>';

		expect(
			replaceIDs(body, (id) => id.replace('animation', 'callback'))
		).toBe(body.replace(/animation/g, 'callback'));
	});

	test('Matching parts in attributes, tags and content', () => {
		// 'path' matches tag -> callbackID0
		// 'M12' matches path value -> callbackID1
		// 'd' matches attribute -> callbackID2
		const body =
			'<path d="M12 10.9c1.1zM12 8.M12" fill="currentColor"><animateTransform id="d" attributeName="transform" begin="0;M12.end"/><animateTransform id="path" attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="-90 12 12" dur="1s" begin="d.end"/><animateTransform id="M12" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="270 12 12" dur="1s" begin="path.end"/></path>';
		const expected =
			'<path d="M12 10.9c1.1zM12 8.M12" fill="currentColor"><animateTransform id="callbackID2" attributeName="transform" begin="0;callbackID1.end"/><animateTransform id="callbackID0" attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="-90 12 12" dur="1s" begin="callbackID2.end"/><animateTransform id="callbackID1" attributeName="transform" attributeType="XML" type="rotate" from="-90 12 12" to="270 12 12" dur="1s" begin="callbackID0.end"/></path>';

		// Using custom callback for reliable results
		expect(
			replaceIDs(body, (id: string) => {
				switch (id) {
					case 'path':
						return 'callbackID0';
					case 'M12':
						return 'callbackID1';
					case 'd':
						return 'callbackID2';

					default:
						throw new Error(`Unexpected id: ${id}`);
				}
			})
		).toBe(expected);
	});

	test('Replacing complex animation', () => {
		const svg =
			'<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" opacity="0"><animate id="spinner_jbAr" begin="0;spinner_8ff3.end+0.2s" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate id="spinner_8ff3" begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path><path d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" opacity="0"><animate id="spinner_dof4" begin="spinner_jbAr.end" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path><path d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3" opacity="0"><animate id="spinner_aTlH" begin="spinner_dof4.end" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path></svg>';
		const replaced = replaceIDs(svg);
		expect(replaced.indexOf('spinner_')).toBe(-1);
	});
});
