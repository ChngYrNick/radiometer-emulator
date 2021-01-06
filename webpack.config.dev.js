const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'development',
	entry: {
		main: './src/scripts/index.js',
	},
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/views/index.html',
      filename: 'index.html',
			chunks: ['main']
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './public',
    // hot: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  devtool: 'inline-source-map'
});
