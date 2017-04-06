/**
 * Build test
 */
"use strict";

const fs = require('fs');

module.exports = (Helper, codeDir, testFile, TestHelper) => {
    let code = fs.readFileSync(testFile, 'utf8'),
        modules = [
            // Core
            TestHelper.fakeEvents(),
            TestHelper.fakeInit(),

            // Common files
            TestHelper.getStorage(),
            fs.readFileSync(codeDir + '/browser/storage.js', 'utf8'),
            TestHelper.getSVG(),

            // Files needed for test
            fs.readFileSync(codeDir + '/browser/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/with-cdn/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/config.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/image.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/finder.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/with-cdn/loader.js', 'utf8'),

            // Main file
            fs.readFileSync(codeDir + '/browser/renderer.js', 'utf8'),
        ];

    // Replace code
    modules = modules.join('');

    // Merge modules and test
    code = code.replace('/* Modules() */', modules);

    return code;
};
