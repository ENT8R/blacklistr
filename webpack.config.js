const path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/main.mjs',
  output: {
    filename: 'js/[name].min.js',
    chunkFilename: 'js/[name].min.js',
    publicPath: 'dist/'
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname)
    },
    compress: true,
    port: 8000
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        type: 'asset/source'
      },
      {
        test: /\.geojson$/i,
        type: 'json',
      }
    ]
  }
};
