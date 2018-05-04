let gulp = require('gulp');
let rename = require('gulp-rename');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
 
gulp.task("build", function () {
    return gulp.src('../src/esheep.js')
        .pipe(rename('esheep.min.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../dist/'));
});