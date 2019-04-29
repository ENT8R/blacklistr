const path = require('path');

module.exports = {
  mode: 'production',
  watch: true,
  entry: './js/src/main.js',
  output: {
    path: path.resolve(__dirname, 'js/dist'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.js'
  },
  devServer: {
    contentBase: __dirname,
    watchContentBase: true,
    publicPath: '/',
    compress: true,
    port: 8000
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      },
      {
        test: /\.geojson$/i,
        loader: 'json-loader'
      }
    ]
  }
};
