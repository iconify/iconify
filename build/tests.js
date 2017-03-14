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
 * Build tests
 */
"use strict";

const fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    Helper = require('./_helper');

let sourceDir = 'tests',
    targetDir = 'debug',
    codeDir = 'src',
    tests = [];

let resolvedSourceDir = path.resolve(__dirname, '../' + sourceDir),
    resolvedTargetDir = path.resolve(__dirname, '../' + targetDir),
    resolvedCodeDir = path.resolve(__dirname, '../' + codeDir);

// Find all files, parse them
glob(resolvedSourceDir + '/**/*.js', {
    dot: true
}, (err, files) => {
    files.forEach(file => {
        if (file.slice(-9) === '.build.js') {
            let code = require(file)(Helper, resolvedCodeDir, file.replace('.build.', '.test.')),
                targetFile = resolvedTargetDir + file.slice(resolvedSourceDir.length).replace('.build.', '.');

            Helper.mkdir(path.dirname(targetFile));
            fs.writeFileSync(targetFile, code, 'utf8');

            let test = targetDir + targetFile.slice(resolvedTargetDir.length);
            console.log('Compiled test:', test);
            tests.push(test);
            return;
        }

        if (file.slice(-11) === '.browser.js') {
            let test = sourceDir + file.slice(resolvedSourceDir.length);
            console.log('Browser specific test:', test);
            tests.push(test);
            return;
        }
    });

    let time = Date.now();
    fs.writeFileSync(resolvedTargetDir + '/tests.js',
        '/* generated by build tool: node build/test */\n' +
        tests.map(file => 'document.write(\'<script src="' + file + '?t=' + time + '"></script>\');').join('\n')
    );
    console.log('Saved list of tests to', resolvedTargetDir + '/tests.js');
    console.log('Open tests.html in browser to run tests.');
});
