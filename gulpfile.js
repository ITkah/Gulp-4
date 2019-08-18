var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglifyjs'), 
    cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'), 
    del          = require('del'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass-watch', function(){ 
    return gulp.src('app/scss/main.scss')
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts-watch', function() {
    return gulp.src(['app/js/common.js', 'app/js/libs/**/*.js'])
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html-watch', function() {
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function() {
    browserSync({ 
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', async function() {
    return del.sync('dist/'); 
});

gulp.task('prebuild', async function() {

    var minCss = gulp.src('app/css/main.css')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));

    var minJs = gulp.src('app/js/common.js')
        .pipe(concat('common.min.js'))
        .pipe(uglify()) 
        .pipe(gulp.dest('dist/js'));

    var buildCss = gulp.src(['app/css/**/*'])
        .pipe(gulp.dest('dist/css'));

    var builImg = gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));

    var buildFonts = gulp.src('app/fonts/**/*') 
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*') 
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html') 
        .pipe(gulp.dest('dist'));

});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass-watch'));
    gulp.watch('app/*.html', gulp.parallel('html-watch')); 
    gulp.watch(['app/js/**/*.js', 'app/js/libs/**/*.js'], gulp.parallel('scripts-watch'));
});

gulp.task('default', gulp.parallel('sass-watch', 'scripts-watch', 'html-watch', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('clean', 'prebuild'));