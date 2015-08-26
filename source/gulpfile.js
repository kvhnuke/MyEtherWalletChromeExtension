var fs = require('fs');
// less
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
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
//var staticjsFiles = "./js/staticJS/*.js";
var jsOutputFolder = '../app/js';
var jsOutputFile = 'etherwallet-ext-master.min.js';
//var staticjsOutputFile = 'etherwallet-ext-static.min.js';

// html Pages
// var htmlPages = "./pages/*.html";
// var tplFiles = "./tpl/*.tpl";

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
          '../app/browser_action/browser_action.html'
        ]
      }))
      .pipe(minifyCSS({keepBreaks: false}))
      .pipe(rename(lessOutputFileMin))
      .pipe(gulp.dest(lessOutputFolder))
      .pipe(notify('Less Compiled, UnCSSd and Minified'));
});

gulp.task('minJS', function () {
  return gulp
    .src(jsFiles)
      .pipe(gulpConcat(jsOutputFile))
      .pipe(uglify())
      .pipe(gulp.dest(jsOutputFolder))
     .pipe(notify('JS Concat and Uglified'));
});

/*
gulp.task('staticJS', function () {
  return gulp
    .src(staticjsFiles)
      .pipe(gulpConcat(staticjsOutputFile))
      .pipe(uglify())
      .pipe(gulp.dest(jsOutputFolder))
     .pipe(notify('staic JS Concat and Uglified'));
});
*/

/*
gulp.task('genHTMLPages', function () {
    var header=fs.readFileSync("./tpl/header.tpl", "utf8");
    var footer=fs.readFileSync("./tpl/footer.tpl", "utf8");
    return gulp.src(htmlPages)
        .pipe(template({header: header, footer: footer}))
        .pipe(gulp.dest('./'))
        .pipe(notify('HTML Pages generated'));
});
*/

gulp.task('watchJS', function() {
    gulp.watch(jsWatchFolder,['minJS']);
});
gulp.task('watchLess', function() {
    gulp.watch(lessWatchFolder, ['less']);
});
gulp.task('watchHTML', function() {
    gulp.watch(htmlWatchFolder, ['less']);
});

/*
gulp.task('watchPAGES', function() {
    gulp.watch(htmlPages, ['genHTMLPages','less-uncss']);
});
gulp.task('watchTPL', function() {
    gulp.watch(tplFiles, ['genHTMLPages','less-uncss']);
});
*/

gulp.task('default', ['minJS' , 'less', 'watchJS' , 'watchLess', 'watchHTML']);
