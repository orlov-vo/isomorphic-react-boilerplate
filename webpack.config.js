const webpack = require('webpack');
const { resolve } = require('path');

// Webpack Blocks
const { createConfig, match, entryPoint, setOutput, env, defineConstants, sourceMaps, addPlugins } = require('@webpack-blocks/webpack');
const { css, file, url } = require('@webpack-blocks/assets');
const babel = require('@webpack-blocks/babel');
const tslint = require('@webpack-blocks/tslint');
const devServer = require('@webpack-blocks/dev-server');
const extractText = require('@webpack-blocks/extract-text');
const postcss = require('@webpack-blocks/postcss');
const sass = require('@webpack-blocks/sass');
const typescript = require('@webpack-blocks/typescript');
const uglify = require('@webpack-blocks/uglify');
const happypack = require('webpack-blocks-happypack');

// Webpak Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// PostCSS Plugins
const autoprefixer = require('autoprefixer');
const postcssShort = require('postcss-short');

// Local deps
const { outputPath, contentBasePath } = require('./paths');

// Constants
const port = parseInt(process.env.PORT, 10) || 3000;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || 'localhost';

const shortConfig = { fontWeights: false };
['border', 'borderRadius', 'color', 'fontSize', 'position', 'size', 'spacing'].forEach((val) => {
  shortConfig[val] = { skip: '_' };
});

const postcssPlugins = [
  postcssShort(shortConfig),
  autoprefixer({
    browsers: ['last 2 versions', 'ie >= 9'] // https://github.com/ai/browserslist
  }),
];

// Webpack Config
module.exports = createConfig([
  setOutput({
    filename: 'js/[name].[hash].js',
    path: outputPath,
    chunkFilename: 'js/[name].chunk.js',
    publicPath: './',
  }),
  babel(),
  tslint({
    configFile: './tsconfig.client.json',
  }),
  typescript({
    configFileName: './tsconfig.client.json',
  }),
  match(/\.css$/, { exclude: resolve('node_modules') }, [
    css(),
    postcss({ plugins: postcssPlugins }),
    env('production', [extractText()]),
  ]),
  match(/\.s(c|a)ss$/, { exclude: resolve('node_modules') }, [
    css(),
    postcss({ plugins: postcssPlugins }),
    sass(),
    env('production', [extractText()]),
  ]),
  match(/\.(gif|jpe?g|png|webp)$/, [
    file(),
  ]),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV,
  }),
  addPlugins([
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new CopyWebpackPlugin([
      { from: 'public' }
    ], {
        ignore: [
          // Doesn't copy any files with a html extension
          '*.html',
        ],
      }),
  ]),
  env('development', [
    entryPoint({
      bundle: [
        'react-hot-loader/patch',
        './src/client/index.dev.tsx',
        './src/styles/main.scss',
      ],
    }),
    setOutput({
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
    }),
    devServer({
      contentBase: contentBasePath,
      publicPath: '/',
      host: host,
      https: protocol === 'https',
      port: port,
    }),
    sourceMaps(),
    addPlugins([
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: contentBasePath + '/index.html',
      }),
    ]),
  ]),
  env('production', [
    entryPoint({
      bundle: [
        './src/client/index.prod.tsx',
        './src/styles/main.scss',
      ],
    }),
    uglify(),
    addPlugins([
      new HtmlWebpackPlugin({
        inject: true,
        template: contentBasePath + '/index.html',
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
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
    ]),
  ]),
]);

