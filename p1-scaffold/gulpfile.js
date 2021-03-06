// DONT TOUCH
// DONT TOUCH // DONT TOUCH // DONT TOUCH
// DONT TOUCH // DONT TOUCH // DONT TOUCH
// DONT TOUCH // DONT TOUCH // DONT TOUCH
// DONT TOUCH // DONT TOUCH // DONT TOUCH
// DONT TOUCH // DONT TOUCH // DONT TOUCH
// DONT TOUCH
// DONT TOUCH // DONT TOUCH // DONT TOUCH
// Seriously don't touch this file you'll lose a lot of points
/* eslint-disable */

const argv = require('minimist')(process.argv.slice(2))

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const streamify = require('gulp-streamify')
const source = require('vinyl-source-stream')

const budo = require('budo')
const browserify = require('browserify')
const babelify = require('babelify').configure({
  presets: ['es2015']
})

const entry = './src/index.js'
const outfile = 'bundle.js'

//the development task
gulp.task('watch', [], function(cb) {

  //dev server
  budo(entry, {
    serve: 'bundle.js',     // end point for our <script> tag
    stream: process.stdout, // pretty-print requests
    live: true,             // live reload & CSS injection
    dir: 'app',             // directory to serve
    open: argv.open,        // whether to open the browser
    browserify: {
      transform: babelify   //browserify transforms
    }
  }).on('exit', cb)
})

//the distribution bundle task
gulp.task('bundle', [], function() {
  var bundler = browserify(entry, { transform: babelify })
        .bundle()
  return bundler
    .pipe(source('index.js'))
    .pipe(streamify(uglify()))
    .pipe(rename(outfile))
    .pipe(gulp.dest('./app'))
})
/* eslint-enable */
