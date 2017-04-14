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
 * Functions that create image objects
 */
(function(local, config) {
    "use strict";

    var iconAttribute = config._iconAttribute,
        loadingClass = config._loadingClass,
        imageClass = config._imageClass;

    /**
     * Create object for new image
     *
     * @param {Element} element DOM element
     * @param {string} icon Icon name
     * @param {function} parser Parser function
     * @return {{element: Element, icon: string, parser: function, loading: boolean}}
     */
    local.newImage = function(element, icon, parser) {
        return {
            element: element,
            icon: icon,
            parser: parser,
            loading: element.classList.contains(loadingClass)
        };
    };

    /**
     * Create object for parsed image
     *
     * @param {Element} element DOM element
     * @param {string} icon Icon name
     * @return {{element: Element, icon: string}}
     */
    local.parsedImage = function(element, icon) {
        return {
            element: element,
            icon: icon
        };
    };

    /**
     * Get image attributes to pass to SVG
     *
     * @param {object} image
     * @return {object}
     */
    local.getImageAttributes = function(image) {
        var results = {},
            i, attr;

        if (!image.element.hasAttributes()) {
            return results;
        }

        // Copy all attributes, filter them
        for (i = 0; i < image.element.attributes.length; i++) {
            attr = image.element.attributes[i];
            if (attr.name !== iconAttribute) {
                results[attr.name] = attr.value;
            }
        }

        // Filter attributes
        if (image.parser && image.parser.filterAttributes !== void 0) {
            results = image.parser.filterAttributes(image, results);
        } else if (image.element.tagName === 'SVG') {
            local.SVG.defaultAttributes.forEach(function(attr) {
                delete results[attr];
            });
        }

        // Filter class names
        if (results['class'] !== void 0) {
            results['class'] = results['class'].split(' ').filter(function(item) {
                return item !== loadingClass && item !== imageClass;
            });

            if (image.parser && image.parser.filterClasses !== void 0) {
                results['class'] = image.parser.filterClasses(image, results['class']);
            }

            results['class'] = results['class'].join(' ');
        }

        return results;
    };

})(local, local.config);
