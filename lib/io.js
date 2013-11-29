/*

 miniwrite

 https://github.com/Bartvds/miniwrite

 Copyright (c) 2013 Bart van der Schoor

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without mw.targets.lengthitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

/*jshint -W003*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var miniwrite = require('./miniwrite');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// node.js stream
//TODO add auto close?
function disk(file, linebreak) {
	var mw = miniwrite.base();
	mw.linebreak = (typeof linebreak !== 'undefined' ? linebreak : '\n');
	mw.enabled = true;
	mw.file = file;
	var stream;
	var initing = false;
	var buffer = miniwrite.buffer();
	var streaming = {
		writeln: function (line) {
			console.log('streaming >' + line + '<');
			stream.write(line + linebreak, 'utf8');
			/*var buff = new Buffer(line + linebreak, 'utf8');
			stream.write(buff);
			start += buff.length;
			console.log(start);*/
		}
	};
	var active = buffer;
	var splitter = miniwrite.splitter({
		writeln: function (line) {
			console.log('splitter >' + line + '<');
			active.writeln(line);
		}
	});
	function open(dest) {
		if (!stream && !initing) {
			initing = true;
			mkdirp(path.dirname(dest), function (err) {
				initing = false;
				if (err) {
					console.log(err);
					return;
				}
				stream = fs.createWriteStream(dest, {
					flags: 'w',
					encoding: 'utf8',
					mode: 0666
				});
				active = streaming;
				//blush buffer
				buffer.lines.forEach(function (line) {
					active.writeln(line);
				});
				buffer.clear();
			});
		}
	}

	mw.writeln = function (line) {
		if (mw.enabled) {
			if (!stream) {
				open(mw.file);
			}
			splitter.writeln(line);
		}
	};
	mw.flush = function (callback) {
		active = buffer;
		if (stream) {
			stream.on('finish', function () {
				callback(mw);
			});
			stream.end();
			stream = null;
			return;
		}
		process.nextTick(function () {
			callback(mw);
		});
	};
	mw.toString = function () {
		return '<miniwrite-stream>';
	};
	return mw;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = {
	disk: disk
};
