var fs = require('fs');
// less
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uncss = require('gulp-uncss');
var template = require('gulp-template');

// js
var gulpConcat = require('gulp-concat');
var uglify = require('gulp-uglify');


// watch folders
var lessWatchFolder = './less/**/*.less';
var htmlWatchFolder = '../app/**/*.html';
var jsWatchFolder = './js/*.js';

// less vars
var lessFile = './less/etherwallet-ext-master.less';
var lessOutputFolder = '../app/css';
var lessOutputFile = 'etherwallet-ext-master.css';
var lessOutputFileMin = 'etherwallet-ext-master.min.css';

//js vars
var jsFiles = "./js/*.js";
var staticjsFiles = "./js/staticJS/*.js";
var jsOutputFolder = '../app/js';
var jsOutputFile = 'etherwallet-ext-master.min.js';
var staticjsOutputFile = 'etherwallet-ext-static.min.js';

gulp.task('less', function (cb) {
  return gulp
    .src(lessFile)
      .pipe(less({ compress: false })).on('error', notify.onError(function (error) {
        return "ERROR! Problem file : " + error.message;
      }))
      .pipe(rename(lessOutputFile))
      .pipe(gulp.dest(lessOutputFolder))
      .pipe(uncss({
        html: [
          '../app/browser_action/browser_action.html',
          '../app/donate.html',
          '../app/quicksend.html',
          '../app/wallet.html'
        ]
      }))
      .pipe(cssnano()).on('error', notify.onError(function (error) {
        return "ERROR! minify CSS Problem file : " + error.message;
      }))
      .pipe(rename(lessOutputFileMin))
      .pipe(gulp.dest(lessOutputFolder))
      .pipe(notify('Less Compiled, UnCSSd and Minified'));
});

gulp.task('minJS', function () {
  return gulp
    .src(jsFiles)
      .pipe(gulpConcat(jsOutputFile))
      .pipe(gulp.dest(jsOutputFolder))
     .pipe(notify('JS Concat and Uglified'));
});

gulp.task('staticJS', function () {
  return gulp
    .src(staticjsFiles)
      .pipe(gulpConcat(staticjsOutputFile))
      .pipe(gulp.dest(jsOutputFolder))
     .pipe(notify('staic JS Concat and Uglified'));
});


gulp.task('watchJS', function() {
    gulp.watch(jsWatchFolder,['minJS']);
});
gulp.task('watchLess', function() {
    gulp.watch(lessWatchFolder, ['less']);
});
gulp.task('watchHTML', function() {
    gulp.watch(htmlWatchFolder, ['less']);
});


gulp.task('default', ['minJS' , 'staticJS', 'less', 'watchJS' , 'watchLess', 'watchHTML']);
