var gulp       = require('gulp');
var svgSymbols = require('gulp-svg-symbols');

gulp.task('default', function () {
  return gulp.src('svg/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('svg_sprite'));
});