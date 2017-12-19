/**
 * This file is part of the simple-svg package.
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
    config.defaultCDN = '//icons.simplesvg.com/{prefix}.js?icons={icons}';

    // Custom CDN list. Key = prefix, value = CDN URL
    config.cdn = {};

    // Maximum URL size for CDN
    config.loaderMaxURLSize = 500;

    // Custom event to call when new set of images is added
    config._loaderEvent = 'SimpleSVGAddedIcons';

    // True if session storage should be used to cache icons between different pages to minimize number of API calls.
    // If localStorage is enabled, icons will be saved to localStorage instead of sessionStorage.
    config.sessionStorage = true;

    // True if local storage should be used to cache icons. This option might require cookie confirmation in some countries,
    // so it is disabled by default. However it is still accessed for reading stored items regardless of setting. Setting
    // affects only saving data to storage.
    config.localStorage = false;

})(local.config);
