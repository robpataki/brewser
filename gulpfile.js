// grab our packages
var gulp        = require('gulp'),
    del         = require('del'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    util        = require('gulp-util'),
    rename      = require('gulp-rename'),
    replace     = require('gulp-replace'),
    config      = require('./package.json');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

gulp.task('release', ['jshint', 'clean:dist', 'build', 'build:min']);

// Clean the dist directory
gulp.task('clean:dist', function(cb) {
    del([
        'dist/**/*'
    ], cb);
});

// configure the jshint task
gulp.task('jshint', function() {
    return  gulp.src('src/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
});

// configure the build task
gulp.task('build', function() {
    return gulp.src('src/brewser.js')
        .pipe(replace('{{VERSION}}', config.version))
        .pipe(gulp.dest('dist'));
});

// configure the minified build task
gulp.task('build:min', function() {
    return gulp.src('src/brewser.js')
        .pipe(replace('{{VERSION}}', config.version))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('src/*.js', ['jshint']);
});