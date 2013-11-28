describe('toggle', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib/miniwrite');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var write;
	var one;
	var two;

	beforeEach(function () {
		one = miniwrite.buffer();
		two = miniwrite.buffer();
		write = miniwrite.toggle(one, two);
		miniwrite.assertMiniWrite(write);
	});

	afterEach(function () {
		write = null;
		one = null;
		two = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('sets active', function () {
		var aa = miniwrite.buffer();
		var bb = miniwrite.buffer();

		write = miniwrite.toggle(aa, bb);
		assert.equal(write.main, aa);
		assert.equal(write.alt, bb);
		assert.equal(write.active, aa);

		write.swap();
		assert.equal(write.main, aa);
		assert.equal(write.alt, bb);
		assert.equal(write.active, bb);

		write.swap();
		assert.equal(write.main, aa);
		assert.equal(write.alt, bb);
		assert.equal(write.active, aa);
	});

	it('routes flow', function () {
		write.writeln('aa');
		write.swap();
		write.writeln('bb');
		write.swap();
		write.writeln('cc');
		write.swap();
		write.writeln('dd');

		assert.deepEqual(write.main.lines, ['aa', 'cc']);
		assert.deepEqual(write.alt.lines, ['bb', 'dd']);
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
		assert.deepEqual(two.lines, []);
	});
});
