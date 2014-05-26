var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish-ex'),
	cp = require('child_process');

// Lint
gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js', '!./src/lib/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

// Build
gulp.task('build-dev', function(callback) {
  cp.exec('r.js.cmd -o build.dev.js', callback);
});
gulp.task('build-prod', function(callback) {
  cp.exec('r.js.cmd -o build.prod.js', callback);
});

// doxx documentation
gulp.task('documentation', function(callback){
	cp.exec('doxx --title "Zeldus" --ignore lib --source src --target docs', callback);
});

gulp.task('test', ['lint']);
gulp.task('docs', ['documentation']);
gulp.task('default', ['build-dev', 'build-prod']);