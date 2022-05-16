import { Icon } from '@iconify-icon/solid';
import accountIcon from '@iconify-icons/line-md/account';
import alertIcon from '@iconify-icons/line-md/alert';

export default () => {
	return (
		<section class="icon-24">
			<h1>Usage (offline mode: using preloaded icons)</h1>
			<div>
				Icons referenced by name (as SVG, as SPAN): <Icon icon="demo" />
				<Icon icon="demo" mode="style" />
			</div>
			<div>
				Icons referenced by object (as SVG, as SPAN):{' '}
				<Icon icon={accountIcon} />
				<Icon icon={accountIcon} mode="style" />
			</div>
			<div>
				2 icons imported from icon set: <Icon icon="test:alert1" />
				<Icon icon="test:link1" mode="style" />
			</div>
			<div class="alert">
				<Icon icon={alertIcon} mode="mask" />
				Important notice with alert icon!
			</div>
		</section>
	);
};
