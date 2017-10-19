const webpackMerge = require('webpack-merge');
const errorConstants = require('./error-contants');
const commonConfig = require('./webpack.common');

module.exports = (env) => {
  if (!env) {
    throw new Error(errorConstants.ERR_NO_ENV_FLAG);
  }

  if (env.env === 'prod') {
    process.env.NODE_ENV = 'production';
  }

  const envConfig = require(`./webpack.${env.env}.js`);
  return webpackMerge(commonConfig, envConfig);
};
