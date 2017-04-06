/**
 * Build test
 */
"use strict";

const fs = require('fs');

module.exports = (Helper, codeDir, testFile, TestHelper) => {
    let code = fs.readFileSync(testFile, 'utf8'),
        observerCode = fs.readFileSync(codeDir + '/browser/with-observer/observer.js', 'utf8');

    // Change observer code
    observerCode = TestHelper.replace(
        observerCode,
        '(function(SimpleSVG, local, config, global) {',
        'function Observer(SimpleSVG, local, global) { var config = local.config; ',
        'Could not find required code in observer.js'
    );

    observerCode = TestHelper.replace(
        observerCode,
        '})(SimpleSVG, local, local.config, global);',
        '}',
        'Could not find required code in observer.js (2)'
    );

    // Merge observer and test
    code = code.replace('/* Observer() */', observerCode);

    return code;
};
