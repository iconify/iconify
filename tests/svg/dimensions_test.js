"use strict";

(function() {
    var isBrowser = (typeof module !== 'object' || !module.exports);

    var SVG = isBrowser ? SimpleSVG.modules.Storage : require('../../src/node/svg');
    var Storage = isBrowser ? SimpleSVG.modules.Storage : require('../../src/common/storage');

    var chai = isBrowser ? self.chai : require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing item dimensions', function() {
        it('numbers', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 48,
                height: 36
            });
            svg = new SVG(storage.get('test'));

            // Test default numbers
            expect(svg.width(36)).to.be.equal(48);
            expect(svg.height(48)).to.be.equal(36);

            // Test custom width
            expect(svg.height(24)).to.be.equal(18);
            expect(svg.height(30)).to.be.equal(22.5);
            expect(svg.height(99)).to.be.equal(74.25);

            // Test custom height
            expect(svg.width(18)).to.be.equal(24);
            expect(svg.width(74.25)).to.be.equal(99);

            // Test floating numbers
            expect(svg.width(100 / 3)).to.be.equal(44.45);
            expect(svg.height(11.1111111)).to.be.equal(8.34);
            expect(svg.height(11.1111111, 1000)).to.be.equal(8.334);
        });

        it('strings', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 48,
                height: 36
            });
            svg = new SVG(storage.get('test'));

            // Test strings without units
            expect(svg.height('48')).to.be.equal('36');

            // Test units
            expect(svg.height('48px')).to.be.equal('36px');
            expect(svg.height('24%')).to.be.equal('18%');
            expect(svg.height('1em')).to.be.equal('0.75em');
            expect(svg.width('1em')).to.be.equal('1.34em');
            expect(svg.width('1em', 1000)).to.be.equal('1.334em');

            // Custom units with space
            expect(svg.height('24 Whatever')).to.be.equal('18 Whatever');

            // Numbers after unit should be parsed too
            expect(svg.height('48% + 5em')).to.be.equal('36% + 3.75em');
            expect(svg.width('calc(1em + 8px)')).to.be.equal('calc(1.34em + 10.67px)');

            // Browser prefix should work
            expect(svg.height('-webkit-calc(1em + 8px)')).to.be.equal('-webkit-calc(0.75em + 6px)');

            // Invalid units
            expect(svg.height('-.')).to.be.equal('-.');
            expect(svg.width('@foo')).to.be.equal('@foo');
        });
    });
})();
