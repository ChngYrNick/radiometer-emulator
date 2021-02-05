const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'production',
	entry: {
		main: './src/scripts/index.js',
	},
  output: {
    filename: './[name].[chunkhash].bundle.js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
        },
        sourceMap: false,
      }),
    ],
  },
  plugins: [
    new CompressionPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './[name].[chunkhash].styles.css',
    }),
    new HtmlWebPackPlugin({
      template: './src/views/index.html',
      filename: './index.html',
			chunks: ['main']
    }),
  ],
  devtool: 'inline-source-map'
});
