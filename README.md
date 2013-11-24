# miniwrite

[![Build Status](https://secure.travis-ci.org/Bartvds/miniwrite.png?branch=master)](http://travis-ci.org/Bartvds/miniwrite) [![Dependency Status](https://gemnasium.com/Bartvds/miniwrite.png)](https://gemnasium.com/Bartvds/miniwrite) [![NPM version](https://badge.fury.io/js/miniwrite.png)](http://badge.fury.io/js/miniwrite)

> Minimal semantic output styler/writer API with default implementations.

A simple pluggable output writer and styler/coloriser to embed in (development) tools and reporters. Offer a standard interface for customisable styled text output. The minimalistic semantic API allows for easy partial methods overwrites to suit any environment.

**Note:** Experimental abstraction but concept is organically grown over many reporter projects.

## Usage pattern

* Module authors expose an initialisation step where consumers can supply their own `miniwrite` instances.
* Module users define their own `miniwrite` instance to control the output modes of various tools.
* Adapting to alternate (real) streams is as easy as overwriting the `mw.writeln()` of any bundled preset.
* Creative developers can rig `miniwrite` for practical solutions.
	* For example use the bundled splitter/buffer adapters to route or assert output: use a plain text for assertions, a fancy color mode as display while logging to HTML file for later review.


Keep in mind:  

* Miniwrite is not a logging framework (use `miniwrite` to compose one)
* Miniwrite is not a full featured semantic output framework (use `miniwrite` to compose one)
* Miniwrite is not a string formatter or `printf` alternate (if needed this happens before `miniwrite` is called)

## API

Main usage:
````js
// let's use a Node.js compatible console.log() + ANSI colors 
var mw = miniwrite.createANSI();

// write plain text line
mw.writeln('plain in the rain');
mw.writeln('');

// semantic stylers and color conventions
var str = mw.success('good green');
var str = mw.accent('flashy cyan');
var str = mw.warning('annoying yellow');
var str = mw.error('bad red');
var str = mw.muted('ignorable grey');

// combine to write stylized output
mw.writeln('this is ' + mw.success('very amaze'));
````

Common:
````js
// stream plain text via console.log()
var mw = miniwrite.createConsole();

// stream ANSI code via console.log();
var mw = miniwrite.createANSI();

// extend existing
var mw = miniwrite.createANSI(myMiniWrite);

// get basic prototype for extension
var mw = miniwrite.createBase();
````

Buffer writes
````js
// buffer own lines
var mw = miniwrite.createBuffered();
// buffer other Writes (handy for testing)
var mw = miniwrite.createBuffered(myMiniWrite);

// get buffer
var str = mw.toString();
var str = mw.toString('\n\n', '\t');
// iterate buffer
mw.lines.forEach(function(line) {
	//..
})
// reset buffer
mw.clear();
````

Split method calls over instances
````js
var mw = miniwrite.createSplitter([myANSIConsole, myRemoteSocket, myDiskLogger]);
mw.targets.forEach(function(subw) {
	//..
});
````

Proxy to toggle stream or swap output target
````js
var mw = miniwrite.createProxy(myMiniWrite);
mw.target = myOherWrite;
mw.enabled = false;
````

Convenience preset for conventional [colors.js](https://github.com/Marak/colors.js)
````js
var mw = miniwrite.createColorsJS();
var mw = miniwrite.createColorsJS(myMiniWrite);
````

Convenience preset for [grunt](https://github.com/gruntjs/grunt) (same as in `grunt ~0.4.1`):
````js
var mw = miniwrite.createGrunt(grunt);
````

Example: make it bigger:
````js
var mw = miniwrite.createConsole();
mw.accent = function(str) {
	return str.toUpperCase()
};
````

Example: extend with custom output-stream:
````js
var mw = miniwrite.createBase();
mw.writeln = function(line) {
	myWebSocketHyperStream.send({line: line})
};
// pass to supporting tools
awesomeModule.useMiniWrite(mw);
````

Example: tap into output
````js
awesomeModule.write = miniwrite.createSplitter([myMiniWrite, awesomeModule.write]);
````

## Installation

Not yet published to package managers. 

Link to a github commit if you feel adventurous.

```shell
$ npm install tv4-reporter --save-dev
```

## History

* 0.0.1 - Extracted code from [tv4-reporter](https://github.com/Bartvds/tv4-reporter) et al.

## Build

Nothing much here as the code is still being hammered out.

~~Install development dependencies in your git checkout:~~

    $ npm install

~~Build and run tests:~~

    $ grunt

See the `Gruntfile.js` for additional commands.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

*Note:* please create a [ticket](https://github.com/Bartvds/miniwrite/issues) to discuss big changes. Pull requests for bug fixes are of course always welcome. always welcome. 

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.