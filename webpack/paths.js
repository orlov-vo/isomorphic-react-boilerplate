const resolve = require('path').resolve;

module.exports = {
  outputPath: resolve(__dirname, '..', 'dist', 'public'),
  contentBasePath: resolve(__dirname, '..', 'public'),
  srcPath: resolve(__dirname, '..', 'src', 'client'),
  stylesheetsPath: resolve(__dirname, '..', 'src', 'styles'),
}
