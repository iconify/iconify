(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(SimpleSVG, local) {
        var global = {};

        if (SimpleSVG.isReady === void 0) {
            SimpleSVG.isReady = true;
        }

        local.config = {};

        /* Modules() */
    }

    describe('Testing image object', function() {
        it('filtering attributes and classes', function() {
            var SimpleSVG = {},
                local = {},
                prefix = 'image-id-',
                image, result;

            // Add dummy code
            jQuery('#debug').append('<div>' +
                '<p id="' + prefix + 'empty">Icon without attributes: <i /></p>' +
                '<p id="' + prefix + 'simple">Icon with basic attributes: <i class="simple-svg svg-loading" data-icon="icon-name" /></p>' +
                '<p id="' + prefix + 'custom">Icon with many attributes: <i class="icon fa fa-home svg-loading loaded" style="height: 1em;" data-icon-name="fa-home" title="Title!" /></p>' +
            '</div>');

            // Setup fake SimpleSVG instance and load libraries
            // Load libraries
            load(SimpleSVG, local);

            // Empty image
            image = local.newImage(document.querySelector('#' + prefix + 'empty > i'), 'foo', {});
            result = local.getImageAttributes(image);
            expect(result).to.be.eql({});

            // Simple image
            image = local.newImage(document.querySelector('#' + prefix + 'simple > i'), 'foo', {});
            result = local.getImageAttributes(image);
            expect(result).to.be.eql({
                'class': ''
            });

            // Many attributes
            image = local.newImage(document.querySelector('#' + prefix + 'custom > i'), 'foo', {});
            result = local.getImageAttributes(image);
            expect(result).to.be.eql({
                'class': 'icon fa fa-home loaded',
                style: 'height: 1em;',
                'data-icon-name' : 'fa-home',
                title: 'Title!'
            });

            // Using class filter
            image = local.newImage(document.querySelector('#' + prefix + 'custom > i'), 'foo', {
                filterClasses: function(image, list) {
                    var results = [],
                        item;

                    for (var i = 0; i < list.length; i++) {
                        if (list[i] !== 'fa' && list[i].slice(0, 3) !== 'fa-') {
                            results.push(list[i]);
                        }
                    }

                    return results;
                },

                filterAttributes: function(image, list) {
                    delete list['data-icon-name'];
                    return list;
                }

            });
            result = local.getImageAttributes(image);
            expect(result).to.be.eql({
                'class': 'icon loaded',
                style: 'height: 1em;',
                title: 'Title!'
            });
        });
    });
})();
