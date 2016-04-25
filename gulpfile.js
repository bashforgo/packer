// Generated on 2016-04-22 using generator-static-angular v0.0.6
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    htmlmin = require('gulp-htmlmin');

var ghPages = require('gulp-gh-pages');

gulp.task('deploy', ['build'], function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});


gulp.task('copy', function () {
  return gulp.src('dev/icons/*', {base: './dist/'})
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['copy'], function () {
    var assets = useref.assets();

    return gulp.src('dev/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9']
        })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('reload', function () {
  return gulp.src('dev/**/**.*')
    .pipe(connect.reload());
});

gulp.task('connect', function (done) {
  connect.server({
    root: 'dev',
    port: 80,
    livereload: true
  });
  opn('http://localhost:80', done);
});

gulp.task('watch', function () {
  gulp.watch('dev/**/**.*', ['reload']);
});

gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
