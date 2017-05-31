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
  			// copy any html files in src/ to public/
  			gulp.src('src/*.html').pipe(gulp.dest('public'));
		});

	4) gulp.watch, like gulp.task, has two main forms. Both of which return an
		EventEmitter that emits change events. The first of which takes a glob, an
		optional options object, and an array of tasks as it's parameters.
*/

/*
	For sass compilation we'll use gulp-sass.
	NOTE: gulp-sass uses node-sass which in turn uses libsass.
*/

// grab our gulp packages
const gulp  = require('gulp'),
      gutil = require('gulp-util'), // Utility functions for gulp plugins.
      jshint = require('gulp-jshint'), // JSHint (see http://jshint.com/) plugin for gulp.
      sass  = require('gulp-sass'), // Sass (see http://sass-lang.com/) plugin for gulp.
      cleanCSS = require('gulp-clean-css'), // Gulp plugin to minify CSS, using clean-css.
      concat = require('gulp-concat'), // Concatenate source files (possibly followed by ugly/mini -fy).
      uglify = require('gulp-uglify'), // Minify JavaScript with UglifyJS2.
      sourcemaps = require('gulp-sourcemaps'), // Map proc'd/min'd/mod'd files to their original sources.
      browserSync = require('browser-sync').create(), // Browsersync cuts out repetitive manual tasks.
      babel = require('gulp-babel'); // Use next generation JS with Babel. It allows to use the last ES
                                     // even with browsers that do not support it.

// define the default task and add the watch task to it
// gulp.task('default', ['watch']);
gulp.task('default', ['jshint', 'css', 'js', 'html', 'browserSync', 'watch']);

// This task will lint our javascript (check for errors) using jshint and it'll
// set it up to run this task each time we save a javascript file.
gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Sass Compilation with libsass.
// Sass serves as a way to extend CSS giving support for variables,
// nested rules, mixins, inline imports, and more.
gulp.task('css', function() {
  return gulp.src('src/scss/**/*.scss')
  	.pipe(sourcemaps.init())  // Process the original sources
    	.pipe(sass())
    	.pipe(concat('styles.css'))
    	.pipe(gutil.env.type === 'production' ? cleanCSS() : gutil.noop())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

// Javascript concat and minify
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
            presets: ['es2015']
        }))
      .pipe(concat('bundle.js'))
      // IF gulp is ran with '--type production' THEN uglify, ELSE do "no operation" (noop() utility).
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

// HTML processing
gulp.task('html', function() {
  return gulp.src('src/template/**/*.html')
    .pipe(gulp.dest('public'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Start the Browsersync server
gulp.task('browserSync', function() {
  browserSync.init(null, {
    open: false,
    server: {
      baseDir: 'public'
    }
  });
});

// Configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['jshint', 'js']); //<-- I think we need to add also the task *js* here!
  // gulp.watch('src/js/**/*.js', ['jshint']);
  gulp.watch('src/template/**/*.html', ['html']);
});
