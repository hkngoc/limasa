const path = require('path');

const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

const ENV = process.env.NODE_ENV || 'development';
const HOST = 'localhost';
const PORT = 3000;

module.exports = {
  mode: ENV,
  entry: {
    index: path.join(__dirname, 'src', 'index.js'),
    background: path.join(__dirname, 'src', 'background.js'),
    content: path.join(__dirname, 'src', 'content.js')
  },
  output: {
    path: path.resolve(__dirname, ENV === 'production' ? 'build' : 'dev'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.(css)$/,
      loaders: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false
    }),
    new HTMLPlugin({
      title: 'Limasa',
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index'],
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: './assets' },
        { from: './src/manifest.json', to: './manifest.json' }
      ]
    }),
    new ChromeExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { // The entries used for the content/background scripts
        contentScript: 'content', // Use the entry names, not the file name or the path
        background: 'background' // *REQUIRED
      }
    })
  ],
  stats: {
    colors: true
  },
  devtool: ENV === 'production' ? '' : 'eval-cheap-source-map',
  devServer: {
    port: process.env.PORT || PORT,
    host: HOST,
    publicPath: '/',
    contentBase: path.join(__dirname, ENV === 'production' ? 'build' : 'dev'),
    open: true,
    // historyApiFallback: true,
    // openPage: '',
    // proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    // }
  }
}
