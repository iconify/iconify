/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license-gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

/**
 * Module for loading images from remote location
 */
(function(Iconify, local, config, global) {
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
     * @type {{Array}|{boolean}}
     */
    var tested = {};

    /**
     * Additional queue for icons to queue when DOM is ready
     *
     * @type {object}
     */
    var domqueue = {};

    /**
     * True if queue will be parsed on next tick
     *
     * @type {boolean}
     */
    var queued = false;

    /**
     * True if storage should be used (must be enabled before including script)
     *
     * @type {{boolean}}
     */
    var useStorage = {
        session: true,
        local: true
    };

    /**
     * Index for last stored data in storage
     *
     * @type {{number}}
     */
    var storageIndex = {
        session: 0,
        local: 0
    };

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
            var url = config.API[prefix] === void 0 ? config.defaultAPI : config.API[prefix];

            if (url.indexOf('{icons}') === -1) {
                urls[prefix] = url;
                return null;
            }
            url = url.replace('{prefix}', prefix).replace('{callback}', 'Iconify._loaderCallback');
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
     * Load queue. Delay queue if DOM isn't ready
     */
    function addToDOMReadyQueue(prefix, icon) {
        if (domqueue[prefix] === void 0) {
            domqueue[prefix] = {};
        }
        domqueue[prefix][icon] = true;

        // Add callback
        if (local._loaderDOMReady !== void 0) {
            return;
        }
        local._loaderDOMReady = local.DOMReadyCallback;
        local.DOMReadyCallback = function() {
            local._loaderDOMReady();
            Object.keys(domqueue).forEach(function(prefix) {
                Object.keys(domqueue[prefix]).forEach(function(icon) {
                    if (!Iconify.iconExists(icon, prefix)) {
                        addToQueue(prefix, icon, true);
                    }
                });
            });
        };
    }

    /**
     * Add image to loading queue
     *
     * @param {string} prefix Collection prefix
     * @param {string} icon Image name
     * @param {boolean} preload True if icon is being pre-loaded
     * @return {boolean} True if image was added to queue
     */
    function addToQueue(prefix, icon, preload) {
        // Check if DOM is ready
        if (!preload && !local.domready && !config.loadBeforeDOMReady) {
            addToDOMReadyQueue(prefix, icon);
            return true;
        }

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
    Iconify._loaderCallback = function(data) {
        var stored = false;

        if (typeof data === 'object') {
            // Add to storage
            ['local', 'session'].forEach(function(key) {
                var func;

                if (stored || !useStorage[key] || !config[key + 'Storage']) {
                    return;
                }
                func = global[key + 'Storage'];
                try {
                    if (!storageIndex[key]) {
                        func.setItem('iconify-version', local.version);
                    }
                    func.setItem('iconify' + storageIndex[key], JSON.stringify(data));
                    stored = true;
                    storageIndex[key] ++;
                    func.setItem('iconify-count', storageIndex[key]);
                } catch (err) {
                    useStorage[key] = false;
                }
            });

            // Add icons to collection and parse icons
            Iconify.addCollection(data);

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

        if (Iconify.iconExists(icon.icon, icon.prefix)) {
            return true;
        }

        if (checkQueue !== false && addToQueue(icon.prefix, icon.icon, false)) {
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
    Iconify.preloadImages = function(images) {
        var preloading = false,
            icon;

        images.forEach(function(key) {
            icon = local.getPrefix(key);
            if (!Iconify.iconExists(icon.icon, icon.prefix)) {
                addToQueue(icon.prefix, icon.icon, true);
                preloading = true;
            }
        });
        return preloading;
    };

    /**
     * Load data from session storage
     */
    (function() {
        ['local', 'session'].forEach(function(key) {
            var func, item, limit;

            try {
                func = global[key + 'Storage'];

                if (typeof func !== 'object') {
                    useStorage[key] = false;
                    return;
                }

                if (func.getItem('iconify-version') !== local.version) {
                    // Ignore stored data, overwrite it starting with index 0
                    return;
                }

                limit = parseInt(func.getItem('iconify-count'));
                if (typeof limit !== 'number' || isNaN(limit)) {
                    return;
                }

                // Get all data from storage until first error is encountered
                while (true) {
                    if (storageIndex[key] >= limit) {
                        return;
                    }
                    item = func.getItem('iconify' + storageIndex[key]);
                    if (typeof item === 'string') {
                        item = JSON.parse(item);
                        if (typeof item === 'object') {
                            Iconify.addCollection(item);
                        }
                    } else {
                        return;
                    }
                    storageIndex[key] ++;
                }
            } catch (err) {
                useStorage[key] = false;
            }
        });
    })();

})(Iconify, local, local.config, global);
