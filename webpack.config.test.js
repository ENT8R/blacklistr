module.exports = {
  mode: 'production',
  target: 'node',
  // Exclude modules that should not be bundled for testing
  externals: /^(chai|fs|node-fetch)$/,
  output: {
    libraryTarget: 'commonjs'
  }
};
