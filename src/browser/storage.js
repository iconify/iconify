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
 * Icons storage handler
 */
(function(Iconify, local, global) {
    "use strict";

    var eventQueued = false,
        storage = new local.Storage();

    /**
     * Triggers callback
     */
    function triggerCallback() {
        if (!eventQueued) {
            return;
        }
        eventQueued = false;
        local.scanDOM();
    }

    /**
     * Function to add collection
     *
     * @param {object} json JSON data
     */
    Iconify.addCollection = function(json) {
        storage.addCollection(json);
        if (!eventQueued) {
            eventQueued = true;
            window.setTimeout(triggerCallback, 0);
        }
    };

    /**
     * Add icon
     *
     * @param {string} name Icon name
     * @param {object} data Icon data
     */
    Iconify.addIcon = function(name, data) {
        storage.addIcon(name, data);
        if (!eventQueued) {
            eventQueued = true;
            window.setTimeout(triggerCallback, 0);
        }
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Optional icon prefix (if prefix is set name should not include prefix)
     * @return {boolean}
     */
    Iconify.iconExists = storage.exists.bind(storage);

    /**
     * Get icon data
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Optional icon prefix (if prefix is set name should not include prefix)
     * @return {null}
     */
    Iconify.getIcon = storage.copyIcon.bind(storage);

    /**
     * Get list of available icons
     *
     * @param {string} prefix If prefix is set, only icons with that prefix will be listed
     * @return {Array}
     */
    Iconify.listIcons = storage.list.bind(storage);

    /**
     * Add collections from global IconifyPreload array
     *
     * This allows preloading icons before including Iconify
     * To preload icons before and after Iconify, instead of wrapping object in
     *  Iconify.addCollection(data);
     * use this:
     *  (window.Iconify ? window.Iconify.addCollection : ((window.IconifyPreload = window.IconifyPreload || []).push.bind(window.IconifyPreload)))(data);
     *
     * TODO: remove backwards compatibility with old beta before final release
     */
    ['SimpleSVG', 'Iconify'].forEach(function(prefix) {
        if (global[prefix + 'Preload'] !== void 0 && global[prefix + 'Preload'] instanceof Array) {
            global[prefix + 'Preload'].forEach(function(item) {
                if (typeof item === 'object' && item.icons !== void 0) {
                    Iconify.addCollection(item);
                }
            });
        }
    });

})(Iconify, local, global);
