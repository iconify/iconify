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

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });

            // Check if icon exists
            expect(storage.exists('test')).to.be.equal(true);
            expect(storage.exists('test2')).to.be.equal(false);
            expect(storage.list()).to.be.eql(['test']);

            // Check dimensions
            expect(storage.get('test').width).to.be.equal(20);
            expect(storage.get('test2')).to.be.equal(null);

            expect(storage.get('test').height).to.be.equal(16);
            expect(storage.get('test2')).to.be.equal(null);

            // Reset object to test storage scope
            storage = new Storage();

            storage.addIcon('test2', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });

            // Check if icon exists
            expect(storage.exists('test')).to.be.equal(false);
            expect(storage.exists('test2')).to.be.equal(true);
            expect(storage.list()).to.be.eql(['test2']);
        });

        it('multiple icons', function() {
            var storage = new Storage();

            storage.addIcon('foo-bar', {
                body: '<path d="" />',
                width: 48,
                height: 36
            });
            storage.addIcon('foo-baz', {
                body: '<path d="" />',
                width: 20,
                height: 20
            });

            // Check if icon exists
            expect(storage.exists('test')).to.be.equal(false);
            expect(storage.exists('foo-bar')).to.be.equal(true);
            expect(storage.exists('foo-baz')).to.be.equal(true);
            expect(storage.list()).to.be.eql(['foo-bar', 'foo-baz']);

            // Get width
            expect(storage.get('foo-bar').width).to.be.equal(48);
            expect(storage.get('foo-baz').width).to.be.equal(20);

            // Overwrite item
            storage.addIcon('foo-baz', {
                body: '<path d="" />',
                width: 16,
                height: 16
            });
            expect(storage.list()).to.be.eql(['foo-bar', 'foo-baz']);

            // Test width
            expect(storage.get('foo-bar').width).to.be.equal(48);
            expect(storage.get('foo-baz').width).to.be.equal(16);
        });

        it('library', function() {
            var storage = new Storage();

            storage.addIcon('single', {
                body: '<path d="" />',
                width: 48,
                height: 36
            });
            storage.addLibrary({
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
            storage.addLibrary({
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
            storage.addLibrary({
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
