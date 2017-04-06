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
     * @return {number} Number of added items
     */
    SimpleSVG.addCollection = function(json) {
        var result = storage.addCollection(json);
        if (result) {
            if (!eventQueued) {
                eventQueued = true;
                window.setTimeout(triggerCallback, 0);
            }
        }
    };

    /**
     * Add icon
     *
     * @param {string} name Icon name
     * @param {object} data Icon data
     * @return {boolean} True if icon was added, false on error
     */
    SimpleSVG.addIcon = function(name, data) {
        var result = storage.addIcon(name, data);
        if (result) {
            if (!eventQueued) {
                eventQueued = true;
                window.setTimeout(triggerCallback, 0);
            }
        }
        return result;
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @return {boolean}
     */
    SimpleSVG.iconExists = storage.exists.bind(storage);

    /**
     * Get icon data
     *
     * @param {string} name
     * @param {boolean} [copy] True if object should be copied. Default = true
     * @return {null}
     */
    SimpleSVG.getIcon = storage.get.bind(storage);

    /**
     * Get list of available icons
     *
     * @return {Array}
     */
    SimpleSVG.listIcons = storage.list.bind(storage);

})(SimpleSVG, local);
