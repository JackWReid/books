const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
	target: 'node',
  module: {
    rules: [

      {
        test: /\.js?$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
    ],
  },
  devtool: 'source-map',
};
