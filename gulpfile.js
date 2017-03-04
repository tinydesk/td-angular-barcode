'use strict';

const gulp =  require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const wrapCommonjs = require('gulp-wrap-commonjs');
const wrapAmd = require('gulp-wrap-amd');
const wrapUmd = require('gulp-wrap-umd');

const del = require('del');

const srcFiles = 'src/barcode.js';
const distDir = 'dist'
const libName = 'td-barcode.js';
const libMinName = 'td-barcode.min.js';

const isProd = () => argv.production;

gulp.task('default', [], () => {
  gulp.watch(srcFiles, ['transpile', 'transpileMin']);
});

gulp.task('eslint', () => {
  return gulp.src(srcFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('transpile', ['eslint'], () => {
  return gulp.src(srcFiles)
    .pipe(rename(libName))
    .pipe(babel({presets:['es2015']}))
    .pipe(gulp.dest(distDir));
});

gulp.task('transpileMin', () => {
  return gulp.src(srcFiles)
    .pipe(rename(libMinName))
    .pipe(babel({presets:['es2015']}))
    .pipe(uglify())
    .pipe(gulp.dest(distDir));
});

gulp.task('commonjs', function(){
  gulp.src(srcFiles)
    .pipe(rename(libName))
    .pipe(wrapCommonjs())
    .pipe(gulp.dest(`${distDir}/commonjs`));
});


gulp.task('amd', function() {
  gulp.src(srcFiles)
    .pipe(rename(libName))          
    .pipe(wrapAmd())
    .pipe(gulp.dest(`${distDir}/amd`));
});

gulp.task('umd', function(){
  gulp.src(srcFiles)
    .pipe(rename(libName))          
    .pipe(wrapUmd())
    .pipe(gulp.dest(`${distDir}/umd`));
});

gulp.task('publish', ['transpile', 'transpileMin', 'commonjs', 'amd', 'umd']);

gulp.task('clean', () => del('dist'));
