var rules = require("./rules");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    filename: '[name]_[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.ts', '.tsx', '.js', '.sass', '.scss', '.html']
  },
  devtool: "cheap-module-source-map",
  plugins: [
    //new BundleAnalyzerPlugin({
    //  analyzerMode: 'static'
    //}),

    new webpack.optimize.UglifyJsPlugin(
      {
        warning: false,
        mangle: true,
        comments: false
      }
    ),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body'
      //hash: true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module, count) {
        var context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.jquery': 'jquery'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),

    new CopyWebpackPlugin([
      // {output}/file.txt
      //{ from: 'src/assets', to: 'src/assets' },
      //{ from: 'favicon.ico', to: 'favicon.ico' },
      //{ from: 'statics/_redirects', to: './' },
      //{ from: 'statics/robots.txt', to: 'robots.txt' },
    ]),

    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false
    })
  ],
  module: {
    rules: rules
  }
};