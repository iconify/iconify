import * as vue from 'vue';
import { type CSSIconComponentProps } from '@iconify/css-vue';

type IconComponentProps = Pick<CSSIconComponentProps, 'width' | 'height'>;

declare const Icon: vue.DefineSetupFnComponent<
	IconComponentProps,
	{},
	{},
	IconComponentProps & {},
	vue.PublicProps
>;
export default Icon;
