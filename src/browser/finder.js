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
(function(SimpleSVG) {
    "use strict";

    var imageClass = SimpleSVG.config.imageClass,
        loadingClass = SimpleSVG.config.loadingClass,
        hFlipClass = SimpleSVG.config.hFlipClass,
        vFlipClass = SimpleSVG.config.vFlipClass,
        iconAttribute = SimpleSVG.config.iconAttribute,
        placeholderTag = SimpleSVG.config.placeholderTag,
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
            // filterClasses: function(image, list) { return list ; }

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

        ['icon', 'hFlip', 'vFlip'].forEach(function(key) {
            if (finder[key] === void 0) {
                finder[key] = finders.ssvg[key];
            }
        });

        if (finder.rotation === void 0) {
            if (finder.rotationClasses !== void 0) {
                finder.rotation = function(element) {
                    return finders.ssvg.rotation(element, finder.rotationClasses);
                };
            }
            finder.rotation = finders.ssvg.rotation;
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
     * @private
     */
    SimpleSVG._findNewImages = function(root, loading) {
        var results = [],
            duplicates = [];

        finderKeys.forEach(function(key) {
            var finder = finders[key],
                selector = loading === true ? finder.selectorLoading : (loading === false ? finder.selectorNew : finder.selector);

            var nodes = root.querySelectorAll(selector + ':not(svg):not(' + placeholderTag + ')'),
                index, node, icon;

            for (index = 0; index < nodes.length; index ++) {
                node = nodes[index];
                icon = finder.icon(node);

                if (icon && duplicates.indexOf(node) === -1) {
                    duplicates.push(node);
                    results.push(SimpleSVG._newImage(node, icon, finder));
                }
            }
        });

        return results;
    };

    /**
     * Find hidden or parsed images
     *
     * @param {Element} root Root element
     * @param {string} tag Element tag
     * @param {boolean} hidden Status
     * @return {Array}
     * @private
     */
    SimpleSVG._findHiddenOrParsedImages = function(root, tag, hidden) {
        var results = [];

        var nodes = root.querySelectorAll(tag + '.' + imageClass),
            index, node, icon;

        for (index = 0; index < nodes.length; index ++) {
            node = nodes[index];
            icon = node.getAttribute(iconAttribute);

            if (icon) {
                results.push(SimpleSVG._parsedImage(node, icon, hidden));
            }
        }

        return results;
    };

    /**
     * Find all hidden images (waiting to be displayed)
     *
     * @param {Element} root Root element
     * @return {Array}
     * @private
     */
    SimpleSVG._findHiddenImages = function(root) {
        return SimpleSVG._findHiddenOrParsedImages(root, placeholderTag, true);
    };

    /**
     * Find all parsed images
     *
     * @param {Element} root Root element
     * @return {Array}
     * @private
     */
    SimpleSVG._findParsedImages = function(root) {
        return SimpleSVG._findHiddenOrParsedImages(root, 'svg', false);
    };

})(self.SimpleSVG);
