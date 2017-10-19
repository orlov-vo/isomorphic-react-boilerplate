const autoprefixer = require('autoprefixer');
const postcssShort = require('postcss-short');

const shortConfig = { fontWeights: false };
['border', 'borderRadius', 'color', 'fontSize', 'position', 'size', 'spacing'].forEach((val) => {
  shortConfig[val] = { skip: '_' };
});

module.exports = function () {
  return [
    postcssShort(shortConfig),
    autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'] // https://github.com/ai/browserslist
    }),
  ];
};

