/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

/**
 * Default configuration when API module is included
 */
(function(config) {
    "use strict";

    // API callback script
    config.defaultAPI = '//api.iconify.design/{prefix}.js?icons={icons}';

    // Custom API list. Key = prefix, value = API URL
    config.API = {};

    // Maximum length of API URL
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
    try {
        config.localStorage = !!(window && window.localStorage && window.localStorage.length);
    } catch (err) {
        config.localStorage = false;
    }

})(local.config);
