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

		it('basics', function () {
			miniwrite.assertMiniWrite(write);
			assert.isTrue(write.enabled);
			assert.isArray(write.lines);
			assert.isFunction(write.concat);
			assert.deepEqual(write.lines, []);
		});

		it('write line', function () {
			write.writeln('a');
			assert.lengthOf(write.lines, 1);
			assert.deepEqual(write.lines, ['a']);
		});

		it('write multiple lines', function () {
			write.writeln('a');
			write.writeln('b b');
			write.writeln('ccc');
			assert.lengthOf(write.lines, 3);
			assert.deepEqual(write.lines, ['a', 'b b', 'ccc']);
		});

		it('clear', function () {
			write.writeln('a');
			write.writeln('b b');
			assert.lengthOf(write.lines, 2);
			write.clear();
			assert.deepEqual(write.lines, []);
		});

		it('does not splits linux lines', function () {
			write.writeln('a\nbb\n\nccc');
			assert.deepEqual(write.lines, ['a\nbb\n\nccc']);
		});

		it('does not splits windows lines', function () {
			write.writeln('a\r\nbb\r\n\r\nccc');
			assert.deepEqual(write.lines, ['a\r\nbb\r\n\r\nccc']);
		});

		it('get single line string', function () {
			write.writeln('a');
			assert.strictEqual(write.concat(), 'a\n');
		});

		it('get concatenated lines string', function () {
			write.writeln('a');
			write.writeln('b b');
			write.writeln('');
			write.writeln('ccc');
			assert.strictEqual(write.concat(), 'a\nb b\n\nccc\n');
		});

		it('get concatenated lines custom string', function () {
			write.writeln('a');
			write.writeln('b b');
			write.writeln('');
			write.writeln('ccc');
			assert.strictEqual(write.concat('X', '_'), '_aX_b bX_X_cccX');
		});
	});
});
