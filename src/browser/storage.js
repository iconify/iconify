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
(function(SimpleSVG, local) {
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
        local.iconsAdded();
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

})(SimpleSVG, local);
