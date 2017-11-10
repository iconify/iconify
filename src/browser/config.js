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
 * Merge custom and default configuration and functions for changing config values
 *
 * It will merge default config with SimpleSVGConfig object if it exists
 */
(function(SimpleSVG, global, local, config) {
    "use strict";

    /**
     * Change config value
     *
     * @param {string} key
     * @param {*} value
     * @param {boolean} canChangeHardcoded
     */
    function setConfig(key, value, canChangeHardcoded) {
        if (!canChangeHardcoded && key.slice(0, 1) === '_') {
            return;
        }

        switch (key) {
            case '_customCDN':
            case 'SVGAttributes':
                // Merge objects
                Object.keys(value).forEach(function (key2) {
                    config[key][key2] = value[key2];
                });
                break;

            default:
                // Overwrite config
                config[key] = value;
        }
    }

    /**
     * Merge configuration objects
     *
     * @param {object} list
     * @param {boolean} canChangeHardcoded
     */
    function mergeConfig(list, canChangeHardcoded) {
        Object.keys(list).forEach(function(key) {
            setConfig(key, list[key], canChangeHardcoded);
        });
    }

    /**
     * Change configuration option
     *
     * @param {string} name
     * @param {*} value
     */
    SimpleSVG.setConfig = function(name, value) {
        setConfig(name, value, false);
    };

    /**
     * Set custom CDN URL
     *
     * @param {string|Array} prefix Collection prefix
     * @param {string} url JSONP URL. There are several possible variables in URL:
     *
     *      {icons} represents icons list
     *      {callback} represents SimpleSVG callback function
     *      {prefix} is replaced with collection prefix (used when multiple collections are added with same url)
     *
     *      All variables are optional. If {icons} is missing, callback must return entire collection.
     */
    SimpleSVG.setCustomCDN = function(prefix, url) {
        (typeof prefix === 'string' ? [prefix] : prefix).forEach(function(key) {
            config._cdn[key] = url;
        });
    };

    /**
     * Get configuration value
     *
     * @param {string} name
     * @return {*}
     */
    SimpleSVG.getConfig = function(name) {
        return config[name];
    };

    // Merge configuration with SimpleSVGConfig object
    if (global.SimpleSVGConfig !== void 0 && typeof global.SimpleSVGConfig === 'object') {
        mergeConfig(global.SimpleSVGConfig, true);
    }

})(SimpleSVG, global, local, local.config);
