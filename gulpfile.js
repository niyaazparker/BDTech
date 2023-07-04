const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-clean-css');
const minifyJS = require('gulp-uglify');
const rename = require('gulp-rename');

// Compile SCSS to CSS
function compileSassTask() {
    return gulp
      .src('src/scss/*.scss') // Path to your SCSS files
      .pipe(sass()) // Compile SCSS to CSS
      .pipe(gulp.dest('src/css')); // Output directory for compiled CSS
  }

// Minify CSS
function minifyCSSTask() {
  return gulp
    .src('src/css/*.css') // Path to your CSS files
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css')); // Output directory for minified CSS
}

// Minify JavaScript
function minifyJSTask() {
  return gulp
    .src('src/js/*.js') // Path to your JavaScript files
    .pipe(minifyJS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js')); // Output directory for minified JavaScript
}

// Watch files for changes
function watchFiles() {
  gulp.watch('src/css/*.css', minifyCSSTask);
  gulp.watch('src/js/*.js', minifyJSTask);
}

// Define build tasks
const build = gulp.parallel(minifyCSSTask, minifyJSTask);

// Create default task
gulp.task('default', gulp.series(build, watchFiles));
