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
 * Plugin for FontAwesome icons
 */
(function(SimpleSVG) {
    "use strict";

    /**
     * List of FontAwesome class names that do not represent icons
     *
     * @type {[string]}
     */
    var faReserved = ['fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x', 'fa-fw', 'fa-ul', 'fa-li', 'fa-border', 'fa-pull-left', 'fa-pull-right', 'fa-spin', 'fa-pulse', 'fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270', 'fa-flip-horizontal', 'fa-flip-vertical', 'fa-stack', 'fa-stack-1x', 'fa-stack-2x', 'fa-inverse'],
        rotationClasses = SimpleSVG.getConfig('_rotationClasses'),
        hFlipClass = SimpleSVG.getConfig('_hFlipClass'),
        vFlipClass = SimpleSVG.getConfig('_vFlipClass');

    /**
     * Add finder to list of finders
     */
    SimpleSVG.addFinder('fa', {
        selector: '.fa',

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
                if (item.slice(0, 3) === 'fa-' && faReserved.indexOf(item) === -1) {
                    return item;
                }
            }

            return '';
        },

        /**
         * Filter class names list, removing any FontAwesome specific classes
         *
         * @param {object} image
         * @param {Array|DOMTokenList} list
         * @return {Array}
         */
        filterClasses: function(image, list) {
            var results = [];

            for (var i = 0; i < list.length; i++) {
                switch (list[i]) {
                    case 'fa-rotate-90':
                        results.push(rotationClasses['1']);
                        break;

                    case 'fa-rotate-180':
                        results.push(rotationClasses['2']);
                        break;

                    case 'fa-rotate-270':
                        results.push(rotationClasses['3']);
                        break;

                    case 'fa-flip-horizontal':
                        results.push(hFlipClass);
                        break;

                    case 'fa-flip-vertical':
                        results.push(vFlipClass);
                        break;

                    default:
                        if (list[i] !== 'fa' && list[i].slice(0, 3) !== 'fa-') {
                            results.push(list[i]);
                        }
                }
            }

            return results;
        }
    });

})(SimpleSVG);
