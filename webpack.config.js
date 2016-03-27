var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './js/app.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  worker: {
    output: {
      filename: "hash.worker.js",
      chunkFilename: "[id].hash.worker.js"
    }
  }
};
