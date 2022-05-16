import { Icon } from '@iconify-icon/solid';

export default () => {
	return (
		<section class="icon-24">
			<h1>Usage (full module)</h1>
			<div>
				Icons referenced by name (as SVG, as SPAN):
				<Icon icon="mdi:home" />
				<Icon icon="mdi:home" mode="style" />
			</div>
			<div class="alert">
				<Icon icon="mdi-light:alert" />
				Important notice with alert icon!
			</div>
		</section>
	);
};
