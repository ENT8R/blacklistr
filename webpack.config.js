const path = require('path');

module.exports = {
  mode: 'production',
  watch: true,
  entry: './js/main.mjs',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].min.js',
    chunkFilename: 'js/[name].min.js',
    publicPath: 'dist/'
  },
  devServer: {
    contentBase: __dirname,
    watchContentBase: true,
    publicPath: '/dist/',
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
        type: 'json',
      }
    ]
  }
};
