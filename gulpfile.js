
// REFERENCE
// http://codefortheweb.com/blog/angular-minify

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate'); //<-- angular dependency injection for our minified files
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber'); //<-- prevent pipe breaking during errors
var concatCSS = require('gulp-concat-css');
var runSeq = require('run-sequence');
var webserver = require('gulp-webserver');
var open = require('gulp-open');


/* ************
 * variables
 * ************/

// 작업 경로 설정
// watch 대상을 세분화하기 위해 vendor/app별 js/css를 따로 설정함
var srcPath = {
    html: 'src/**/*.html', //<-- copy
    img: 'src/assets/img/**/*.*', //<-- copy

    // index.html의 head에서 vendorCss 로드 후 appCss 로드
    vendorCss: [ //<-- 순서에 맞게
        'bower_components/angular-material/angular-material.css'
    ],
    appCss: 'src/assets/css/**/*.css',

    // index.html의 body에서 vendorCss 로드 후 appCss 로드
    vendorJs: [ //<-- 순서에 맞게
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-aria/angular-aria.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-material/angular-material.js'
    ],
    appJs: [ //<-- 순서에 맞게
        'src/assets/js/**/*.js', //<-- 먼저 로드
        "src/app/modules/common/app.common.module.js", //<-- module js가 component 보다 먼저 와야 함
        "src/app/modules/common/controllers/common.controller.js",
        "src/app/app.module.js" //<-- 맨앞이나 맨뒤 모두 가능
    ]
};

// 결과물 경로 설정
var buildPath = {
    base: 'build',
    appJs: 'app.min.js',
    vendorJs: 'vendor.min.js',
    appCss: 'app.min.css',
    vendorCss: 'vendor.min.css'
};

/* ************
 * tasks
 * ************/

gulp.task('minify_vendor_css', function() {
    return gulp.src(srcPath.vendorCss)
        .pipe(plumber())
        .pipe(concatCSS(buildPath.vendorCss))
        .pipe(minifyCSS())
        .pipe(gulp.dest(buildPath.base));
});

gulp.task('minify_app_css', function() {
    return gulp.src(srcPath.appCss)
        .pipe(plumber())
        .pipe(concatCSS(buildPath.appCss))
        .pipe(minifyCSS())
        .pipe(gulp.dest(buildPath.base));
});

gulp.task('minify_vendor_js', function(){
    return gulp.src(srcPath.vendorJs)
        .pipe(plumber())
        .pipe(concat(buildPath.vendorJs))
        .pipe(ngAnnotate())
        .pipe(uglify({mangle: true, exportAll: true}))
        .pipe(gulp.dest(buildPath.base))
        .on('error', gutil.log);
});

gulp.task('minify_app_js', function() {
    return gulp.src(srcPath.appJs)
        .pipe(plumber())
        .pipe(concat(buildPath.appJs))
        .pipe(ngAnnotate())
        .pipe(uglify({mangle: true})) //<-- PRODUCTION 에서 사용
        .pipe(gulp.dest(buildPath.base))
        .on('error', gutil.log);
});

// copy html files
gulp.task('copy_html', function () {
    return gulp.src(srcPath.html)
        .pipe(gulp.dest(buildPath.base));
});

// copy image files
gulp.task('copy_images', function () {
    return gulp.src(srcPath.img)
        .pipe(gulp.dest(buildPath.base));
});


/* **************************
 * task - watch and server
 * **************************/

// html, app js, app css, image 변경시 해당 task 실행됨
gulp.task('watch', function () {
    // minify
    gulp.watch(srcPath.vendorCss, ['minify_vendor_css']);
    gulp.watch(srcPath.appCss, ['minify_app_css']);
    gulp.watch(srcPath.vendorJs, ['minify_vendor_js']);
    gulp.watch(srcPath.appJs, ['minify_app_js']);
    // copy
    gulp.watch(srcPath.img, ['copy_images']);
    gulp.watch(srcPath.html, ['copy_html']);
});

gulp.task('server', ['watch'], function () { //<-- 의존성 'watch' 추가
    return gulp.src(buildPath.base) //<-- build 디렉토리의 파일을 웹루트로 하고 웹서버 가동
        .pipe(webserver({ //<-- port 8000 by default
            livereload: true
        }))
        .pipe(open({ //<-- 브라우저 오픈
            uri: "http://localhost:8000/index.html",
            app: 'Google Chrome'
        }));
});

gulp.task('clean', function () {
    return gulp.src(buildPath.base, {read: false})
        .pipe(clean());
});

// make a master gulp task to run all the above tasks
gulp.task('default', ['clean'], function() {
    runSeq(
        'minify_vendor_css',
        'minify_app_css',
        'minify_vendor_js',
        'minify_app_js',
        'copy_html',
        'copy_images',
        'server'
    );
});


