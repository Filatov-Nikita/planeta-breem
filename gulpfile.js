const gulp = require('gulp');
const { src, dest, watch, series } = gulp;
const sass = require('gulp-sass')(require('sass'));
const pugCompiler = require('gulp-pug');
const browserSync = require('browser-sync').create();
const del = require('del');

function clean() {
  return del([ './dist/*/' ]);
}

function fonts() {
  return src('./src/assets/fonts/**').pipe(dest('./dist/assets/fonts'));
}

function images() {
  return src('./src/assets/images/**').pipe(dest('./dist/assets/images'));
}

function styles() {
  return src('./src/css/app.scss')
  .pipe(sass())
  .pipe(dest('./dist/css'))
  .pipe(browserSync.stream());
}

function pug() {
  return src('./src/pug/**/*.pug')
  .pipe(pugCompiler())
  .pipe(dest('./dist'));
}

function server() {
  browserSync.init({
    server: {
      baseDir: './dist',
    }
  });

  watch('./src/css/**/*.scss', series(styles));
  watch('./src/pug/**/*.pug', series(pug)).on('change', browserSync.reload);
}

const serve = series(clean, fonts, images, styles, pug, server);
const build = series(clean, fonts, images, styles, pug);

module.exports = {
  styles,
  pug,
  build,
  default: serve
};
