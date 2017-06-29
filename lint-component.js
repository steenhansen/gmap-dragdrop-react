'use strict'

// gulp lint-component

var gulp = require('gulp')
var eslint = require('gulp-eslint')
var gutil = require('gulp-util')
const debug = require('gulp-debug')
var start_text_color = 'bgRed'

var my_lint_dirs = [
    __dirname + '/jsx/*.jsx'
  , __dirname + '/*.js'
]
var lint_text = '                                    component lint'

gulp.task('lint-component', function (cb) {
  console.log(gutil.colors[start_text_color](lint_text))
   gulp.src(my_lint_dirs)
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(debug({title: 'lint_COMPONENT_check:'}))
  cb()
})


