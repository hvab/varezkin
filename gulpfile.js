'use strict';

const browserSync = require('browser-sync').create();
const bundleBuilder = require('gulp-bem-bundle-builder');
const bundlerFs = require('gulp-bem-bundler-fs');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const debug = require('gulp-debug');
const del = require('del');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const include = require("gulp-include");
const notify = require("gulp-notify");
const nunjucks = require('gulp-nunjucks-html');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const typograf = require('gulp-typograf');
const uglify = require('gulp-uglify');

// TODO:
// Кеширование
// Линтеры
// Внешний файл для конфига (dist, levels, techMap, browsers)


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const DEST = 'docs';

const builder = bundleBuilder({
  levels: [
    'node_modules/pale-blocks/blocks',
    'blocks'
  ],
  techMap: {
    css: ['css', 'post.css'],
    js: ['js'],
    image: ['jpg', 'png', 'svg']
  }
});

gulp.task('buildCss', function() {
  return bundlerFs('bundles/*')
    .pipe(builder({
      css: bundle => bundle.src('css')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(postcss([
          require("postcss-import")
        ]))
        .pipe(concat(bundle.name + '.css'))
        .pipe(postcss([
          require("postcss-nested"),
          require("postcss-color-function"),
          require('postcss-assets')({
            loadPaths: [DEST+'/**'],
            relative: DEST,
            cachebuster: !isDevelopment
          }),
          require('autoprefixer')({
            browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%']
          })
        ])).on('error', notify.onError(function(err) {
          return {
            title: 'PostCSS',
            message: err.message,
            sound: 'Blow'
          };
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
        .pipe(gulpIf(!isDevelopment, csso()))
        .pipe(gulp.dest(DEST))
    }))
    .pipe(debug({title: 'buildCss:'}));
});

gulp.task('buildImage', function() {
  return bundlerFs('bundles/*')
    .pipe(builder({
      image: bundle => bundle.src('image')
        .pipe(gulpIf(!isDevelopment, imagemin()))
        .pipe(flatten())
        .pipe(gulp.dest(DEST+'/images'))
    }))
    .pipe(debug({title: 'buildImage:'}));
});

gulp.task('images', function() {
  return gulp.src('images**/*.+(png|jpg|svg)')
  .pipe(gulpIf(!isDevelopment, imagemin()))
  .pipe(flatten())
  .pipe(gulp.dest(DEST+'/images'))
  .pipe(debug({title: 'images:'}));
});

gulp.task('buildJs', function() {
  return bundlerFs('bundles/*')
    .pipe(builder({
      js: bundle => bundle.src('js')
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(concat(bundle.name + '.js'))
      .pipe(include({
        includePaths: __dirname + '/node_modules'
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
      .pipe(gulpIf(!isDevelopment, uglify()))
      .pipe(gulp.dest(DEST))
    }))
    .pipe(debug({title: 'buildJs:'}));
});


gulp.task('clean', function() {
  return del(DEST+'/*');
});

gulp.task('buildHtml', function() {
  return gulp.src('pages/**/*.html')
    .pipe(nunjucks({
      searchPaths: ['./']
    })).on('error', notify.onError(function(err) {
      return {
        title: 'Nunjucks',
        message: err.message,
        sound: 'Blow'
      };
    }))
    .pipe(typograf({
      lang: 'ru',
      mode: 'digit'
    }))
    .pipe(flatten())
    .pipe(gulp.dest(DEST))
    .pipe(debug({title: 'buildHtml:'}));
});

gulp.task('build', gulp.series(
  'clean',
  'buildImage',
  gulp.parallel('buildCss', 'buildHtml', 'buildJs', 'images')
));

gulp.task('watch', function() {
  gulp.watch([
    'blocks/**/*.deps.js',
    'bundles/**/*.bemdecl.js'
  ], gulp.series('buildImage', gulp.parallel('buildCss', 'buildJs')));
  gulp.watch([
    'pages/**/*.html',
    'templates/**/*.html'
  ], gulp.series('buildHtml'));
  gulp.watch('blocks/**/*.css', gulp.series('buildCss'));
  gulp.watch('blocks/**/*.js', gulp.series('buildJs'));
  gulp.watch('blocks/**/*.+(png|jpg|svg)', gulp.series('buildImage', 'buildCss'));
});

gulp.task('serve', function() {
  browserSync.init({
    logPrefix: "grove",
    server: DEST,
    port: isDevelopment ? 3000 : 8080,
    notify: false,
    open: false,
    ui: false,
    tunnel: false,
  });

  browserSync.watch(DEST+'/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
gulp.task('prod', gulp.series('build', 'serve'));

gulp.task('default', gulp.series(isDevelopment ? 'dev' : 'prod'));
