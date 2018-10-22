(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(Iconify, local) {
        var global = {};

        if (Iconify.isReady === void 0) {
            Iconify.isReady = true;
        }

        local.config = {};

        /* Modules() */
    }

    describe('Testing image object', function() {
        it('filtering attributes and classes', function() {
            var Iconify = {},
                local = {},
                prefix = 'image-id-',
                image, result;

            // Add dummy code
            jQuery('#debug').append('<div>' +
                '<p id="' + prefix + 'empty">Icon without attributes: <i /></p>' +
                '<p id="' + prefix + 'basic">Icon with basic attributes: <i class="iconify svg-loading" data-icon="icon-name" /></p>' +
                '<p id="' + prefix + 'custom">Icon with many attributes: <i class="icon fa fa-home svg-loading loaded" style="height: 1em;" data-icon-name="fa-home" title="Title!" /></p>' +
            '</div>');

            // Setup fake Iconify instance and load libraries
            // Load libraries
            load(Iconify, local);

            // Empty image
            image = local.newImage(document.querySelector('#' + prefix + 'empty > i'), 'foo', {});
            result = local.getImageAttributes(image);
            expect(result).to.be.eql({});

            // Basic image
            image = local.newImage(document.querySelector('#' + prefix + 'basic > i'), 'foo', {});
            result = local.getImageAttributes(image);
            expect(result).to.be.eql({
                'class': 'iconify',
                'data-icon': 'icon-name'
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
