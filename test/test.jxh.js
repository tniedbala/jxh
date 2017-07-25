const fs = require('fs');
const assert = require('assert');
const jxh_103 = require('jxh');
const jxh_104 = require('../dist/jxh');
const { standardTests, bugfix }  = require('./test.jxh.setup');

// versions tested
const v103 = 'v1.0.3';
const v104 = 'v1.0.4';

// altIndent args
const indentArgs = {
    indentStr: '\t',
    indentLevel: 3
}

// ----------------------------------------
// mocha  
describe('Test: jxh v1.0.4', function() {

    // render jxh output to log files following tests
    after(function() {
        logTest('test.jxh.default.log', standardTests, jxh_103, jxh_104, v103, v104);
        logTest('test.jxh.altIndent.log', standardTests, jxh_103, jxh_104, v103, v104, indentArgs);
        logTest('test.jxh.bugfix.log', bugfix, jxh_103, jxh_104, v103, v104);
    });

    // standard functionality - for default & alt indent arguments
    describe('Standard Functionality', function() {
        
        describe('Default Parameters', function() {
            runTest(standardTests, jxh_103, jxh_104, assert.equal);
        });
        describe('Alt. Indent', function() {
            runTest(standardTests, jxh_103, jxh_104, assert.equal, indentArgs);
        });
    });

    // test bug fixes (need to review bugfix.log)
    describe('Bug Fixes', function() {
        runTest(bugfix, jxh_103, jxh_104, assert.notEqual);
    });
});

// ----------------------------------------
// bulk testing & logging functions

// render & test each object in testObject using different jxh versions
function runTest(testObject, jxh1, jxh2, assertion, indentArgs=null) {
    for (let test in testObject) {
        let obj = testObject[test];
        let args = indentArgs ? [obj, indentArgs.indentStr, indentArgs.indentLevel] : [obj];
        it(test, function() {
            assertion(
                jxh1.apply(this, args), 
                jxh2.apply(this, args)
            );
        });
    }
}
// writes test output to log file
function logTest(fileName, testObj, jxh1, jxh2, jxh1Version, jxh2Version, indentArgs) {
    let logFile = `${__dirname}/log/${fileName}`;
    let sep = '-'.repeat(40);
    // clear file contents
    fs.writeFile(logFile, '', err => {
        if (err) throw err;
    });
    // log each test
    for (let test in testObj) {
        let obj = testObj[test];
        let args = indentArgs ? [obj, indentArgs.indentStr, indentArgs.indentLevel] : [obj];
        testName = [sep, test, sep].join('\n');
        let testOut = [
            testName,
            jxh1Version,
            jxh1.apply(this, args), 
            jxh2Version, 
            jxh2.apply(this, args)
        ];
        fs.appendFileSync(logFile, (testOut.join('\n') + '\n\n'), err => {
            if (err) throw err;
        });
    }
}
