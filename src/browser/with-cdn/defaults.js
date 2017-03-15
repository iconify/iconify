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
 * Default configuration when CDN is included
 */
(function(SimpleSVG, scope) {
    "use strict";

    var isAncientBrowser = !Object.assign || !scope.MutationObserver;

    // CDN callback script
    SimpleSVG._defaultConfig.defaultCDN = (isAncientBrowser ? '' : 'https:') + '//cdn.simplesvg.com/json/?callback={callback}&icons={icons}';

    // Custom CDN list. Key = prefix, value = CDN URL
    SimpleSVG._defaultConfig.customCDN = {};

    // Maximum number of icons per request
    SimpleSVG._defaultConfig.loaderIconsLimit = 100;

})(self.SimpleSVG, self);
