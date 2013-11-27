'use strict';

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		jshint: {
			options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
				reporter: './node_modules/jshint-path-reporter'
			}),
			all: [
				'Gruntfile.js',
				'lib/**/*.js',
				'tasks/**/*.js',
				'test/**/*.js'
			]
		},
		clean: {
			tmp : ['./tmp/**/*', './test/tmp/**/*']
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter'
			},
			all: {
				src: [
					'./test/spec/*.test.js'
				]
			}
		}
	});

	grunt.registerTask('prep', ['clean', 'jshint']);
	grunt.registerTask('test', ['prep', 'mochaTest']);
	grunt.registerTask('default', ['test']);
};
