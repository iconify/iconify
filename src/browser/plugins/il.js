/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

/**
 * Plugin for icalicons icons
 */
(function(Iconify) {
    "use strict";

    /**
     * List of icalicons class names that do not represent icons
     *
     * @type {[string]}
     */
    var inlineAttribute = Iconify.getConfig('_inlineModeAttribute');

    /**
     * Add finder to list of finders
     */
    Iconify.addFinder('il', {
        selector: '.il',

        /**
         * Get icon name from element
         *
         * @param {Element} element
         * @return {string}
         */
        icon: function(element) {
            var item;

            for (var i = 0; i < element.classList.length; i++) {
                item = element.classList[i];
                if (item.slice(0, 3) === 'il-') {
                    return item;
                }
            }

            return '';
        },

        /**
         * Filter class names list, removing any icalicons specific classes
         *
         * @param {object} image
         * @param {Array|DOMTokenList} list
         * @return {Array}
         */
        filterClasses: function(image, list) {
            var results;

            results = list.filter(function(item) {
                return item !== 'il' && item.slice(0, 3) !== 'il-';
            });

            if (image.attributes === void 0) {
                image.attributes = {};
            }

            if (image.attributes[inlineAttribute] === void 0) {
                image.attributes[inlineAttribute] = true;
            }

            image.attributes.width = '1em';
            image.attributes.height = '1em';


            return results;
        }
    });

})(Iconify);
