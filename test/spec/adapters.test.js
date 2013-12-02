describe('toggle', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;
	var check;
	var originalLog;

	describe('console', function () {
		beforeEach(function () {
			check = miniwrite.buffer();
			write = miniwrite.log();
			miniwrite.assertMiniWrite(write);

			originalLog = console.log;
			console.log = function (str) {
				check.writeln(str);
			};
		});

		afterEach(function () {
			console.log = originalLog;
			originalLog = null;

			write = null;
			check = null;
		});

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

		it('writes to console.log ', function () {
			write.writeln('a');
			write.writeln('b b');
			write.writeln('ccc');
			assert.lengthOf(check.lines, 3);
			assert.deepEqual(check.lines, ['a', 'b b', 'ccc']);
		});

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
});
