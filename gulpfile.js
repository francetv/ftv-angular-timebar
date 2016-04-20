var gulp = require('gulp');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var path = require('path');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var template = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var scsslint = require('gulp-scss-lint');
var csslint = require('gulp-csslint');

var repoRootKarma =  __dirname + '/../';

var buildDir = 'dist';
var appName = 'component';
var js = {
    dest: buildDir,
    app: {
        name: appName + '.js',
        nameMin: appName + '.min.js',
        files: [
            // on server need version 1.8.3+1
            "./component.js",
        ]
    },
    templates: {
        name: 'templates.js',
        files: [
            'templates/**/*.html',
        ]
    }
};

var css = {
    dest: buildDir,
    app: {
        name: appName + '.css',
        files: './**/*.scss'
    }
};

/************************************ css ********************************************/

gulp.task('css', function () {
    return gulp.src('./component.scss')
        .pipe(compass({
            project: path.join(__dirname),
            css: css.dest,
            sass: __dirname,
            sourcemap: true
        }))
        .pipe(gulp.dest(css.dest));
});

gulp.task('css-min', function () {
    return gulp.src(css.dest + '/' + css.app.name)
        .pipe(minify({
            keepSpecialComments: false
        }))
        .pipe(gulp.dest(css.dest));
});

/************************************ js ********************************************/

gulp.task('js-template', function () {
    return gulp.src(js.templates.files)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(template(js.templates.name, {
            module:     'ftv.components.timeBar.templates',
            standalone: true,
            root: '/timeBar/'
        }))
        .pipe(gulp.dest(js.dest));
});

gulp.task('js-module', function() {
    var files = js.app.files;
    files.push(js.dest + '/' + js.templates.name);

    return gulp.src(files)
        .pipe(concat(js.app.name))
        .pipe(gulp.dest(js.dest));
});

gulp.task('js', function(callback) {
    sequence('js-template', 'js-module', callback);
});

gulp.task('js-min', function() {
    return gulp.src(js.dest + '/' + js.app.name)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(js.dest));
});

/************************************ general ********************************************/

gulp.task('cleanup', function(cb) {
    return del(buildDir, cb);
});

gulp.task('build', function(callback) {
    sequence('build-common', 'js-min', 'css-min', callback);
});

gulp.task('build-common', function(callback) {
    sequence('cleanup', 'css', 'js', callback);
});

gulp.task('build-dev', function(callback) {
    sequence('build-common', callback);
});

gulp.task('refresh-js-src', function(callback) {
    sequence('build-js', callback);
});

gulp.task('refresh-css-src', function(callback) {
    sequence('css-src', callback);
});

gulp.task('build-dev-watch', function(callback) {
    sequence('build-dev', 'watch', callback);
});

gulp.task('watch', function() {
    gulp.watch(js.app.files, ['refresh-js-src']);
    gulp.watch(css.app.files, ['refresh-css-src']);
});

gulp.task('jenkins-tests', function (callback) {
    sequence('test', 'test-responsive', 'mocha-test-seo', callback);
});

gulp.task('lint', function(callback) {
    sequence('js-lint','css-lint', callback);
});

gulp.task('js-lint', function() {
    return gulp.src([
        js.app.files[0],
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('css-lint', function() {
    return gulp.src(css.dest + '/' + css.app.name)
        .pipe(sass())
        .pipe(csslint({
            'font-sizes': false,
            'box-model': false,
            'important': false,
            'bulletproof-font-face': false,
            'fallback-colors': false,
            'ids': false,
            'floats': false,
            'adjoining-classes': false,
            'unique-headings': false,
            'box-sizing': false,
            'compatible-vendor-prefixes': false,
            'universal-selector': false,
            'known-properties': false,
            'unqualified-attributes': false,
            'zero-units': false
        }))
        .pipe(scsslint());
});
