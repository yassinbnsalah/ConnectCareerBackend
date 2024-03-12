const path = require('path');

module.exports = {
  entry: './app.js', // Point d'entrée de votre application
  output: {
    path: path.resolve(__dirname, 'dist'), // Répertoire de sortie
    filename: 'bundle.js' // Nom du bundle de sortie
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Appliquer cette règle aux fichiers .js
        exclude: /node_modules/, // Exclure le répertoire node_modules
        use: {
          loader: 'babel-loader', // Utiliser babel-loader pour la transpilation
          options: {
            presets: ['@babel/preset-env'] // Utiliser @babel/preset-env pour la conversion de ES6+ en ES5
          }
        }
      }
    ]
  }, 
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "fs": false
    }
  }
};
