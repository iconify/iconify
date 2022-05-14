import { describe, test, expect } from 'vitest';
import React from 'react';
import { Icon } from '../dist/iconify';
import { create } from 'react-test-renderer';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Testing references', () => {
	test('basic icon reference', () => {
		let gotRef = false;
		const component = create(
			<Icon
				icon={iconData}
				ref={() => {
					gotRef = true;
				}}
			/>
		);

		// Ref should have been called by now
		expect(gotRef).toEqual(true);
	});
});
