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

    /**
     * Generate SVG code
     *
     * @param {string} html SVG code with all attributes
     * @param {string} body Body
     * @return {string}
     */
    function generateSVG(html, body) {
        var pos;

        if (html.slice(0, 2) === '<?') {
            // XML prefix from old IE
            pos = html.indexOf('>');
            html = html.slice(pos + 1);
        }

        // Fix viewBox attribute
        html = html.replace('viewbox=', 'viewBox=');

        // Add body
        pos = html.indexOf('</');
        if (pos !== -1) {
            // Closing tag
            html = html.replace('</', body + '</');
        } else {
            // Self-closing
            html = html.replace('/>', '>' + body + '</svg>');
        }

        return html;
    }

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
            svg, el, el2, data, html;

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
            html = generateSVG(el.outerHTML, data.body);

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

    /**
     * Get SVG icon code
     *
     * @param {string} name Icon name
     * @param {object} [properties] Custom properties
     * @return {string|false}
     */
    SimpleSVG.getSVG = function(name, properties) {
        var svg, el, data;

        if (!SimpleSVG.iconExists(name)) {
            return false;
        }

        svg = new SimpleSVG._SVG(SimpleSVG.getIcon(name));
        data = svg.svgObject(properties, false);

        el = document.createElement('svg');
        Object.keys(data.attributes).forEach(function(attr) {
            el.setAttribute(attr, data.attributes[attr]);
        });

        return generateSVG(el.outerHTML, data.body);
    };

})(self.SimpleSVG);
