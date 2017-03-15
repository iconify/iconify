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
 * Merge custom and default configuration
 *
 * It will merge with existing SimpleSVG.config and SimpleSVGConfig objects, adding only items that aren't set
 */
(function(global, SimpleSVG) {
    "use strict";

    var customConfig = SimpleSVG.config === void 0 ? null : SimpleSVG.config;

    function merge(list) {
        Object.keys(SimpleSVG.config).forEach(function(key) {
            if (list[key] === void 0) {
                return;
            }

            switch (key) {
                case 'customCDN':
                    // Merge objects
                    Object.keys(list[key]).forEach(function(key2) {
                        SimpleSVG.config[key][key2] = list[key][key2];
                    });
                    break;

                default:
                    // Overwrite config
                    SimpleSVG.config[key] = list[key];
            }
        });
    }

    SimpleSVG.config = SimpleSVG._defaultConfig;

    // Merge with SimpleSVGConfig object
    if (global.SimpleSVGConfig !== void 0 && typeof global.SimpleSVGConfig === 'object') {
        merge(global.SimpleSVGConfig);
    }

    // Merge with existing config object
    if (customConfig !== null) {
        merge(customConfig);
    }

})(self, self.SimpleSVG);
