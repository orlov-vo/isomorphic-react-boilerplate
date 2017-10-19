const { EnvironmentPlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const commonPaths = require('./paths');
const { isProd } = require('./utils');

const config = {
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: commonPaths.outputPath,

    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'js/[name].chunk.js',

    // This is the URL that app is served from. We use "/" in development.
    publicPath: './'
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: isProd ? 'production' : 'development', // Reduces 78 kb on React library
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new CopyWebpackPlugin([
      { from: 'public' }
    ], {
        ignore: [
          // Doesn't copy any files with a html extension
          '*.html',
        ]
      })
  ]
};

module.exports = config;
