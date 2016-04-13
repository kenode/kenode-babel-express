#!/usr/bin/env node
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import del from 'del'
import sequence from 'run-sequence'
import minifyCss from 'gulp-minify-css'
import sprite from 'gulp-css-spriter'
import frontMatter from 'gulp-front-matter'
import { unlink } from 'fs'
import path from 'path'
import gutil from 'gulp-util'
import chalk from 'chalk'
import prettyTime from 'pretty-hrtime'
import { paths, vendor, assets, compile, server, watch } from './gulp.config'

const $ = gulpLoadPlugins()
const runSequence = sequence.use(gulp)

// 清理目录
gulp.task('clean', () =>
  del.sync(paths.base, { dot: true })
)

// 合并并压缩公共包的样式表
gulp.task('vendor-style', () => {
  return gulp.src(vendor.style)
             .pipe($.concat(vendor.filename.style))
             .pipe($.minifyCss())
             .pipe(gulp.dest(paths.style))
})

// 合并并压缩公共包的JS文件
gulp.task('vendor-js', () => {
  return gulp.src(vendor.js)
             .pipe($.concat(vendor.filename.js))
             .pipe($.uglify())
             .pipe(gulp.dest(paths.js))
})

// 拷贝公共包资源
gulp.task('vendor-copys', () => {
  return gulp.src(vendor.copys, { dot: true})
             .pipe(gulp.dest( file => {
               let filePath = file.path.toLowerCase();
               if (/\.(js|js.map)$/.test(filePath)) {
                 return paths.js
               }
               if (/\.(css|css.map)$/.test(filePath)) {
                 return paths.style
               }
               if (/\.(eot|svg|ttf|woff|woff2|otf)$/.test(filePath)) {
                 return paths.fonts
               }
               return paths.base
             }))
})

// 压缩资源图片
gulp.task('assets-image', () => {
  return gulp.src(assets.image.file)
             .pipe($.imagemin(assets.image.opts))
             .pipe(gulp.dest(paths.image))
})

// 编译SASS动态样式表
gulp.task('assets-style', () => {
  return gulp.src(assets.style.entry)
             .pipe($.sass().on('error', $.sass.logError))
             .pipe($.autoprefixer({
               browsers: [
                 'last 2 versions', 
                 'safari 5', 
                 'ie 8', 
                 'ie 9', 
                 'opera 12.1', 
                 'ios 6', 
                 'android 4'
               ],
               cascade: false
             }))
             .pipe(sprite(assets.style.sprite))
             .pipe(minifyCss())
             .pipe(gulp.dest(paths.style));
})

// 拷贝其他资源
gulp.task('assets-copys', () => {
  return gulp.src(assets.copys, { dot: true})
             .pipe(gulp.dest( file => {
               let filePath = file.path.toLowerCase();
               if (/\.(json)$/.test(filePath)) {
                 return paths.json
               }
               if (/\.(js|js.map)$/.test(filePath)) {
                 return paths.js
               }
               if (/\.(css|css.map)$/.test(filePath)) {
                 return paths.style
               }
               if (/\.(eot|svg|ttf|woff|woff2|otf)$/.test(filePath)) {
                 return paths.fonts
               }
               return paths.base
             }))
})

// 编译前端JS代码
gulp.task('compile-js', () => {
  return gulp.src(compile.entry.index)
             .pipe($.webpack(compile))
             .pipe(gulp.dest(paths.js))
})

// 编译HTML
gulp.task('compile-html', () => {
  return gulp.src(assets.html.file)
             .pipe(frontMatter({ property: 'data' }))
             .pipe($.swig({ defaults: { cache: false } }))
             .pipe(gulp.dest(paths.html))
})

// 调试用静态服务
gulp.task('server', () => {
  return gulp.src(paths.base)
             .pipe($.webserver(server))
})

// 默认任务
gulp.task('default', ['build'])

// 开发调试
gulp.task('dev', () => 
  runSequence('clean',
             ['assets-image', 'assets-style', 'assets-copys'], 
             ['vendor-style', 'vendor-js', 'vendor-copys'],
             ['compile-html'],
             ['compile-js'],
             ['server', 'watch'])
)

// 编译版本
gulp.task('build', () =>
  runSequence('clean',
             ['assets-image', 'assets-style', 'assets-copys'], 
             ['vendor-style', 'vendor-js', 'vendor-copys'],
             ['compile-js'])
)

// 监听目录变化
gulp.task('watch', () => {
  gulp.watch(watch.image, ['assets-image'])
  gulp.watch(watch.style, ['assets-style'])
  gulp.watch(watch.source, ['compile-js'])
  $.watch(watch.copys, (e) => 
    watchHandle(e, 'assets-copys')
  )
  gulp.watch(watch.html, ['compile-html'])
})

// 拓展监听功能，如新增和删除文件
function watchHandle (e, task) {
  if (e.event === 'change' || e.event === 'add') {
    runSequence(task)
    return
  }
  if (e.event === 'unlink') {
    let [_assets, _public, start] = [
      path.join(__dirname, './assets'),
      path.join(__dirname, paths.base),
      process.hrtime()
    ]
    gutil.log('Starting', '\'' + chalk.cyan(task) + '\'...')
    unlink(e.history[0].replace(_assets, _public), (err) => {
      let end = process.hrtime(start)
      let time = prettyTime(end)
      if (err) {
        gutil.log(
          '\'' + chalk.cyan(task) + '\'',
          chalk.red('errored after'),
          chalk.magenta(time)
        )
        gutil.log(err.message)
        return
      }
      gutil.log(
        'Finished', '\'' + chalk.cyan(task) + '\'',
        'after', chalk.magenta(time)
      )
    })
  }
}
