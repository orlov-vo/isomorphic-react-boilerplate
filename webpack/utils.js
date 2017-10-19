exports.isProd = process.env.NODE_ENV === 'production';
exports.isDev = !exports.isProd;
exports.isClient = process.env.BUILD_TARGET === 'client';
exports.isServer = !exports.isClient;
