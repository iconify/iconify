/**
 * This file is part of the @cyberalien/simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * This is not open source library.
 * This library can be used only with products available on artodia.com
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Merge custom and default configuration
 *
 * It will merge with existing SimpleSVG.config and SimpleSVGConfig objects, adding only items that aren't set
 */
(function(global, SimpleSVG) {
    "use strict";

    var customConfig = SimpleSVG.config === void 0 ? null : SimpleSVG.config;

    SimpleSVG.config = SimpleSVG._defaultConfig;

    // Merge with SimpleSVGConfig object
    if (global.SimpleSVGConfig !== void 0 && typeof global.SimpleSVGConfig === 'object') {
        Object.keys(SimpleSVG.config).forEach(function(key) {
            if (global.SimpleSVGConfig[key] !== void 0) {
                SimpleSVG.config[key] = global.SimpleSVGConfig[key];
            }
        });
    }

    // Merge with existing config object
    if (customConfig !== null) {
        Object.keys(SimpleSVG.config).forEach(function(key) {
            if (customConfig[key] !== void 0) {
                SimpleSVG.config[key] = customConfig[key];
            }
        });
    }

})(self, self.SimpleSVG);
