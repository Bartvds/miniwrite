describe('peek', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib/miniwrite');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;
	var check;

	beforeEach(function () {
		check = miniwrite.buffer();
		write = miniwrite.peek(check, function (str) {
			return str;
		});
		miniwrite.assertMiniWrite(write);
	});

	afterEach(function () {
		write = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('basics', function () {
		write.writeln('aa');
		write.writeln('bb');
		write.writeln('cc');
		assert.deepEqual(check.lines, ['aa', 'bb', 'cc']);
	});

	it('basics', function () {
		write.writeln('aa');
		write.writeln('bb');
		write.writeln('cc');
		assert.deepEqual(check.lines, ['aa', 'bb', 'cc']);
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
