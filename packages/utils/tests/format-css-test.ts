import { formatCSS } from '../lib/css/format';

describe('Testing formatCSS', () => {
	test('Various modes', () => {
		expect(
			formatCSS(
				[
					{
						selector: '.foo',
						rules: {
							'color': 'red',
							'font-size': '16px',
						},
					},
					{
						selector: '.bar',
						rules: { color: 'blue' },
					},
				],

				'expanded'
			)
		).toBe(`.foo {
  color: red;
  font-size: 16px;
}

.bar {
  color: blue;
}
`);

		expect(
			formatCSS(
				[
					{
						selector: '.foo',
						rules: { 'color': 'red', 'font-size': '16px' },
					},
					{
						selector: '.bar',
						rules: { color: 'blue' },
					},
				],
				'compact'
			)
		).toBe(`.foo { color: red; font-size: 16px; }

.bar { color: blue; }
`);

		expect(
			formatCSS(
				[
					{
						selector: '.foo',
						rules: {
							'color': 'red',
							'font-size': '16px',
						},
					},
					{
						selector: '.bar',
						rules: {
							color: 'blue',
						},
					},
				],

				'compressed'
			)
		).toBe(`.foo{color:red;font-size:16px}.bar{color:blue}`);
	});
});
