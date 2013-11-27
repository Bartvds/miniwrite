'use strict';

var chai = require('chai');
chai.Assertion.includeStack = true;
var assert = chai.assert;

var grunt = require('grunt');

function readJSON(src) {
	if (grunt.file.exists(src)) {
		return grunt.file.readJSON(src);
	}
	console.log('mssing file: ' + src);
	return {};
}

function writeJSON(src, value) {
	grunt.file.write(src, JSON.stringify(value, null, '\t'));
}

module.exports = {
	readJSON: readJSON,
	writeJSON: writeJSON,
	chai: chai,
	assert: assert
};
