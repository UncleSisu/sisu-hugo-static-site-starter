import autoprefixer from 'autoprefixer';
import BrowserSync from 'browser-sync';
import cacheBuster from 'gulp-cache-bust';
import cp from 'child_process';
import gulp from 'gulp';
import gutil from 'gulp-util';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';

import webpackConfig from './webpack.conf';

const browserSync = BrowserSync.create();
const hugoBin = 'hugo';

// location of static files to copy over
// const staticFiles = [
//   'src/**/*.*',
//   'src/**',
//   '!src/*.html',
//   '!src/markup{,/**}',
//   '!src/scripts{,/**}',
//   '!src/styles{,/**}'
// ];
const staticFiles = [
  './src/.favicon.png',
  './src/data/**/*.*',
  './src/docs/**/*.*',
  './src/fonts/**/*.*',
  './src/images/**/*.*'
];

// default hugo arguments used in buildSite method
// use config.toml in root directory
// use verbose output
const defaultArgs = ['--config', 'config.toml', '-v'];

// HUGO
// ------------------------------------------------------- //
// overwrite the default 'hugo' commands to run buildSite method
gulp.task('hugo', cb => buildSite(cb));
gulp.task('hugo-preview', cb => buildSite(cb, ['--buildDrafts', '--buildFuture']));

function buildSite(callback, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, { stdio: 'inherit' }).on('close', (code) => {
    if (code === 0) {
      browserSync.reload();
      callback();
    } else {
      reportError('Hugo build failed :(');
      browserSync.notify('Hugo build failed :(');
      callback('Hugo build failed');
    }
  });
}

// Build
// ------------------------------------------------------- //
gulp.task('build', cb =>
  runSequence(['styles', 'scripts', 'hugo', 'static'], 'cacheBuster', cb)
);

gulp.task('build-preview', cb =>
  runSequence(['styles', 'scripts', 'hugo-preview', 'static'], 'cacheBuster', cb)
);

// Styles
// ------------------------------------------------------- //
gulp.task('styles', () => (
  gulp.src('./src/styles/**/*.scss')
    .pipe(plumber({ errorHandle: reportError }))
    // Load existing internal sourcemap
    .pipe(sourcemaps.init())
    // generate CSS from SASS
    .pipe(sass({ outputStyle: 'compressed' }))
    // catch any errors
    .on('error', reportError)
    // autoprefix code. Check browserslist in package.json for settings
    .pipe(postcss([autoprefixer()]))
    // Write final .map file
    .pipe(sourcemaps.write())
    // output files
    .pipe(gulp.dest('./dist/css'))
    // update browserSync
    .pipe(browserSync.stream())
));

// Scripts
// ------------------------------------------------------- //
gulp.task('scripts', (callback) => {
  // use webpack to transpile
  webpack(webpackConfig, (err, stats) => {
    // TODO: find a way to keep gulp running after error
    if (err) {
      reportError(err);
      throw new gutil.PluginError('webpack', err);
    }

    // log webpack output to terminal
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));

    // reload browserSync
    browserSync.reload();

    callback();
  });
});

// Static
// ------------------------------------------------------- //
// copy static files (data, docs, fonts, and images) over to `dist` directory
gulp.task('static', () => (
  gulp.src(staticFiles, { base: 'src/' })
    // output files
    .pipe(gulp.dest('./dist'))
    // update browserSync
    .pipe(browserSync.stream())
));

// Bust Cache
// ------------------------------------------------------- //
gulp.task('cacheBuster', () => (
  gulp.src('dist/**/*.html')
    .pipe(cacheBuster())
    // catch any errors
    .on('error', reportError)
    // output files
    .pipe(gulp.dest('./dist'))
));

// Dev
// ------------------------------------------------------- //
// Build site using hugo, transpile CSS and Javascript
gulp.task('dev', ['hugo', 'static', 'styles', 'scripts'], () => {
  // Start BrowserSync
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    open: false,
    ghostMode: false
  });
  // Watch for changes and run matching task
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/markup/**/*', ['hugo']);
  gulp.watch(staticFiles, ['static']);
  // notify
  notify().write({
    message: 'Development mode engaged',
  });
});

// Errors
// ------------------------------------------------------- //
// https://github.com/mikaelbr/gulp-notify/issues/81
const reportError = function (error) {
  const lineNumber = (error.lineNumber) ? `LINE ${error.lineNumber} -- ` : '';

  notify({
    title: `Task Failed [${error.plugin}]`,
    message: `${lineNumber} See console.`,
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  gutil.beep(); // Beep 'sosumi' again

  // Inspect the error object
  // console.log(error);

  // Easy error reporting
  // console.log(error.toString());

  // Pretty error reporting
  let report = '';
  const chalk = gutil.colors.white.bgRed;

  report += `${chalk('TASK:')} [${error.plugin}]\n`;
  report += `${chalk('PROB:')} ${error.message}\n`;
  if (error.lineNumber) { report += `${chalk('LINE:')} ${error.lineNumber}\n`; }
  if (error.fileName) { report += `${chalk('FILE:')} ${error.fileName}\n`; }
  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
};
