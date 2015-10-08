// grab our packages
var gulp            = require('gulp'),
    del             = require('del'),
    jsonTransform   = require('gulp-json-transform'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    replace         = require('gulp-replace'),
    xo              = require('gulp-xo'),
    versionConfig   = require('./version.json'),
    npmConfig       = require('./package.json'),
    bowerConfig     = require('./bower.json');

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('src/*.js', ['jshint']);
});

// Clean the dist directory
gulp.task('clean:dist', function(cb) {
    del([
        'dist/**/*'
    ], cb);
});

// configure the build task
gulp.task('build', ['clean:dist'], function(cb) {
    return gulp.src('src/brewser.js')
        .pipe(xo())
        .pipe(gulp.dest('dist'));
});

// configure the minified build task
gulp.task('build:min', ['build'], function(cb) {
    return gulp.src('src/brewser.js')
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('version:build', ['build:min'], function(cb) {
    return gulp.src('dist/brewser.js')
        .pipe(replace('{{VERSION}}', versionConfig.version))
        .pipe(gulp.dest('dist'));
});
gulp.task('version:build:min', ['version:build'], function(cb) {
    return gulp.src('dist/brewser.min.js')
        .pipe(replace('{{VERSION}}', versionConfig.version))
        .pipe(gulp.dest('dist'));
});

// Update the version number in the bopackagewer.json file using
// 'version.json'
gulp.task('version:npm', ['version:build:min'], function(cb) {
    var contents = npmConfig;
    contents.version = versionConfig.version;

    return gulp.src('./package.json')
    .pipe(jsonTransform(function(data) {
        return contents;
    }, 4))
    .pipe(gulp.dest('./'));
});

// Update the version number in the bower.json file using 'version.json'
gulp.task('version:bower', ['version:npm'], function(cb) {
    var contents = bowerConfig;
    contents.version = versionConfig.version;

    return gulp.src('./bower.json')
    .pipe(jsonTransform(function(data) {
        return contents;
    }, 4))
    .pipe(gulp.dest('./'));
});

// Define custom tasks
gulp.task('default', ['watch']);
gulp.task('release', ['version:bower']);