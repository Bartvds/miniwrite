describe('disk', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var miniwrite = require('../../lib/miniwrite');
	var miniio = require('../../lib/io');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


	beforeEach(function () {
	});

	afterEach(function () {
	});

	function getDest(name) {
		return './test/tmp/disk/' + name + '.txt';
	}

	function diskTest(name, lines, seperator, done) {
		var dest = getDest(name);
		var check = miniwrite.buffer();
		var disk = miniio.disk(dest, seperator);
		miniwrite.assertMiniWrite(disk);

		var multi = miniwrite.multi([check, disk]);
		lines.forEach(function (line) {
			multi.writeln(line);
		});
		assert.deepEqual(check.lines, lines, 'pretest');

		disk.flush(function () {
			var expected = check.concat(seperator);
			var actual = helper.readFile(dest);
			assert.strictEqual(actual, expected);
			done();
		});
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('basics', function () {
		var dest = getDest('basic');
		var disk = miniio.disk(getDest('basic'));
		miniwrite.assertMiniWrite(disk);
		assert.strictEqual(disk.file, dest);
		assert.strictEqual(disk.linebreak, '\n');
	});

	it('word', function (done) {
		diskTest('word', [
			'aabbcc'
		], '\n', done);
	});

	it('lines', function (done) {
		diskTest('lines', [
			'aa',
			'bb',
			'cc'
		], '\n', done);
	});

	it('split', function (done) {
		diskTest('split', [
			'aa\nbb\ncc',
		], '\n', done);
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('async', function (done) {
		var dest = getDest('async');
		var separator = '\n';
		var check = miniwrite.buffer();
		var disk = miniio.disk(dest, separator);
		var multi = miniwrite.multi([check, disk]);

		var queue = [
			['aa', 'bb'],
			[ 'cc'],
			['dd', 'ee'],
			null,
			['gg'],
			null,
			['hh', 'ii'],
			null,
			['jj'],
			['kk', 'll'],
			['mm']
		];

		var step = function (callback) {
			setTimeout(function () {
				if (queue.length === 0) {
					callback();
					return;
				}
				var lines = queue.shift();
				console.log('lines');
				console.log(lines);
				if (!lines) {
					console.log('flush');
					disk.flush(function () {
						console.log('done flush');
						step(callback);
					});
					return;
				}
				lines.forEach(function (line) {
					multi.writeln(line);
				});
				step(callback);
			}, 50);
		};

		step(function (err) {
			if (err) {
				done(err);
				return;
			}
			disk.flush(function (err) {
				var expected = check.concat(separator);
				var actual = helper.readFile(dest);
				assert.strictEqual(actual, expected);
				done(err);
			});
		});
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('mutes on enabled', function (done) {
		var dest = getDest('mutes');
		var separator = '\n';
		var check = miniwrite.buffer();
		var disk = miniio.disk(dest, separator);
		var multi = miniwrite.multi([check, disk]);
		assert.isTrue(multi.enabled);

		multi.writeln('aa');
		multi.enabled = false;
		multi.writeln('bb');
		multi.enabled = true;
		multi.writeln('cc');

		disk.flush(function () {
			var expected = check.concat(separator);
			var actual = helper.readFile(dest);
			assert.strictEqual(actual, expected);
			done();
		});
	});
});
