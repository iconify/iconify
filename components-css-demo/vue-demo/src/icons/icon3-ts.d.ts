import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	mode?: 'auto' | 'light' | 'dark';
	fill?: 'no-fill' | 'light-filled' | 'dark-filled' | 'filled';
	focus?: boolean;
	width?: string;
	height?: string;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
