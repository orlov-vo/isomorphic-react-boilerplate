const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonPaths = require('./paths');

const {
  styleLoader,
  cssLoader,
  sassLoader,
  postcssLoader,
  threadLoader,
  tsLoader,
} = require('./loaders');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || 'localhost';

module.exports = {
  // To enhance the debugging process. More info: https://webpack.js.org/configuration/devtool/
  entry: {
    bundle: [
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      './src/client/index.dev.tsx',
      './src/styles/main.scss',
    ]
  },
  devtool: 'inline-source-map',
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
  },
  devServer: {
    // All options here: https://webpack.js.org/configuration/dev-server/
    hot: true, // enable HMR on the server
    contentBase: commonPaths.contentBasePath, // match the output path
    publicPath: '/', // match the output `publicPath`
    host: host,
    https: protocol === 'https',
    port: DEFAULT_PORT,
    disableHostCheck: true,
    historyApiFallback: true,
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: commonPaths.contentBasePath + '/index.html',
    }),

    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),

    // do not emit compiled assets that include errors
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      // Once TypeScript is configured to output source maps we need to tell webpack
      // to extract these source maps and pass them to the browser,
      // this way we will get the source file exactly as we see it in our code editor.
      {
        enforce: 'pre',
        test: /\.(js|tsx?)$/,
        use: 'source-map-loader',
        exclude: '/node_modules/'
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'react-hot-loader/webpack' },
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
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
        ]
      },
      {
        test: /\.s(c|a)ss$/i,
        include: commonPaths.stylesheetsPath,
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
          sassLoader,
        ]
      },
    ]
  }
};
