var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var utils = require('./utils')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')


var entries = utils.entries
var pageArray

var useSourceMap = true
webpackConfig.devtool = useSourceMap ? 'source-map' : false

// 取掉前两个参数，分别为node和build
process.argv.splice(0, 2)

if (process.argv.length) {
  // 若传入页面参数，则单页面打包
  pageArray = process.argv;
} else {
  // 若无传入页面参数，则全块打包
  pageArray = Object.keys(entries)
  console.log(pageArray)
}

// 开始输出loading状态
var spinner = ora('building for production...')
spinner.start()

pageArray.forEach(function (val, index, array) {
  rm(path.join(__dirname, '..', 'dist', val), err => {
    if (err) throw err
    // print pageName[]
    console.log(index + ': ' + val);
    webpackConfig.output = Object.assign({}, webpackConfig.output)
    webpackConfig.output.path = path.join(__dirname, '..', 'dist', val)
    // 需要将资源发到cdn或某些位置
    // webpackConfig.output.publicPath = '//your/public/path/' + val + '/'
    // 输出目录dist/pageName
    webpackConfig.output.path = path.join(__dirname, '..', 'dist', val);
    // 入口文件设定为指定页面的入口文件
    // main.js这里为通用入口文件
    webpackConfig.entry = {};
    webpackConfig.entry[index] = path.join(__dirname, '..', 'src', val, 'main.js');
    // 添加index.html主文件
    webpackConfig.plugins = [
      new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: 'index.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './index.html',
        // 或使用单独的模版
        // template: './src/' + val + '/index.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        // chunks: [name]
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: useSourceMap
      })
    ];
    // 开启打包
    webpack(webpackConfig, function (err, stats) {
      spinner.stop()

      // 输出错误信息
      if (err) throw err

      // 输出打包完成信息
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      console.log(chalk.cyan('  Build complete: ' + val + '\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  });
})
