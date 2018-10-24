/**
 * This file is part of the @iconify/iconify package.
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
(function(Iconify, local, config) {
    "use strict";

    var imageClass = config._imageClass,
        loadingClass = config._loadingClass,
        appendedClass = config._appendedClass,
        iconAttribute = config._iconAttribute,
        inlineAttribute = config._inlineModeAttribute,
        negativeSelectors = ':not(svg):not(.' + appendedClass + ')',
        negativeLoadingSelectors = ':not(.' + loadingClass + ')',
        loadingSelector = '.' + loadingClass;

    /**
     * List of finders
     *
     * @type {object}
     */
    var finders = {
        iconify: {
            selector: '.' + imageClass,
            selectorAll: '.' + imageClass + negativeSelectors,
            selectorNew: '.' + imageClass + negativeSelectors + negativeLoadingSelectors,
            selectorLoading: '.' + imageClass + negativeSelectors + loadingSelector,

            /**
             * Get icon name from element
             *
             * @param {Element} element
             * @return {string} Icon name, empty string if none
             */
            icon: function(element) {
                var result = element.getAttribute(iconAttribute),
                    item;

                if (typeof result === 'string') {
                    return result;
                }

                // Look for icon:icon-name format (icon:fa-home, icon:emojione-monotone:cat)
                for (var i = 0; i < element.classList.length; i++) {
                    item = element.classList[i];
                    if (item.length > 5 && item.slice(0, 5) === 'icon:') {
                        return item.slice(5);
                    }
                }

                return '';
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
            filterClasses: function(image, list) {
                var item, i, attr;

                // Copy icon-foo:bar classes as data-foo=bar attributes to make it possible to use class names instead of attributes.
                // Prefix "icon-" is removed.
                // icon-width:24px -> data-width="24px"
                // If both class and attribute are present, class has higher priority (to reduce number of checks).
                for (i = 0; i < list.length; i++) {
                    item = list[i];
                    if (item.slice(0, 5) === 'icon-') {
                        item = item.slice(5).split(':');
                        if (item.length === 2) {
                            attr = 'data-' + item[0];
                            if (image.attributes === void 0) {
                                image.attributes = {};
                            }
                            image.attributes[attr] = item[1];
                        }
                    }
                }

                return list;
            }

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
    Iconify.addFinder = function(name, finder) {
        // Set missing properties
        if (finder.selectorAll === void 0) {
            finder.selectorAll = finder.selector + negativeSelectors;
        }
        if (finder.selectorNew === void 0) {
            finder.selectorNew = finder.selector + negativeSelectors + negativeLoadingSelectors;
        }
        if (finder.selectorLoading === void 0) {
            finder.selectorLoading = finder.selector + negativeSelectors + loadingSelector;
        }

        finders[name] = finder;
        finderKeys = Object.keys(finders);

        // Re-scan DOM
        if (Iconify.isReady) {
            Iconify.scanDOM();
        }
    };

    /**
     * Add custom tag finder
     *
     * @param {string} name Tag name
     * @param {boolean} inline True/false if icon should be inline by default
     * @param {function} [resolver] Function to return icon name, null or undefined if default resolver should be used
     */
    Iconify.addTag = function(name, inline, resolver) {
        Iconify.addFinder('tag-' + name, {
            selector: name,
            icon: resolver === void 0 || resolver === null ? finders.iconify.icon : resolver,
            filterAttributes: function(image, attributes) {
                if (attributes[inlineAttribute] === void 0) {
                    attributes[inlineAttribute] = inline;
                }
                return attributes;
            }
        });
    };

    // Add custom iconify-icon tag
    try {
        // Try to create custom element interface if browser supports it.
        // If browser doesn't support it, it will fall back to HTMLUnknownElement, which is
        // fine because iconify-icon doesn't have any custom behavior or attributes.
        if (typeof Reflect === 'object' && typeof customElements === 'object' && Object.setPrototypeOf)
            (function() {
                function El() {
                    return Reflect.construct(HTMLElement, [], El);
                }
                Object.setPrototypeOf(El.prototype, HTMLElement.prototype);
                Object.setPrototypeOf(El, HTMLElement);
                customElements.define('iconify-icon', El);
            })();
    } catch (err) { }
    Iconify.addTag('iconify-icon', false);

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

        root = root === void 0 ? (config._root === void 0 ? document.body : config._root) : root;
        if (!root) {
            return results;
        }

        finderKeys.forEach(function(key) {
            var finder = finders[key],
                selector = loading === true ? finder.selectorLoading : (loading === false ? finder.selectorNew : finder.selectorAll);

            var nodes = root.querySelectorAll(selector),
                index, node, icon, image;

            for (index = 0; index < nodes.length; index ++) {
                node = nodes[index];
                icon = finder.icon(node);

                if (icon && duplicates.indexOf(node) === -1) {
                    duplicates.push(node);
                    image = local.newImage(node, icon, finder);
                    results.push(image);
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

})(Iconify, local, local.config);
