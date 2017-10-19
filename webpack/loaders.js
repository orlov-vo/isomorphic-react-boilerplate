const postcssPlugins = require('./postcss-plugins');
const { isProd, isDev } = require('./utils');

exports.styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: isDev,
  }
};

exports.cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: isDev,
    importLoaders: 1,
    minimize: isProd,
  },
};

exports.sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: isDev,
    precision: 8,
    includePaths: []
  }
};

exports.postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: isDev,
    plugins: postcssPlugins,
  }
};

exports.threadLoader = {
  loader: 'thread-loader',
  options: {
    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
    workers: require('os').cpus().length - 1,
  },
};

exports.tsLoader = {
  loader: 'ts-loader',
  options: {
    happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
  }
};
