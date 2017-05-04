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
     * List of images queued for loading
     *
     * @type {Array}
     */
    var queue = [],
        tested = [];

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
     * List of prefixes, sorted
     *
     * @type {Array|null}
     */
    var sortedPrefixes = null;

    /**
     * Sort prefixes
     */
    function sortPrefixes() {
        var prefixesSortedKeys = {};
        sortedPrefixes = [];

        prefixes = Object.keys(config._cdn);
        prefixes.sort(function(a, b) {
            return b.length - a.length;
        });

        prefixes.forEach(function(prefix) {
            if (prefixesSortedKeys[prefix.length] === void 0) {
                sortedPrefixes.push({
                    length: prefix.length,
                    items: []
                });
                prefixesSortedKeys[prefix.length] = sortedPrefixes[sortedPrefixes.length - 1];
            }
            prefixesSortedKeys[prefix.length].items.push(prefix);
        });
    }

    /**
     * Find prefix for icon
     *
     * @param {string} icon Icon name
     * @return {string}
     */
    function getPrefix(icon) {
        var i, j, length, prefixes, slice;

        // Check custom prefixes
        for (i = 0; i < sortedPrefixes.length; i++) {
            length = sortedPrefixes[i].length;
            prefixes = sortedPrefixes[i].items;
            slice = icon.slice(0, length);
            for (j = 0; j < prefixes.length; j++) {
                if (prefixes[j] === slice) {
                    return slice;
                }
            }
        }

        // Default prefix: part before first -
        return icon.split('-')[0];
    }

    /**
     * Load all queued images
     */
    function loadQueue() {
        var queues = {},
            URLLengths = {},
            urls = {},
            limit = config.loaderMaxURLSize;

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

        // Sort prefixes
        if (local._sortPrefixes) {
            sortPrefixes();
        }

        // Check queue
        queue.forEach(function(icon) {
            var prefix = getPrefix(icon);

            // Check if queue for prefix exists
            if (queues[prefix] === void 0) {
                queues[prefix] = [];
                URLLengths[prefix] = baseLength(prefix);
                if (URLLengths[prefix] === null) {
                    // URL without list of icons - loads entire library
                    addScript(prefix, []);
                } else {
                    URLLengths[prefix] += icon.length + 1;
                    queues[prefix].push(icon);
                }
            } else if (URLLengths[prefix] !== null) {
                // Add icon to queue
                URLLengths[prefix] += icon.length + 1;
                if (URLLengths[prefix] >= limit) {
                    addScript(prefix, queues[prefix]);
                    queues[prefix] = [];
                    URLLengths[prefix] = baseLength(prefix);
                }

                queues[prefix].push(icon);
            }
        });

        // Get remaining items
        Object.keys(queues).forEach(function(prefix) {
            if (URLLengths[prefix] !== null && queues[prefix].length) {
                addScript(prefix, queues[prefix]);
            }
        });

        // Mark icons as loaded
        tested = tested.concat(queue);
        queue = [];
        queued = false;
    }

    /**
     * Add image to loading queue
     *
     * @param {string} image Image name
     * @return {boolean} True if image was added to queue
     */
    function addToQueue(image) {
        // Check queue
        if (queue.indexOf(image) !== -1 || tested.indexOf(image) !== -1) {
            return false;
        }

        // Add to queue
        queue.push(image);
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
        if (SimpleSVG.iconExists(image.icon)) {
            return true;
        }

        if (checkQueue !== false && addToQueue(image.icon)) {
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
        var queued = false;
        images.forEach(function(key) {
            if (!SimpleSVG.iconExists(key)) {
                addToQueue(key);
                queued = true;
            }
        });
        return queued;
    };

    // Mark prefixes as unsorted
    local._sortPrefixes = true;

})(SimpleSVG, local, local.config, global);
