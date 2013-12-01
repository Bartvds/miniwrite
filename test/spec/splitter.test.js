describe('splitter', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib/miniwrite');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;
	var check;

	beforeEach(function () {
		check = miniwrite.buffer();
		write = miniwrite.splitter(check);
		miniwrite.assertMiniWrite(write);
	});

	afterEach(function () {
		write = null;
		check = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('splits lines', function () {
		write.writeln('a\nbb');
		assert.deepEqual(check.lines, ['a', 'bb']);
	});

	it('splits on custom split', function () {
		write = miniwrite.chars(check, /(.*?) +/g);
		write.write('aa bb cc');
		write.flush();
		assert.deepEqual(check.lines, ['aa', 'bb', 'cc']);
	});

	describe('xnix', function () {
		it('splits', function () {
			write.writeln('a\nbb\n\nccc');
			assert.deepEqual(check.lines, ['a', 'bb', '', 'ccc']);
		});

		it('splits leading', function () {
			write.writeln('\na\nbb\n\nccc');
			assert.deepEqual(check.lines, ['', 'a', 'bb', '', 'ccc']);
		});

		it('splits trailing', function () {
			write.writeln('a\nbb\n\nccc\n');
			assert.deepEqual(check.lines, ['a', 'bb', '', 'ccc', '']);
		});
	});

	describe('windows', function () {
		it('splits', function () {
			write.writeln('a\r\nbb\r\n\r\nccc');
			assert.deepEqual(check.lines, ['a', 'bb', '', 'ccc']);
		});

		it('splits leading', function () {
			write.writeln('\r\na\r\nbb\r\n\r\nccc');
			assert.deepEqual(check.lines, ['', 'a', 'bb', '', 'ccc']);
		});

		it('splits trailing', function () {
			write.writeln('a\r\nbb\r\n\r\nccc\r\n');
			assert.deepEqual(check.lines, ['a', 'bb', '', 'ccc', '']);
		});
	});

	describe('mixed', function () {
		it('splits', function () {
			write.writeln('a\r\n\nbb\r\n\r\nccc\r\n');
			assert.deepEqual(check.lines, ['a', '', 'bb', '', 'ccc', '']);
		});
	});

	//TODO old mac?

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('mutes on enabled', function () {
		assert.isTrue(write.enabled);
		write.writeln('aa');
		write.enabled = false;
		write.writeln('bb');
		write.enabled = true;
		write.writeln('cc');
		assert.deepEqual(check.lines, ['aa', 'cc']);
	});
});
