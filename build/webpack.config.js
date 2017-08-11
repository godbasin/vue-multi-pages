var path = require('path')

var webpackConfig = {
  entry: {},
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './[hash].js',
    chunkFilename: "[name].[name].chunk.js"
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: []
}

module.exports = webpackConfig;