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
 * Merge custom and default configuration and functions for changing config values
 *
 * It will merge default config with IconifyConfig object if it exists, allowing to set
 * configuration before including Iconify script (useful if Iconify is loaded asynchronously).
 */
(function(Iconify, global, local, config) {
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
            case 'API':
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
    Iconify.setConfig = function(name, value) {
        setConfig(name, value, false);
    };

    /**
     * Set custom API URL
     *
     * @param {string|Array} prefix Collection prefix
     * @param {string} url API JSONP URL. There are several possible variables in URL:
     *
     *      {icons} represents icons list
     *      {callback} represents Iconify callback function
     *      {prefix} is replaced with collection prefix (used when multiple collections are added with same url)
     *
     *      All variables are optional. If {icons} is missing, callback must return entire collection.
     */
    Iconify.setCustomAPI = function(prefix, url) {
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
                delete config.API[key];
            } else {
                config.API[key] = url;
            }
        });
    };

    /**
     * Get configuration value
     *
     * @param {string} name
     * @return {*}
     */
    Iconify.getConfig = function(name) {
        return config[name] === void 0 ? (
            config['_' + name] === void 0 ? null : config['_' + name]
        ) : config[name];
    };

    // Merge configuration with SimpleSVGConfig (for backwards compatibility) and IconifyConfig objects
    // TODO: remove backwards compatibility with old beta before final release
    ['SimpleSVG', 'Iconify'].forEach(function(prefix) {
        var obj;
        if (global[prefix + 'Config'] !== void 0 && typeof global[prefix + 'Config'] === 'object') {
            obj = global[prefix + 'Config'];
            Object.keys(obj).forEach(function(key) {
                setConfig(key, obj[key], true);
            });
        }
    });

})(Iconify, global, local, local.config);
