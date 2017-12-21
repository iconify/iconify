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
        var configKey = key;

        if (key.slice(0, 1) === '_') {
            return;
        }

        if (config[key] === void 0) {
            if (!canChangeHardcoded || config['_' + key] === void 0) {
                return;
            }
            configKey = '_' + key;
        }

        switch (configKey) {
            case 'cdn':
            case 'SVGAttributes':
                // Merge objects
                Object.keys(value).forEach(function(key2) {
                    if (value[key] === null) {
                        delete config[configKey][key2];
                    } else {
                        config[configKey][key2] = value[key2];
                    }
                });
                break;

            default:
                // Overwrite config
                config[configKey] = value;
        }
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
     * @param {string} url API JSONP URL. There are several possible variables in URL:
     *
     *      {icons} represents icons list
     *      {callback} represents SimpleSVG callback function
     *      {prefix} is replaced with collection prefix (used when multiple collections are added with same url)
     *
     *      All variables are optional. If {icons} is missing, callback must return entire collection.
     */
    SimpleSVG.setCustomCDN = function(prefix, url) {
        var keys;

        // noinspection FallThroughInSwitchStatementJS
        switch (typeof prefix) {
            case 'string':
                keys = [prefix];
                break;

            case 'object':
                if (prefix instanceof Array) {
                    keys = prefix;
                    break;
                }

            default:
                return;
        }
        prefix.forEach(function(key) {
            if (url === null) {
                delete config.cdn[key];
            } else {
                config.cdn[key] = url;
            }
        });
    };

    /**
     * Get configuration value
     *
     * @param {string} name
     * @return {*}
     */
    SimpleSVG.getConfig = function(name) {
        return config[name] === void 0 ? (
            config['_' + name] === void 0 ? null : config['_' + name]
        ) : config[name];
    };

    // Merge configuration with SimpleSVGConfig object
    if (global.SimpleSVGConfig !== void 0 && typeof global.SimpleSVGConfig === 'object') {
        Object.keys(global.SimpleSVGConfig).forEach(function(key) {
            setConfig(key, global.SimpleSVGConfig[key], true);
        });
    }

})(SimpleSVG, global, local, local.config);
