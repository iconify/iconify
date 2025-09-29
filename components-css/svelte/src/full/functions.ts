// Set up default API config
import '@iconify/component-utils/loader/api/init';

// Re-export functions used in component
import { renderContent } from '@iconify/component-utils/helpers/content';
import { subscribeToIconData } from '@iconify/component-utils/icons/subscribe';
import { getSizeProps } from '@iconify/component-utils/helpers/size';

export { renderContent, subscribeToIconData, getSizeProps };
