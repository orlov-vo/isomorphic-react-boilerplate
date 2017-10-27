const resolve = require('path').resolve;

exports.distPath = resolve(process.cwd(), 'dist');
exports.outputPath = resolve(exports.distPath, 'public');
exports.contentBasePath = resolve(__dirname, 'public');
exports.srcPath = resolve(__dirname, 'src', 'client');
exports.stylesheetsPath = resolve(__dirname, 'src', 'styles');
