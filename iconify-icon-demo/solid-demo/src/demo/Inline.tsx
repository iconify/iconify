import { Icon } from '@iconify-icon/solid';

export default () => {
	return (
		<section class="inline-demo">
			<h1>Inline demo</h1>
			<div>
				Block icon (behaving like image):
				<Icon icon="experiment2" />
				<Icon
					icon="experiment2"
					inline={true}
					style="vertical-align: 0"
				/>
			</div>
			<div>
				Inline icon (behaving line text / icon font):
				<Icon icon="experiment2" inline={true} />
				<Icon
					icon="experiment2"
					style={{ 'vertical-align': '-0.125em' }}
				/>
			</div>
		</section>
	);
};
