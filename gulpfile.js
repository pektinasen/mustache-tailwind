"use strict";
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const rename = require("gulp-rename");

function css() {
  var postcss = require("gulp-postcss");
  var tailwindcss = require("tailwindcss");

  return gulp
    .src("src/styles/styles.css")
    .pipe(postcss([tailwindcss("./src/tailwind.js"), require("autoprefixer")]))
    .pipe(gulp.dest("build/"))
    .pipe(browsersync.stream());
}

function mustache() {
  var mustache = require("gulp-mustache");

  return gulp
    .src([
         "./src/templates/**/*",
         "!./src/templates/**/_*",    "!./src/templates/**/_*/*",
    ])
    .pipe(
      mustache({
        msg: "Hello Gulp!"
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("./build"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./src/templates/**/*.mustache", mustache);
  gulp.watch("./src/styles/**/*", css);
}

// Clean assets
function clean() {
  return del(["./build"]);
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./build/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

const build = gulp.series(clean, gulp.parallel(css, mustache));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

exports.mustache = mustache
exports.build = build;
exports.watch = watch;
exports.default = build;
