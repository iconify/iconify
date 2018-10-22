/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Default configuration when CDN module is included
 */
(function(config) {
    "use strict";

    // CDN callback script
    config.defaultCDN = '//api.iconify.design/{prefix}.js?icons={icons}';

    // Custom CDN list. Key = prefix, value = CDN URL
    config.cdn = {};

    // Maximum URL size for CDN
    config.loaderMaxURLSize = 500;

    // True if icons should be loaded before DOM is ready
    // Disable this option is you are pre-loading any icons and script is in <head> section
    // Default value: enabled if script is in <head> section, disabled if script is in <body> section
    config.loadBeforeDOMReady = !(document && document.body);

    // Custom event to call after new set of images was added
    config._loaderEvent = 'IconifyAddedIcons';

    // True if session storage should be used to cache icons between different pages to minimize number of API calls.
    // If localStorage is enabled, icons will be saved to localStorage instead of sessionStorage.
    config.sessionStorage = true;

    // True if local storage should be used to cache icons. This option might require cookie confirmation in some countries,
    // so it is disabled unless storage already has some data, which means website is using it, so script assumes user
    // has accepted cookies.
    config.localStorage = !!(window && window.localStorage && window.localStorage.length);

})(local.config);
