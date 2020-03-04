var gulp = require ('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower'),
    coffee = require('gulp-coffee'),
    jade = require('gulp-jade'),
    wiredep = require('wiredep'),
    templateCache = require('gulp-angular-templatecache');

gulp.task('js', function () {
  return gulp.src('js/**/*.js')
    .pipe(concat('dependencies.js'))
    .pipe(gulp.dest(''));
});

gulp.task('coffee', function () {
  return gulp.src(['coffee/app.coffee', 'coffee/MainC.coffee', 'coffee/routes.coffee', 'coffee/*/**/*.coffee'])
    .pipe(coffee({bare: true}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(''));
});

gulp.task('css', function () {
  return gulp.src('css/**/*.css')
    .pipe(concat('app.css'))
    .pipe(gulp.dest('styles'));
});

gulp.task('bowerInstall', function () {
  return bower();
});

gulp.task('bower', ['bowerInstall'], function () {
  var w = wiredep();
  if (w.css) {
    gulp.src(w.css)
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('styles'));
  }
  if (w.js) {
    gulp.src(w.js)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(''));
  }
});

gulp.task('templateCache', function () {
  return gulp.src('./views/templates/**/*.jade')
    .pipe(jade({html: true}))
    .pipe(templateCache('templates.js', { standalone: true }))
    .pipe(gulp.dest(''));
});

gulp.task('index', function () {
  return gulp.src('views/index.jade')
    .pipe(jade({html: true, pretty: true}))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('css/**/*.css', ['css']);
  gulp.watch('./views/templates/**/*.jade', ['templateCache']);
  gulp.watch('views/index.jade', ['index']);
  gulp.watch('coffee/**/*.coffee', ['coffee']);
  gulp.watch('bower_components/**/*.css', ['bower']);
});

gulp.task('compile', ['js', 'css', 'coffee', 'index', 'bower', 'templateCache']);
gulp.task('default', ['compile', 'watch']);
