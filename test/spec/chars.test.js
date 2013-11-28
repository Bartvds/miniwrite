describe('chars', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib/miniwrite');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;
	var check;

	beforeEach(function () {
		check = miniwrite.buffer();
		write = miniwrite.chars(check);
		miniwrite.assertMiniWrite(write);
		assert.equal(write.target, check);
	});

	afterEach(function () {
		write = null;
		check = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('doesn\'t flush loose chars', function () {
		write.write('aa');
		write.write('bb');
		write.write('cc');
		assert.deepEqual(check.lines, []);
	});

	it('flushes buffered chars with writeln()', function () {
		write.write('aa');
		write.write('bb');
		write.writeln('cc');
		assert.deepEqual(check.lines, ['aabbcc']);
	});

	it('flushes on writeln()', function () {
		write.writeln('aa');
		write.writeln('bb');
		write.writeln('cc');
		assert.deepEqual(check.lines, ['aa', 'bb', 'cc']);
	});

	it('flushes mixed buffered chars with writeln()', function () {
		write.write('aa');
		write.writeln('');
		write.writeln('');
		write.write('bb');
		write.writeln('');
		write.writeln('');
		write.write('cc');
		write.writeln('');
		write.writeln('');
		assert.deepEqual(check.lines, ['aa', '', 'bb', '', 'cc', '']);
	});

	it('flushes loose chars after flush()', function () {
		write.write('aa');
		write.write('bb');
		write.write('cc');
		write.flush();
		assert.deepEqual(check.lines, ['aabbcc']);
	});

	it('doesn\'t flush loose chars after flush()true', function () {
		write.write('aa');
		write.write('bb');
		write.write('cc');
		write.flush(false);
		assert.deepEqual(check.lines, ['aabbcc']);
	});

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
