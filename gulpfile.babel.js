#!/usr/bin/env node
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import del from 'del'
import sequence from 'run-sequence'
import minifyCss from 'gulp-minify-css'
import sprite from 'gulp-css-spriter'
import frontMatter from 'gulp-front-matter'
import revReplace from 'gulp-rev-replace'
import _ from 'lodash'
import { existsSync, readFileSync, unlink, writeFileSync } from 'fs'
import path from 'path'
import gutil from 'gulp-util'
import chalk from 'chalk'
import prettyTime from 'pretty-hrtime'
import { paths, manifest, vendor, assets, compile, server, watch, auth } from './gulp.config'

const [$, runSequence] = [
  gulpLoadPlugins(),
  sequence.use(gulp)
]

const getJsonData = (file) => {
  let _auth = auth
  if (existsSync('./assets/html/auth.json')) {
    _auth = require('./assets/html/auth.json')
  }
  let data = require('./assets/html/' + path.basename(file.path) + '.json')
  if (_auth.state) {
    data = Object.assign(data, { auth: _auth.user })
  }
  return data
}

// 清理目录
gulp.task('clean', () =>
  del.sync(paths.base, { dot: true })
)

// 合并并压缩公共包的样式表
gulp.task('vendor-style', () => {
  return gulp.src(vendor.style)
             .pipe($.concat(vendor.filename.style))
             .pipe($.minifyCss())
             .pipe($.rename({ suffix: '.min' }))
             .pipe(gulp.dest(paths.style))
})

// 合并并压缩公共包的JS文件
gulp.task('vendor-js', () => {
  return gulp.src(vendor.js)
             .pipe($.concat(vendor.filename.js))
             .pipe($.uglify())
             .pipe($.rename({ suffix: '.min' }))
             .pipe(gulp.dest(paths.js))
})

// 拷贝公共包资源
gulp.task('vendor-copys', () => {
  return gulp.src(vendor.copys, { dot: true})
             .pipe(gulp.dest( file => {
               let filePath = file.path.toLowerCase()
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

// IE-Blocker
gulp.task('ie-blocker', () => {
  return gulp.src(vendor.ieblock, { dot: true })
             .pipe(gulp.dest(paths.base + '/ie-blocker'))
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
             .pipe($.rename({ suffix: '.min' }))
             .pipe(gulp.dest(paths.style));
})

// 拷贝其他资源
gulp.task('assets-copys', () => {
  return gulp.src(assets.copys, { dot: true})
             .pipe(gulp.dest( file => {
               let filePath = file.path.toLowerCase()
               if (/\.(json|html)$/.test(filePath)) {
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
             //.pipe(frontMatter({ property: 'data' }))
             .pipe($.data(getJsonData))
             .pipe($.swig({ defaults: { cache: false } }))
             .pipe(gulp.dest(paths.html))
})

// 生成模版视图
gulp.task('views-html', () => {
  return gulp.src('./assets/html/**/*.html')
             .pipe(gulp.dest('./views'))
})

// 生成版本号
gulp.task('generate-rev', () => {
  return gulp.src([
               paths.base + '/**/*.css', 
               paths.base + '/**/*.js', 
               paths.base + '/**/sprite.png'
             ])
             .pipe($.rev())
             .pipe($.sourcemaps.init())
             .pipe($.sourcemaps.write('./'))
             .pipe(gulp.dest(paths.base))
             .pipe($.rev.manifest({ merge: false }))
             .pipe(gulp.dest(paths.base))
})

// 写入版本号
gulp.task('compile-rev', () => {
  let manifestFile = gulp.src(manifest);
  return gulp.src([
               paths.base + '/**/*.html', 
               paths.base + '/**/*.css'
             ])
             .pipe(revReplace({ manifest: manifestFile }))
             .pipe(gulp.dest(paths.base))
             .on('end', () => {
               let _manifest = require(manifest)
               del.sync(paths.base + '/**/*.+(png.map)', { dot: true })
               Object.keys(_manifest).forEach( filename => {
                 del.sync(paths.base + '/' + filename, { dot: true })
               })
               let viewsObj = { style: {}, entry: {} }
               _.mapKeys(_manifest, (val, key) => {
                 let [_key, _val] = [
                   key.replace(/(css|js)(\/)([\w\-]+)(\.min\.)(css|js)/, '$3'),
                   val.replace(/(css|js)(\/)([\w\-]+)(\.min\.)(css|js)/, '$3')
                 ]
                 if (/^css\//.test(key)) {
                   viewsObj.style[_key] = _val
                 }
                 if (/^js\//.test(key)) {
                   viewsObj.entry[_key] = _val
                 }
               })
               let layout = readFileSync(paths.views + '/common/layout.html', 'utf-8')
               layout = layout.replace('css/vendor.min.css', _manifest['css/vendor.min.css'])
               layout = layout.replace('js/vendor.min.js', _manifest['js/vendor.min.js'])
               writeFileSync(paths.views + '/common/layout.html', layout)
               writeFileSync(paths.views + '/views.json', JSON.stringify(viewsObj, null, 2))
               del.sync(manifest, { dot: true })
             })
});

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
             ['vendor-style', 'vendor-js', 'vendor-copys', 'ie-blocker'],
             ['compile-html'],
             ['compile-js'],
             ['server', 'watch'])
)

// 编译版本
gulp.task('build', () =>
  runSequence('clean',
             ['assets-image', 'assets-style'], 
             ['vendor-style', 'vendor-js'],
             ['compile-js'],
             ['generate-rev'],
             ['compile-html'],
             ['views-html'],
             ['compile-rev'],
             ['vendor-copys', 'ie-blocker', 'assets-copys'])
)

// 监听目录变化
gulp.task('watch', () => {
  $.watch(watch.image, (e) => watchHandle(e, 'assets-image') )
  $.watch(watch.style, (e) => watchHandle(e, 'assets-style') )
  $.watch(watch.source, (e) => watchHandle(e, 'compile-js') )
  $.watch(watch.copys, (e) => watchHandle(e, 'assets-copys') )
  $.watch(watch.html, (e) => watchHandle(e, 'compile-html') )
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
