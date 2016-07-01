'use strict';

import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import pngquant from 'imagemin-pngquant'
import { readdirSync } from 'fs'

const paths = {
  base: './public',
  image: './public/img',
  fonts: './public/fonts',
  style: './public/css',
  js: './public/js',
  json: './public/json',
  html: './public/html',
  ieblock: './public/ie-blocker',
  views: './views'
}

const manifest = paths.base + '/rev-manifest.json'

const vendor = {
  filename: {
    style: 'vendor.css',
    js: 'vendor.js'
  },
  style: [
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'node_modules/font-awesome/css/font-awesome.css',
    'node_modules/rc-dropdown/assets/index.css',
    'node_modules/rc-dialog/assets/index.css',
    //'node_modules/dropzone/dist/base.js',
    //'node_modules/dropzone/dist/dropzone.css'
  ],
  js: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery.cookie/jquery.cookie.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/lodash/lodash.js',
    'node_modules/react/dist/react.js',
    'node_modules/react-dom/dist/react-dom.js',
    //'node_modules/react-redux/dist/react-redux.js',
    //'node_modules/redux/dist/redux.js',
    'node_modules/moment/moment.js',
    'node_modules/crypto-js/index.js',
    // 'node_modules/iscroll/build/iscroll.js',
    'node_modules/iscroll/build/iscroll-probe.js',
    //'node_modules/dropzone/dist/dropzone.js',
    //'node_modules/socket.io-client/socket.io.js'
  ],
  copys: [
    'node_modules/bootstrap/dist/fonts/*.+(eot|svg|ttf|woff|woff2)',
    'node_modules/font-awesome/fonts/*.+(eot|svg|ttf|woff|woff2|otf)'
  ],
  ieblock: 'node_modules/ie-blocker/ie-blocker/**/*.*'
}

const assets = {
  image: {
    file: ['./assets/image/**/*.+(jpg|gif|png|svg)'],
    opts: {
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
      optimizationLevel: 5,
      use: [pngquant()]
    }
  },
  style: {
    entry: ['./assets/sass/*.scss'],
    sprite: {
      'spriteSheet': paths.image + '/sprite.png',
      'pathToSpriteSheetFromCSS': '../img/sprite.png'
    }
  },
  copys: [
    './assets/json/**/*.+(json|html)'
  ],
  html: {
    file: ['./assets/html/*.+(html|htm)']
  },
  views: {
    file: ['./views/**/*.html']
  }
}

const compile = {
  entry: getEntry('./frontend'),
  output: {
    path: path.join(process.cwd(), 'public', 'js'),
    filename: '[name].min.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  externals: {
    'lodash': '_',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'crypto-js': 'CryptoJS',
    //'socketio': 'socket.io'
  },
  module: {
    loaders: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin()
  ],
  //devtool: 'source-map'
}

const server = {
  host: 'localhost',
  port: 8000,
  livereload: true,
  directoryListing: false,
  open: false
}

const watch = {
  image: ['./assets/image/**/*.+(png|gif|jpg|jpeg|svg)'],
  style: ['./assets/sass/**/*.scss', './assets/sprite/**/*.png'],
  source: ['./frontend/**/*.+(js|jsx)'],
  copys: ['./assets/json/**/*.+(json|html)'],
  html: ['./assets/html/**/*.+(html|htm|json)']
}

const auth = {
  state: true,
  user: {
    uid: '570f610d5de77e2056cd9f8a',
    username: 'thondery'
  }
}

export { paths, manifest, vendor, assets, compile, server, watch, auth }
export default { paths, manifest, vendor, assets, compile, server, watch, auth }

function getEntry (path) {
  let [files, tag, entry] = [readdirSync(path), null, {}]
  files.forEach( filename => {
    if (/\.(js|jsx)$/.test(filename)) {
      tag = filename.replace(/\.(js|jsx)$/, '')
      entry[tag] = path + '/' + filename
    }
  })
  return entry
}
