/* File: gulpfile.js */

/*
	The gulp api is incredibly light containing 4 top level functions:
	
		1) gulp.task
		2) gulp.src
		3) gulp.dest
		4) gulp.watch

	1) gulp.task defines your tasks. Its arguments are name, deps and fn.
		Where name is a string, deps is an array of task names, and fn is
		the function that performs your task. Deps is optional so gulp.task
		is usually in two forms.

	2) gulp.src points to the files we want to use. Its parameters are globs
		and an optional options object. It uses .pipe for chaining its output
		into other plugins.

	3) gulp.dest points to the output folder we want to write files to.
		gulp.src and gulp.dest, used to simply copy files, look like:
		
		gulp.task('copyHtml', function() {
  			// copy any html files in source/ to public/
  			gulp.src('source/*.html').pipe(gulp.dest('public'));
		});

	4) gulp.watch, like gulp.task, has two main forms. Both of which return an
		EventEmitter that emits change events. The first of which takes a glob, an
		optional options object, and an array of tasks as it's parameters.
		
*/

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
});
