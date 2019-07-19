/* set to true to activate browserSync */
var development   = false;

/* define variables */
var gulp          = require('gulp');
var gulpif        = require('gulp-if');
var sass          = require('gulp-sass');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var autoprefixer  = require('gulp-autoprefixer');
var combineMq     = require('gulp-combine-mq');
var merge         = require('merge-stream');
var connect       = require('gulp-connect-php');
var browserSync   = require('browser-sync');

/* combine JS scripts */
gulp.task('scripts', function() {
  var headJS = gulp.src([
      'scripts/src/spriteloader.js'
    ])
    .pipe(concat('head.js'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts/dist/'));

    var vendorJS = gulp.src([
      'node_modules/overlayscrollbars/js/OverlayScrollbars.min.js',
      'node_modules/innersvg-polyfill/innersvg.js',
      'node_modules/swiper/dist/js/swiper.min.js',
      'node_modules/intersection-observer/intersection-observer.js',
      'node_modules/vanilla-lazyload/dist/lazyload.min.js',
      'node_modules/selecty/dist/js/selecty.js',
      'node_modules/flatpickr/dist/flatpickr.js',
      'node_modules/flatpickr/dist/l10n/de.js',
      'node_modules/glightbox/dist/js/glightbox.min.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts/dist/'));

  var mainJS = gulp.src([
      'scripts/src/main.js'
    ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts/dist/'));

  return merge(vendorJS, headJS, mainJS);
});

/* copy webfonts to fonts folder */
gulp.task('fonts', function() {
  return gulp.src([
    'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.*'])
  .pipe(gulp.dest('styles/fonts/'));
});

/* combine SCSS styles */
gulp.task('styles', function() {
  var vendorCSS = gulp.src([
      'node_modules/overlayscrollbars/css/OverlayScrollbars.min.css',
      'node_modules/swiper/dist/css/swiper.min.css',
      'node_modules/selecty/dist/css/selecty.css',
      'node_modules/flatpickr/dist/flatpickr.min.css',
      'node_modules/glightbox/dist/css/glightbox.min.css'
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('styles/css/'))
    .pipe(gulpif(development, browserSync.stream()));

  var mainCSS = gulp.src('styles/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', 'Chrome >= 45'],
      cascade: false
    }))
    .pipe(combineMq({
      beautify: false
    }))
    .pipe(gulp.dest('styles/css/'))
    .pipe(gulpif(development, browserSync.stream()));

  return merge(vendorCSS, mainCSS);
});

/* watch tasks */
gulp.task('default',function() {
  if (development) {
    connect.server({}, function() {
      browserSync({
        proxy: '127.0.0.1:8000',
        notify: false,
        logLevel: 'warn'
      });
    });
    gulp.watch('*.php').on('change', function() {
      browserSync.reload();
    });
    gulp.watch('*.html').on('change', function() {
      browserSync.reload();
    });
    gulp.watch('scripts/src/**/*.js',['scripts']).on('change', function() {
      browserSync.reload();
    });
  } else {
    gulp.watch('scripts/src/**/*.js',['scripts']);
  }
  gulp.run('fonts');
  gulp.watch('styles/scss/**/*.scss',['styles']);
});