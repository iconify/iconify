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

    // CDN callback script
    SimpleSVG._defaultConfig.defaultCDN = '//cdn.simplesvg.com/json/?callback={callback}&icons={icons}';

    // Custom CDN list. Key = prefix, value = CDN URL
    SimpleSVG._defaultConfig.customCDN = {};

    // Maximum URL size for CDN
    SimpleSVG._defaultConfig.loaderMaxURLSize = 500;

    // Custom event to call when new set of images is added
    SimpleSVG._defaultConfig.loaderEvent = 'newSSVGImages';

})(self.SimpleSVG, self);
