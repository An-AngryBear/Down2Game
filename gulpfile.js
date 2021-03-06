var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');


gulp.task('sass', function() {
    gulp.src('sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('jshint', function () {
    return gulp.src(['public/js/**/*.js', 'routes/*.js', 'controllers/*.js', 'models/*.js', 'migrations/*.js', 'config/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', function() {
    gulp.watch('sass/**/*.sass',['sass']);
    gulp.watch(['public/js/**/*.js', 'routes/*.js', 'controllers/*.js', 'models/*.js', 'migrations/*.js', 'config/*.js'], ['jshint']);
});