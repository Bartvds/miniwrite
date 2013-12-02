describe('multi', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;
	var one;
	var two;
	var three;

	beforeEach(function () {
		one = new miniwrite.buffer();
		two = new miniwrite.buffer();
		three = new miniwrite.buffer();

		write = miniwrite.multi([one, two, three]);
		miniwrite.assertMiniWrite(write);
	});

	afterEach(function () {
		write = null;
		one = null;
		two = null;
		three = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('splits lines', function () {
		write.writeln('aa');
		write.writeln('bb');
		write.writeln('cc');
		assert.deepEqual(one.lines, ['aa', 'bb', 'cc']);
		assert.deepEqual(two.lines, ['aa', 'bb', 'cc']);
		assert.deepEqual(three.lines, ['aa', 'bb', 'cc']);
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('mutes on enabled', function () {
		assert.isTrue(write.enabled);
		write.writeln('aa');
		write.enabled = false;
		write.writeln('bb');
		write.enabled = true;
		write.writeln('cc');
		assert.deepEqual(one.lines, ['aa', 'cc']);
		assert.deepEqual(two.lines, ['aa', 'cc']);
		assert.deepEqual(three.lines, ['aa', 'cc']);
	});
});
