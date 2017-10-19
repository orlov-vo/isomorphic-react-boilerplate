const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const commonPaths = require('./paths');
const {
  styleLoader,
  cssLoader,
  sassLoader,
  postcssLoader,
  threadLoader,
  tsLoader,
} = require('./loaders');

module.exports = {
  entry: {
    bundle: [
      './src/client/index.prod.tsx',
      './src/styles/main.scss',
    ]
  },

  // Don't attempt to continue if there are any errors.
  bail: true,

  // To enhance the debugging process. More info: https://webpack.js.org/configuration/devtool/
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',

  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: commonPaths.contentBasePath + '/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({
      'DEBUG': false,                                 // Doesn´t have effect on my example
      '__DEVTOOLS__': false                           // Doesn´t have effect on my example
    }),
    new ExtractTextPlugin({
      filename: 'css/main.css',
      allChunks: true
    }),
    // Plugings for optimizing size and performance.
    // Here you have all the available by now:
    //    Webpack 1. https://github.com/webpack/webpack/blob/v1.13.3/lib/optimize
    //    Webpack 2. https://github.com/webpack/webpack/tree/master/lib/optimize
    //    Webpack 3. uglify-js is not external (peer) dependency.
    //              We should install version <= 2.8 by now (19/06/2017) because version 3 is not supported by plugin
    new webpack.optimize.UglifyJsPlugin({
      // more info: http://lisperator.net/uglifyjs/compress
      compress: {
        sequences: true, // join consecutive statemets with the “comma operator”
        properties: true, // optimize property access: a['foo'] → a.foo
        dead_code: true, // discard unreachable code
        drop_debugger: true, // discard “debugger” statements
        unsafe: false, // some unsafe optimizations (see below)
        conditionals: true, // optimize if-s and conditional expressions
        comparisons: true, // optimize comparisons
        evaluate: true, // evaluate constant expressions
        booleans: true, // optimize boolean expressions
        loops: true, // optimize loops
        unused: true, // drop unused variables/functions
        hoist_funs: true, // hoist function declarations
        hoist_vars: false, // hoist variable declarations
        if_return: true, // optimize if-s followed by return/continue
        join_vars: true, // join var declarations
        cascade: true, // try to cascade `right` into `left` in sequences
        side_effects: true, // drop side-effect-free statements
        warnings: false, // warn about potentially dangerous optimizations/code
        global_defs: {
          __REACT_HOT_LOADER__: undefined // eslint-disable-line no-undefined
        }
      },
      sourceMap: true,
      output: {
        comments: false
      }
      // more options: https://github.com/webpack-contrib/uglifyjs-webpack-plugin
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  module: {
    rules: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          '/node_modules/'
        ]
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.ts(x?)$/,
        use: [
          { loader: 'cache-loader' },
          threadLoader,
          tsLoader,
        ],
        include: commonPaths.srcPath,
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        include: commonPaths.stylesheetsPath,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoader,
            postcssLoader,
          ]
        })
      },
      {
        test: /\.s(c|a)ss$/i,
        include: commonPaths.stylesheetsPath,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoader,
            postcssLoader,
            sassLoader,
          ]
        })
      },
    ]
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //     'react': 'React',
  //     'react-dom': 'ReactDOM'
  // }
};
