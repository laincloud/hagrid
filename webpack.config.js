var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './views/app.jsx'),
  output: {
    path: path.resolve(__dirname, './static/js'),
    filename: 'hagrid.js',
  },
  module: {
    loaders: [{
      test: /\.js|jsx$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=25000'
    }]
  },
  resolve: {
    root: path.join(__dirname, 'node_modules'),
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
