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
(function(SimpleSVG) {
    "use strict";

    var iconAttribute = SimpleSVG.config.iconAttribute,
        loadingClass = SimpleSVG.config.loadingClass,
        imageClass = SimpleSVG.config.imageClass;

    /**
     * Create object for new image
     *
     * @param {Element} element DOM element
     * @param {string} icon Icon name
     * @param {function} parser Parser function
     * @return {{element: Element, icon: string, parser: function, loading: boolean}}
     * @private
     */
    SimpleSVG._newImage = function(element, icon, parser) {
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
     * @param {boolean} [hidden] True if image is hidden
     * @return {{element: Element, icon: string, hidden: boolean}}
     * @private
     */
    SimpleSVG._parsedImage = function(element, icon, hidden) {
        return {
            element: element,
            icon: icon,
            hidden: hidden === true
        };
    };

    /**
     * Get image attributes to pass to SVG
     *
     * @param {object} image
     * @return {object}
     * @private
     */
    SimpleSVG._getImageAttributes = function(image) {
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
            SimpleSVG._SVG.defaultAttributes.forEach(function(attr) {
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

})(self.SimpleSVG);
