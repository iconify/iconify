import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	action?: boolean;
	focus?: boolean;
	width?: string;
	height?: string;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
