"use strict";

(function() {
    var isBrowser = (typeof module !== 'object' || !module.exports);

    var Storage = isBrowser ? SimpleSVG.modules.Storage : require('../../src/common/storage');

    var chai = isBrowser ? self.chai : require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing items storage', function() {
        it('one simple icon', function() {
            var storage = new Storage();

            storage.addIcon('test-icon', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });

            // Check if icon exists
            expect(storage.exists('test-icon')).to.be.equal(true);
            expect(storage.exists('test:icon')).to.be.equal(true);
            expect(storage.exists('icon', 'test')).to.be.equal(true); // Prefix specified separately
            expect(storage.exists('test')).to.be.equal(false);
            expect(storage.exists('icon')).to.be.equal(false);
            expect(storage.exists('test-icon2')).to.be.equal(false);
            expect(storage.exists('test-icon', '')).to.be.equal(false); // Wrong prefix
            expect(storage.list()).to.be.eql(['test:icon']);

            // Check dimensions
            expect(storage.get('test-icon').width).to.be.equal(20);
            expect(storage.get('test-icon2')).to.be.equal(null);

            expect(storage.get('test:icon').height).to.be.equal(16);
            expect(storage.get('test-icon2')).to.be.equal(null);

            // Reset object to test storage scope
            storage = new Storage();

            storage.addIcon('test:icon2', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });

            // Check if icon exists
            expect(storage.exists('test-icon')).to.be.equal(false);
            expect(storage.exists('test-icon2')).to.be.equal(true);
            expect(storage.list()).to.be.eql(['test:icon2']);
        });

        it('multiple icons', function() {
            var storage = new Storage();

            storage.addIcon('foo-bar', {
                body: '<path d="" />',
                width: 48,
                height: 36
            });
            storage.addIcon('foo:baz', {
                body: '<path d="" />',
                width: 20,
                height: 20
            });
            storage.addIcon('foo-suffixed:baz-suffixed', {
                body: '<path d="" />',
                width: 20,
                height: 20
            });

            // Check if icon exists
            expect(storage.exists('test')).to.be.equal(false);
            expect(storage.exists('foo-bar')).to.be.equal(true);
            expect(storage.exists('foo-baz')).to.be.equal(true);
            expect(storage.exists('foo:baz')).to.be.equal(true);
            expect(storage.exists('foo-suffixed:baz-suffixed')).to.be.equal(true);
            expect(storage.exists('foo-suffixed-baz-suffixed')).to.be.equal(false); // Wrong prefix
            expect(storage.list()).to.be.eql(['foo:bar', 'foo:baz', 'foo-suffixed:baz-suffixed']);

            // Get width
            expect(storage.get('foo-bar').width).to.be.equal(48);
            expect(storage.get('foo:baz').width).to.be.equal(20);

            // Overwrite item
            storage.addIcon('foo-baz', {
                body: '<path d="" />',
                width: 16,
                height: 16
            });
            expect(storage.list()).to.be.eql(['foo:bar', 'foo:baz', 'foo-suffixed:baz-suffixed']);

            // Test width
            expect(storage.get('foo-bar').width).to.be.equal(48);
            expect(storage.get('foo:baz').width).to.be.equal(16);
        });

        it('default attributes', function() {
            var storage = new Storage();

            // check if inline attributes are fine
            storage.addIcon('test-icon1', {
                body: '<path d="" />',
                width: 48,
                height: 36,
                inlineTop: -4,
                inlineHeight: 44
            });

            // test inlineTop
            storage.addIcon('foo-bar', {
                body: '<path d="" />',
                width: 48,
                height: 49, // %7 == 0 --> verticalAlign should be -1/7
                top: -5
            });

            // Check if icons exist
            expect(storage.exists('test-icon1')).to.be.equal(true);
            expect(storage.exists('foo-bar')).to.be.equal(true);

            // Get data
            expect(storage.get('test-icon1')).to.be.eql({
                body: '<path d="" />',
                width: 48,
                height: 36,
                inlineHeight: 44,
                left: 0,
                top: 0,
                inlineTop: -4,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.125
            });

            expect(storage.get('foo-bar')).to.be.eql({
                body: '<path d="" />',
                width: 48,
                height: 49,
                inlineHeight: 49,
                left: 0,
                top: -5,
                inlineTop: -5,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.143
            });
        });

        it('collection', function() {
            var storage = new Storage();

            storage.addIcon('single', {
                body: '<path d="" />',
                width: 48,
                height: 36
            });
            storage.addCollection({
                icons: {
                    icon1: {
                        body: '<path d="" />'
                    },
                    icon2: {
                        body: '<path d="" />',
                        width: 20
                    },
                    icon3: {
                        body: '<path d="" />',
                        height: 20
                    },
                    icon4: {
                        // missing body - invalid icon
                        height: 20
                    }
                },
                width: 16,
                height: 16
            });

            // Check if icons exist
            expect(storage.list()).to.be.eql(['single', 'icon1', 'icon2', 'icon3']);

            // Get width
            expect(storage.get('icon1').width).to.be.equal(16);
            expect(storage.get('icon2').width).to.be.equal(20);
            expect(storage.get('icon3').width).to.be.equal(16);

            // Get height
            expect(storage.get('icon1').height).to.be.equal(16);
            expect(storage.get('icon2').height).to.be.equal(16);
            expect(storage.get('icon3').height).to.be.equal(20);

            // Add items without width
            storage.addCollection({
                icons: {
                    icon11: {
                        // missing width - invalid icon
                        body: '<path d="" />'
                    },
                    icon12: {
                        body: '<path d="" />',
                        width: 20
                    },
                    icon13: {
                        // missing width - invalid icon
                        body: '<path d="" />',
                        height: 20
                    },
                    icon14: {
                        // missing body - invalid icon
                        height: 20
                    }
                },
                height: 16
            });

            // Check if icons exist
            expect(storage.list()).to.be.eql(['single', 'icon1', 'icon2', 'icon3', 'icon12']);

            // Add aliases
            storage.addCollection({
                icons: {
                    icon21: {
                        body: '<path d="" />',
                        width: 20,
                        height: 20
                    }
                },
                aliases: {
                    alias1: {
                        parent: 'icon1'
                    },
                    alias2: {
                        parent: 'icon2',
                        width: 24
                    },
                    alias3: {
                        parent: 'icon19'
                    }
                }
            });

            // Check if icons exist
            expect(storage.list()).to.be.eql(['single', 'icon1', 'icon2', 'icon3', 'icon12', 'icon21', 'alias1', 'alias2']);

            // Check width
            expect(storage.get('icon21').width).to.be.equal(20);
            expect(storage.get('alias1').width).to.be.equal(16);
            expect(storage.get('alias2').width).to.be.equal(24);
        });
    });
})();
