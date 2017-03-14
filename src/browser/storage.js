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
 * Replacement for observer module when observer is disabled
 */
(function(SimpleSVG) {
    "use strict";

    var eventQueued = false,
        storage = new SimpleSVG._Storage();

    /**
     * Triggers callback
     */
    function triggerCallback() {
        if (!eventQueued) {
            return;
        }
        eventQueued = false;
        if (typeof SimpleSVG._onIconsAdded === 'function') {
            SimpleSVG._onIconsAdded();
        }
    }

    /**
     * Function to add library
     *
     * @param {object} json JSON data
     * @return {number} Number of added items
     */
    SimpleSVG.addLibrary = function(json) {
        var result = storage.addLibrary(json);
        if (result) {
            if (!eventQueued) {
                eventQueued = true;
                setTimeout(triggerCallback, 0);
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
                setTimeout(triggerCallback, 0);
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

})(self.SimpleSVG);
