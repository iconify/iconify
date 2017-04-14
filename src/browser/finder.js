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
 * Functions that find images in DOM
 */
(function(SimpleSVG, local, config) {
    "use strict";

    var imageClass = config._imageClass,
        loadingClass = config._loadingClass,
        iconAttribute = config._iconAttribute,
        newSelectorExtra = ':not(.' + loadingClass + ')',
        loadingSelectorExtra = '.' + loadingClass;

    /**
     * List of finders
     *
     * @type {object}
     */
    var finders = {
        ssvg: {
            selector: '.' + imageClass,
            selectorNew: '.' + imageClass + newSelectorExtra,
            selectorLoading: '.' + imageClass + loadingSelectorExtra,

            /**
             * Get icon name from element
             *
             * @param {Element} element
             * @return {string} Icon name, empty string if none
             */
            icon: function(element) {
                var result = element.getAttribute(iconAttribute);
                return typeof result === 'string' ? result : '';
            },

            /**
             * Filter class names list, removing any custom classes
             *
             * If function is missing in finder, classes will not be filtered
             *
             * @param {object} image
             * @param {Array|DOMTokenList} list
             * @return {Array}
             */
            // filterClasses: function(image, list) { return list; }

            /**
             * Filter attributes, removing any attributes that should not be passed to SVG
             *
             * If function is missing in finder, attributes will not be filtered
             *
             * @param {object} image
             * @param {object} attributes
             * @return {object}
             */
            // filterAttributes: function(image, attributes) { return attributes; }
        }
    };

    /**
     * List of finder keys for faster iteration
     *
     * @type {Array}
     */
    var finderKeys = Object.keys(finders);

    /**
     * Add custom finder
     *
     * @param {string} name Finder name
     * @param {object} finder Finder data
     */
    SimpleSVG.addFinder = function(name, finder) {
        // Set missing properties
        if (finder.selectorNew === void 0) {
            finder.selectorNew = finder.selector + ':not(.' + loadingClass + ')';
        }
        if (finder.selectorLoading === void 0) {
            finder.selectorLoading = finder.selector + '.' + loadingClass;
        }

        finders[name] = finder;
        finderKeys = Object.keys(finders);
    };

    /**
     * Find new images
     *
     * @param {Element} root Root element
     * @param {boolean} [loading] Filter images by loading status. If missing, result will not be filtered
     * @return {Array}
     */
    local.findNewImages = function(root, loading) {
        var results = [],
            duplicates = [];

        root = root === void 0 ? (config._root === void 0 ? document.querySelector('body') : config._root) : root;

        finderKeys.forEach(function(key) {
            var finder = finders[key],
                selector = loading === true ? finder.selectorLoading : (loading === false ? finder.selectorNew : finder.selector);

            var nodes = root.querySelectorAll(selector + ':not(svg)'),
                index, node, icon;

            for (index = 0; index < nodes.length; index ++) {
                node = nodes[index];
                icon = finder.icon(node);

                if (icon && duplicates.indexOf(node) === -1) {
                    duplicates.push(node);
                    results.push(local.newImage(node, icon, finder));
                }
            }
        });

        return results;
    };

    /**
     * Find all svg images
     *
     * @param {Element} root Root element
     * @return {Array}
     */
    local.findParsedImages = function(root) {
        var results = [];

        var nodes = root.querySelectorAll('svg.' + imageClass),
            index, node, icon;

        for (index = 0; index < nodes.length; index ++) {
            node = nodes[index];
            icon = node.getAttribute(iconAttribute);

            if (icon) {
                results.push(local.parsedImage(node, icon));
            }
        }

        return results;
    };

})(SimpleSVG, local, local.config);
