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
 * Functions that create image objects
 */
(function(local, config) {
    "use strict";

    var loadingClass = config._loadingClass;

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

        // Copy all attributes
        for (i = 0; i < image.element.attributes.length; i++) {
            attr = image.element.attributes[i];
            results[attr.name] = attr.value;
        }

        // Filter attributes
        if (image.parser && image.parser.filterAttributes !== void 0) {
            results = image.parser.filterAttributes(image, results);
        }

        // Filter class names
        if (results['class'] !== void 0) {
            results['class'] = results['class'].split(' ').filter(function(item) {
                return item !== loadingClass;
            });

            if (image.parser && image.parser.filterClasses !== void 0) {
                results['class'] = image.parser.filterClasses(image, results['class']);
            }

            results['class'] = results['class'].join(' ');
        }

        // Add attributes from image
        if (image.attributes !== void 0) {
            Object.keys(image.attributes).forEach(function (attr) {
                results[attr] = image.attributes[attr];
            });
        }

        return results;
    };

})(local, local.config);
