var gulp = require('gulp');
const builtDir = "out/";
const appSrcBase = "app/";
const assetsDir = "assets/"
gulp.task('app-assets', function(){
    var y = gulp.src([appSrcBase + '**/*.css', appSrcBase + "**/*.html"]);
    return y.pipe(gulp.dest(builtDir));
});

gulp.task('dir-assets', function(){
    var x = gulp.src([assetsDir + "**/*"])
    return x.pipe(gulp.dest(builtDir + assetsDir));
});

gulp.task('assets', ['app-assets', 'dir-assets']);