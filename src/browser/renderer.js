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
(function(SimpleSVG, local, config) {
    "use strict";

    var iconAttribute = config._iconAttribute,
        loadingClass = config._loadingClass,
        imageClass = config._imageClass,
        appendedClass = config._appendedClass;

    /**
     * Generate SVG code
     *
     * @param {string} html Empty SVG element with all attributes
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

        // Fix lower case attributes
        html = html.replace('viewbox=', 'viewBox=').replace('preserveaspectratio=', 'preserveAspectRatio=');

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

    /**
     * Render SVG
     *
     * @param {object} image
     */
    local.renderSVG = function(image) {
        var attributes = local.getImageAttributes(image),
            item = SimpleSVG.getIcon(image.icon),
            svgObject, svgElement, temp, span, data, html;

        attributes[iconAttribute] = image.icon;
        svgObject = new local.SVG(item);
        temp = document.createElement('svg');

        data = svgObject.attributes(attributes);

        Object.keys(data.attributes).forEach(function(attr) {
            try {
                temp.setAttribute(attr, data.attributes[attr]);
            } catch (err) {
            }
        });
        Object.keys(data.elementAttributes).forEach(function(attr) {
            try {
                (data.append ? image.element : temp).setAttribute(attr, data.elementAttributes[attr]);
            } catch (err) {
            }
        });

        if (image.loading) {
            temp.classList.remove(loadingClass);
            if (data.append) {
                image.element.classList.remove(loadingClass);
            }
        }
        temp.classList.add(imageClass);

        // innerHTML is not supported for SVG element :(
        // Creating temporary element instead
        html = generateSVG(temp.outerHTML, data.body);

        span = document.createElement('span');
        span.innerHTML = html;

        svgElement = span.childNodes[0];

        if (data.append) {
            image.element.classList.add(appendedClass);
            image.element.appendChild(svgElement);
        } else {
            image.element.parentNode.replaceChild(svgElement, image.element);
            image.element = svgElement;
        }

        delete image.parser;
        delete image.loading;
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

        svg = new local.SVG(SimpleSVG.getIcon(name));
        data = svg.attributes(properties, false);

        el = document.createElement('svg');
        Object.keys(data.attributes).forEach(function(attr) {
            try {
                el.setAttribute(attr, data.attributes[attr]);
            } catch (err) {

            }
        });

        return generateSVG(el.outerHTML, data.body);
    };

})(SimpleSVG, local, local.config);
