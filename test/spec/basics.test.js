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

	describe('test', function () {

		it('detects first correctly', function () {
			write = miniwrite.base();
			assert.isObject(write);
			assert.isFunction(write.writeln);
		});

		it('isMiniWrite', function () {
			assert.isFalse(miniwrite.isMiniWrite(null));
			assert.isFalse(miniwrite.isMiniWrite({}));
			assert.isFalse(miniwrite.isMiniWrite({writeln: {}}));
			assert.isTrue(miniwrite.isMiniWrite({writeln: function () {
				//dummy
			}}));
			assert.isTrue(miniwrite.isMiniWrite(miniwrite.base()));
		});

		it('assertMiniWrite', function () {
			assert.throws(function () {
				miniwrite.assertMiniWrite(null);
			});
			assert.throws(function () {
				miniwrite.assertMiniWrite({});
			});
			assert.throws(function () {
				miniwrite.assertMiniWrite({writeln: {}});
			});
			miniwrite.assertMiniWrite({writeln: function () {
				//dummy
			}});
			miniwrite.assertMiniWrite(miniwrite.base());
		});
	});
});
