const externals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [externals()]
};
