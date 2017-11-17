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
 * Module for loading images from remote location
 */
(function(SimpleSVG, local, config, global) {
    "use strict";

    /**
     * List of images queued for loading.
     *
     * key = prefix
     * value = array of queued images
     *
     * @type {{Array}}
     */
    var queue = {};

    /**
     * List of images queued for loading.
     *
     * key = prefix
     * value === true -> entire collection has been queued, value === {Array} -> list of tested images
     *
     * @type {{Array}|true}
     */
    var tested = {};

    /**
     * True if queue will be parsed on next tick
     *
     * @type {boolean}
     */
    var queued = false;

    /**
     * List of all prefixes
     *
     * @type {Array}
     */
    var prefixes = [];

    /**
     * Load all queued images
     */
    function loadQueue() {
        var limit = config.loaderMaxURLSize,
            urls = {};

        /**
         * Send JSONP request by adding script tag to document
         *
         * @param {string} prefix
         * @param {Array} items
         */
        function addScript(prefix, items) {
            var url = urls[prefix],
                element;

            // Replace icons list
            url = url.replace('{icons}', items.join(','));

            // Change to protocol-less to secure
            url = SimpleSVG.secureURL(url);

            // Create script
            element = document.createElement('script');
            element.setAttribute('type', 'text/javascript');
            element.setAttribute('src', url);
            element.setAttribute('async', true);
            document.head.appendChild(element);
        }

        /**
         * Calculate base length of URL
         *
         * @param {string} prefix
         * @return {number|null}
         */
        function baseLength(prefix) {
            var url = config._cdn[prefix] === void 0 ? config.defaultCDN : config._cdn[prefix];

            if (url.indexOf('{icons}') === -1) {
                urls[prefix] = url;
                return null;
            }
            url = url.replace('{prefix}', prefix).replace('{callback}', 'SimpleSVG._loaderCallback');
            urls[prefix] = url;
            return url.replace('{icons}', '').length;
        }

        // Check queue
        Object.keys(queue).forEach(function(prefix) {
            var URLLength = baseLength(prefix),
                queued = [];

            if (URLLength === null) {
                // URL without list of icons - loads entire library
                addScript(prefix, []);
                tested[prefix] = true;
                return;
            }

            queue[prefix].forEach(function(icon, index) {
                URLLength += icon.length + 1;
                if (URLLength >= limit) {
                    addScript(prefix, queued);
                    queued = [];
                    URLLength = baseLength(prefix) + icon.length + 1;
                }
                queued.push(icon);
            });

            // Get remaining items
            if (queued.length) {
                addScript(prefix, queued);
            }

            // Mark icons as loaded
            tested[prefix] = tested[prefix] === void 0 ? queue[prefix] : tested[prefix].concat(queue[prefix]);
            delete queue[prefix];
        });

        queued = false;
    }

    /**
     * Add image to loading queue
     *
     * @param {string} prefix Collection prefix
     * @param {string} icon Image name
     * @return {boolean} True if image was added to queue
     */
    function addToQueue(prefix, icon) {
        // Check queue
        if (
            (queue[prefix] !== void 0 && queue[prefix].indexOf(icon) !== -1) ||
            (tested[prefix] !== void 0 && (tested[prefix] === true || tested[prefix].indexOf(icon) !== -1))
        ) {
            return false;
        }

        // Add to queue
        if (queue[prefix] === void 0) {
            queue[prefix] = [];
        }
        queue[prefix].push(icon);
        if (!queued) {
            queued = true;
            window.setTimeout(loadQueue, 0);
        }
        return true;
    }

    /**
     * Callback for JSONP
     *
     * @param {object} data
     * @constructor
     */
    SimpleSVG._loaderCallback = function(data) {
        if (typeof data === 'object') {
            SimpleSVG.addCollection(data);

            // Dispatch event
            local.event(config._loaderEvent);
        }
    };

    /**
     * Add image to queue, return true if image has been loaded
     *
     * @param {object} image Image object
     * @param {boolean} [checkQueue] True if queue should be checked. Default = true
     * @return {boolean}
     */
    local.loadImage = function(image, checkQueue) {
        var icon = local.getPrefix(image.icon);

        if (SimpleSVG.iconExists(icon.icon, icon.prefix)) {
            return true;
        }

        if (checkQueue !== false && addToQueue(icon.prefix, icon.icon)) {
            // Mark as loading
            image.element.classList.add(config._loadingClass);
        }

        return false;
    };

    /**
     * Preload images
     *
     * @param {Array} images List of images
     * @returns {boolean} True if images are queued for preload, false if images are already available
     */
    SimpleSVG.preloadImages = function(images) {
        var queued = false,
            icon;

        images.forEach(function(key) {
            icon = local.getPrefix(key);
            if (!SimpleSVG.iconExists(icon.icon, icon.prefix)) {
                addToQueue(icon.prefix, icon.icon);
                queued = true;
            }
        });
        return queued;
    };

})(SimpleSVG, local, local.config, global);
