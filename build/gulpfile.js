let gulp = require('gulp');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');
let minify = require('gulp-minify');

gulp.task("build", function () {
    return gulp.src('../src/esheep.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(sourcemaps.init()) 
        .pipe(minify({ext:{min:'.min.js'},noSource:true}))
        .pipe(sourcemaps.write('../dist/'))
        .pipe(gulp.dest('../dist/'));
});