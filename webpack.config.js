const path = require('path');

module.exports = {
  entry: './app.js',
  output: {

    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js', 

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {

            presets: ['@babel/preset-env'], // Use @babel/preset-env for ES6+ to ES5 conversion
          },
        },
      },
    ],
  },


};
