var rules = require("./rules");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/index'
  ],
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  resolve: {
    modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
    ],
    extensions: ['.ts', '.tsx', '.js', '.sass', '.scss', '.html']
  },
  devtool: "source-map",
  plugins: [
      //new BundleAnalyzerPlugin({
      //  analyzerMode: 'static'
      //}),

      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body'
        //hash: true
      }),
	  
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.jquery': 'jquery'
      }),

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