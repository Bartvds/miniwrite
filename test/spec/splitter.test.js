describe('basics', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib/miniwrite');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;

	afterEach(function () {
		write = null;
	});

	describe('buffer', function () {

		beforeEach(function () {
			write = miniwrite.buffer();
		});
	});

	describe('splitter', function () {

		beforeEach(function () {
			write = miniwrite.splitter(miniwrite.buffer());
		});

		it('splits linux lines', function () {
			write.writeln('a\nbb\n\nccc\n');
			assert.deepEqual(write.target.lines, ['a', 'bb', '', 'ccc', '']);
		});

		it('splits windows lines', function () {
			write.writeln('a\r\nbb\r\n\r\nccc\r\n');
			assert.deepEqual(write.target.lines, ['a', 'bb', '', 'ccc', '']);
		});
	});
});
