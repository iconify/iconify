"use strict";

(function() {
    var isBrowser = (typeof module !== 'object' || !module.exports);

    var Storage = isBrowser ? Iconify.modules.Storage : require('../../src/common/storage');

    var chai = isBrowser ? self.chai : require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing items storage', function() {
        it('adding icon', function() {
            var storage = new Storage(),
                result;

            var expected = {
                body: '<path d="" />',
                width: 20,
                height: 16,
                inlineHeight: 16,
                left: 0,
                top: 0,
                inlineTop: 0,
                verticalAlign: -0.125,
                rotate: 0,
                vFlip: false,
                hFlip: false
            };

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
            expect(storage.exists('test-icon', '')).to.be.equal(true); // Empty prefix = auto-detect since version 1.0.0

            // Check data
            expect(storage.getIcon('test-icon')).to.be.eql(expected);
            expect(storage.getIcon('test:icon')).to.be.eql(expected);
            expect(storage.getIcon('test-icon', '')).to.be.eql(expected);
            expect(storage.getIcon('test-icon2')).to.be.equal(null);
            expect(storage.getIcon('test-icon2')).to.be.equal(null);

            // Test modifying data. modifying getIcon result should change data
            storage.getIcon('test-icon').body = 'modified!';
            expect(storage.getIcon('test-icon')).to.not.be.eql(expected);
        });

        it('adding aliases', function() {
            var storage = new Storage();

            var expected = {
                body: '<path d="" />',
                width: 20,
                height: 16,
                inlineHeight: 16,
                left: 0,
                top: 0,
                inlineTop: 0,
                verticalAlign: -0.125,
                rotate: 0,
                vFlip: false,
                hFlip: false
            };

            storage.addIcon('test-prefix:icon1', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            storage.addIcon('test-prefix:alias1', {
                parent: 'test-prefix:icon1',
                height: 18,
                rotate: 1
            });

            // Check if icon exists
            expect(storage.exists('test-prefix:icon1')).to.be.equal(true);
            expect(storage.exists('test-prefix:alias1')).to.be.equal(true);

            // Check data
            expect(storage.getIcon('test-prefix:icon1')).to.be.eql(expected);
            expected.height = expected.inlineHeight = 18;
            expected.rotate = 1;
            expect(storage.getIcon('test-prefix:alias1')).to.be.eql(expected);

            // Test modifying data. modifying copyIcon result should not change data
            storage.copyIcon('test-prefix:alias1').body = 'modified!';
            expect(storage.getIcon('test-prefix:alias1')).to.be.eql(expected);
        });

        it('nested aliases', function() {
            var storage = new Storage();

            var expected = {
                body: '<path d="" />',
                width: 20,
                height: 16,
                inlineHeight: 16,
                left: 0,
                top: 0,
                inlineTop: 0,
                verticalAlign: -0.125,
                rotate: 0,
                vFlip: false,
                hFlip: false
            };

            storage.addIcon('alias2', {
                parent: 'alias1',
                height: 22,
                rotate: 1,
                hFlip: true
            }, 'test-prefix');
            storage.addIcon('test-prefix:alias1', {
                parent: 'test-prefix:icon1',
                height: 18,
                rotate: 1
            });
            storage.addIcon('test-prefix:icon1', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });

            // Check if icon exists
            expect(storage.exists('test-prefix:icon1')).to.be.equal(true);
            expect(storage.exists('alias2', 'test-prefix')).to.be.equal(true);
            expect(storage.exists('test-prefix:alias2')).to.be.equal(true);

            // Check data
            expected.height = expected.inlineHeight = 22;
            expected.rotate = 2;
            expected.hFlip = true;
            expect(storage.getIcon('test-prefix:alias2')).to.be.eql(expected);
            expect(storage.getIcon('alias2', 'test-prefix')).to.be.eql(expected);
        });

        it('blank icon', function() {
            expect(Storage.blankIcon()).to.be.eql({
                body: '',
                width: 16,
                height: 16,
                inlineHeight: 16,
                left: 0,
                top: 0,
                inlineTop: 0,
                rotate: 0,
                vFlip: false,
                hFlip: false,
                verticalAlign: -0.125
            });
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
            expect(storage.getIcon('test-icon1')).to.be.eql({
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

            expect(storage.getIcon('foo-bar')).to.be.eql({
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
            expect(storage.getIcon('icon1').width).to.be.equal(16);
            expect(storage.getIcon('icon2').width).to.be.equal(20);
            expect(storage.getIcon('icon3').width).to.be.equal(16);

            // Get height
            expect(storage.getIcon('icon1').height).to.be.equal(16);
            expect(storage.getIcon('icon2').height).to.be.equal(16);
            expect(storage.getIcon('icon3').height).to.be.equal(20);
        });

        it('collection with errors', function() {
            var storage = new Storage();

            storage.addCollection({
                prefix: 'foo-bar',
                icons: {
                    icon11: {
                        // missing width
                        body: '<path d="" />'
                    },
                    icon12: {
                        body: '<path d="" />',
                        width: 20
                    },
                    icon13: {
                        // missing width
                        body: '<path d="" />',
                        height: 20
                    },
                    icon14: {
                        // missing body - will not be added
                        height: 20
                    }
                },
                aliases: {
                    alias11: {
                        parent: 'icon11'
                    },
                    alias15: {
                        parent: 'icon15'
                    }
                },
                height: 16
            });

            // Check if icons exist
            expect(storage.list()).to.be.eql(['foo-bar:icon11', 'foo-bar:icon12', 'foo-bar:icon13', 'foo-bar:alias11', 'foo-bar:alias15']);

            // Check that invalid icons cannot resolve
            expect(storage.getIcon('foo-bar:icon14')).to.be.equal(null);
            expect(storage.getIcon('foo-bar:alias15')).to.be.equal(null);
        });

        it('collection with aliases', function() {
            var storage = new Storage();

            // Add aliases
            storage.addCollection({
                icons: {
                    'foo-icon1': {
                        body: '<path d="" />',
                        width: 20,
                        height: 20
                    }
                },
                aliases: {
                    'foo-alias1': {
                        parent: 'foo-icon1',
                        width: 24
                    },
                    'foo-alias2': {
                        // parent will be added later
                        parent: 'foo-alias4',
                        height: 22
                    },
                    'foo-alias3': {
                        // parent is another alias added before
                        parent: 'foo-alias1',
                        height: 30
                    },
                    'foo-alias4': {
                        parent: 'foo-icon1',
                        height: 21,
                        inlineHeight: 21
                    },
                    'foo-alias5': {
                        // no such parent
                        parent: 'foo-icon5'
                    },
                    'foo-alias6': {
                        // loop
                        parent: 'foo-alias6'
                    }
                }
            });

            // Check if icons exist
            expect(storage.list()).to.be.eql(['foo:icon1', 'foo:alias1', 'foo:alias2', 'foo:alias3', 'foo:alias4', 'foo:alias5', 'foo:alias6']);

            // Check icon and all aliases
            expect(storage.getIcon('foo:icon1')).to.be.eql({
                body: '<path d="" />',
                width: 20,
                height: 20,
                inlineHeight: 20,
                left: 0,
                top: 0,
                inlineTop: 0,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.125
            });

            expect(storage.getIcon('foo:alias1')).to.be.eql({
                body: '<path d="" />',
                width: 24,
                height: 20,
                inlineHeight: 20,
                left: 0,
                top: 0,
                inlineTop: 0,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.125
            });

            expect(storage.getIcon('foo:alias2')).to.be.eql({
                body: '<path d="" />',
                width: 20,
                height: 22,
                inlineHeight: 21,
                left: 0,
                top: 0,
                inlineTop: 0,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.125
            });

            expect(storage.getIcon('foo:alias3')).to.be.eql({
                body: '<path d="" />',
                width: 24,
                height: 30,
                inlineHeight: 30,
                left: 0,
                top: 0,
                inlineTop: 0,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.125
            });


            expect(storage.getIcon('foo:alias4')).to.be.eql({
                body: '<path d="" />',
                width: 20,
                height: 21,
                inlineHeight: 21,
                left: 0,
                top: 0,
                inlineTop: 0,
                hFlip: false,
                vFlip: false,
                rotate: 0,
                verticalAlign: -0.143
            });

            expect(storage.getIcon('foo:alias5')).to.be.equal(null);
            expect(storage.getIcon('foo:alias6')).to.be.equal(null);
        });

        it('collection with prefix', function() {
            var storage = new Storage();

            // Add collection with prefix
            storage.addCollection({
                prefix: 'test-prefix',
                icons: {
                    'icon-name100': {
                        body: '<path d="" />',
                        width: 20,
                        height: 20
                    },
                    icon52: {
                        body: '<path d="" />',
                        width: 25,
                        height: 30
                    }
                },
                aliases: {
                    alias51: {
                        parent: 'icon-name100'
                    },
                    alias52: {
                        parent: 'icon52',
                        width: 24,
                        rotate: 1
                    },
                    alias53: {
                        parent: 'missing-icon53'
                    }
                }
            });

            // Check if icons exist
            expect(storage.list()).to.be.eql(['test-prefix:icon-name100', 'test-prefix:icon52', 'test-prefix:alias51', 'test-prefix:alias52', 'test-prefix:alias53']);

            // Check width
            expect(storage.getIcon('test-prefix:icon-name100').width).to.be.equal(20);
            expect(storage.getIcon('test-prefix:alias51').width).to.be.equal(20);
            expect(storage.getIcon('test-prefix:alias52').width).to.be.equal(24);
        });
    });
})();
