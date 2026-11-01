import { createIconifyAPILoader } from './create.js';
import { setProviderLoader } from '../loaders.js';

// Add default loader for Iconify API
setProviderLoader(
	'',
	createIconifyAPILoader([
		'https://api.iconify.design',
		'https://api2.iconify.design',
	])
);
