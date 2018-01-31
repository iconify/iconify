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
 * Icons storage handler
 */
(function(SimpleSVG, local, global) {
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
    SimpleSVG.addCollection = function(json) {
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
    SimpleSVG.addIcon = function(name, data) {
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
    SimpleSVG.iconExists = storage.exists.bind(storage);

    /**
     * Get icon data
     *
     * @param {string} name Icon name
     * @param {string} [prefix] Optional icon prefix (if prefix is set name should not include prefix)
     * @return {null}
     */
    SimpleSVG.getIcon = storage.copyIcon.bind(storage);

    /**
     * Get list of available icons
     *
     * @param {string} prefix If prefix is set, only icons with that prefix will be listed
     * @return {Array}
     */
    SimpleSVG.listIcons = storage.list.bind(storage);

    /**
     * Add collections from global SimpleSVGPreload array
     *
     * This allows preloading icons before including SimpleSVG
     * To preload icons before and after SimpleSVG, instead of wrapping object in
     *  SimpleSVG.addCollection(data);
     * use this:
     *  (window.SimpleSVG ? window.SimpleSVG.addCollection : ((window.SimpleSVGPreload = window.SimpleSVGPreload || []).push.bind(window.SimpleSVGPreload)))(data);
     */
    if (global.SimpleSVGPreload !== void 0 && global.SimpleSVGPreload instanceof Array) {
        global.SimpleSVGPreload.forEach(function(item) {
            if (typeof item === 'object' && item.icons !== void 0) {
                SimpleSVG.addCollection(item);
            }
        });
    }

})(SimpleSVG, local, global);
