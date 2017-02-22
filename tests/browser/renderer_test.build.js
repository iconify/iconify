/**
 * Build test
 */
"use strict";

const fs = require('fs');

module.exports = (Helper, codeDir, testFile) => {
    let code = fs.readFileSync(testFile, 'utf8'),
        modules = [
            '(function (SimpleSVG) {\n' +
            fs.readFileSync(codeDir + '/common/storage.js', 'utf8')
                .replace('module.exports = Storage;', 'SimpleSVG._Storage = Storage;') +
            '\n})(self.SimpleSVG);\n',
            fs.readFileSync(codeDir + '/browser/storage.js', 'utf8'),

            '(function (SimpleSVG) {\n' +
            fs.readFileSync(codeDir + '/common/svg.js', 'utf8')
                .replace('module.exports = SVG;', 'SimpleSVG._SVG = SVG;')
                .replace('require(\'./storage\')', 'SimpleSVG._Storage') +
            '\n})(self.SimpleSVG);\n',

            fs.readFileSync(codeDir + '/browser/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/with-api/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/config.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/image.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/finder.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/with-api/loader.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/renderer.js', 'utf8'),
        ];

    // Replace code
    modules = modules.map(item => item.replace('self.SimpleSVG', 'SimpleSVG')).join('');

    // Merge modules and test
    code = code.replace('/* Modules() */', modules);

    return code;
};
