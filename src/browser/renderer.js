/**
 * This file is part of the @cyberalien/simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * This is not open source library.
 * This library can be used only with products available on artodia.com
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Module for changing images
 */
(function(SimpleSVG) {
    "use strict";

    var placeholderTag = SimpleSVG.config.placeholderTag,
        iconAttribute = SimpleSVG.config.iconAttribute,
        loadingClass = SimpleSVG.config.loadingClass,
        imageClass = SimpleSVG.config.imageClass,
        hFlipClass = SimpleSVG.config.hFlipClass,
        vFlipClass = SimpleSVG.config.vFlipClass,
        rotationClasses = SimpleSVG.config.rotationClasses,
        transformationChanges = {},
        transformationClasses;

    // Add transformations
    transformationChanges[hFlipClass] = {
        attr: 'hFlip',
        value: true
    };

    transformationChanges[vFlipClass] = {
        attr: 'vFlip',
        value: true
    };

    [1, 2, 3].forEach(function(key) {
        transformationChanges[rotationClasses[key]] = {
            attr: 'rotate',
            value: key
        };
    });

    transformationClasses = Object.keys(transformationChanges);

    /**
     * Render SVG or SVG placeholder
     *
     * @param {object} image
     * @param {boolean} [hidden]
     * @private
     */
    SimpleSVG._renderSVG = function(image, hidden) {
        var attributes = SimpleSVG._getImageAttributes(image),
            item = SimpleSVG.getIcon(image.icon),
            svg, el, el2, data, html, pos;

        hidden = hidden === true;

        attributes[iconAttribute] = image.icon;
        svg = new SimpleSVG._SVG(item, hidden);
        el = document.createElement(hidden ? placeholderTag : 'svg');

        // flip and rotate
        if (!hidden) {
            transformationClasses.forEach(function(key) {
                if (image.element.classList.contains(key)) {
                    attributes[transformationChanges[key].attr] = transformationChanges[key].value;
                }
            });
        }

        data = svg.svgObject(attributes, hidden);
        Object.keys(data.attributes).forEach(function(attr) {
            el.setAttribute(attr, data.attributes[attr]);
        });
        if (image.loading) {
            el.classList.remove(loadingClass);
        }
        el.classList.add(imageClass);

        if (!hidden) {
            // innerHTML is not supported for SVG element :(
            // Creating temporary element instead
            html = el.outerHTML;
            if (html.slice(0, 2) === '<?') {
                // XML prefix from old IE
                pos = html.indexOf('>');
                html = html.slice(pos + 1);
            }
            pos = html.indexOf('</');
            if (pos !== -1) {
                // Closing tag
                html = html.replace('</', data.body + '</');
            } else {
                // Self-closing
                html = html.replace('/>', '>' + data.body + '</svg>');
            }
            el = document.createElement('span');
            el.innerHTML = html;
        }

        image.element.parentNode.replaceChild(el, image.element);

        if (!hidden) {
            el2 = el.childNodes[0];
            el.parentNode.replaceChild(el2, el);
            image.element = el2;
        } else {
            image.element = el;
        }

        delete image.parser;
        delete image.loading;
        image.hidden = hidden;
    };

})(self.SimpleSVG);
