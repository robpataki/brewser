// grab our packages
var gulp = require("gulp"),
  del = require("del"),
  jsonTransform = require("gulp-json-transform"),
  jshint = require("gulp-jshint"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  replace = require("gulp-replace"),
  versionConfig = require("./version.json"),
  npmConfig = require("./package.json"),
  bowerConfig = require("./bower.json"),
  ghPages = require("gulp-gh-pages");

// configure which files to watch and what tasks to use on file changes
gulp.task("watch", function () {
  gulp.watch("src/*.js", ["jshint"]);
});

// configure the jshint task
gulp.task("jshint", function () {
  return gulp
    .src("src/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

// Clean the dist directory
gulp.task("clean:dist", function (cb) {
  del(["dist/**/*"], cb);
});

// configure the build task
gulp.task("build", ["jshint", "clean:dist"], function (cb) {
  return gulp.src("src/brewser.js").pipe(gulp.dest("dist"));
});

// configure the minified build task
gulp.task("build:min", ["build"], function (cb) {
  return gulp
    .src("src/brewser.js")
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("version:build", ["build:min"], function (cb) {
  return gulp
    .src("dist/brewser.js")
    .pipe(replace("{{VERSION}}", versionConfig.version))
    .pipe(gulp.dest("dist"));
});
gulp.task("version:build:min", ["version:build"], function (cb) {
  return gulp
    .src("dist/brewser.min.js")
    .pipe(replace("{{VERSION}}", versionConfig.version))
    .pipe(gulp.dest("dist"));
});

// Update the version number in the bopackagewer.json file using
// 'version.json'
gulp.task("version:npm", ["version:build:min"], function (cb) {
  var contents = npmConfig;
  contents.version = versionConfig.version;

  return gulp
    .src("./package.json")
    .pipe(
      jsonTransform(function (data) {
        return contents;
      }, 4)
    )
    .pipe(gulp.dest("./"));
});

// Update the version number in the bower.json file using 'version.json'
gulp.task("version:bower", ["version:npm"], function (cb) {
  var contents = bowerConfig;
  contents.version = versionConfig.version;

  return gulp
    .src("./bower.json")
    .pipe(
      jsonTransform(function (data) {
        return contents;
      }, 4)
    )
    .pipe(gulp.dest("./"));
});

// Copy the demo index file to dist
gulp.task("copy:demo", [], function (cb) {
  return gulp.src("demo/**/*").pipe(gulp.dest("dist"));
});

// Deploy to GH Pages
gulp.task("deploy:push", function () {
  return gulp.src("./dist/**/*").pipe(ghPages());
});

// Define custom tasks
gulp.task("default", ["watch"]);
gulp.task("release", ["version:bower"]);
gulp.task("deploy", ["version:build:min", "copy:demo", "deploy:push"]);
