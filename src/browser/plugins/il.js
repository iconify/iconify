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
 * Plugin for icalicons icons
 */
(function(SimpleSVG) {
    "use strict";

    /**
     * List of icalicons class names that do not represent icons
     *
     * @type {[string]}
     */
    var inlineAttribute = SimpleSVG.getConfig('_inlineModeAttribute');

    /**
     * Add finder to list of finders
     */
    SimpleSVG.addFinder('il', {
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

})(SimpleSVG);
