const path = require('path');

module.exports = {
  entry: './app.js',
  output: {
<<<<<<<<< Temporary merge branch 1
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
=========
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle name
>>>>>>>>> Temporary merge branch 2
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
<<<<<<<<< Temporary merge branch 1
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader', // ou 'babel-loader' avec '@babel/preset-typescript'
        }
      },
      {
        test: /\.node$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.d\.ts$/, // Règle pour les fichiers de définition TypeScript
        use: [
          {
            loader: 'ts-loader', // Utiliser ts-loader pour gérer les fichiers .d.ts
            options: {
              // Ajoutez ici vos options ts-loader si nécessaire
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /main\.d\.ts$/,
        use: 'ignore-loader'
      }
    ]
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "fs": false, // Exclure le module 'fs' car il est spécifique à Node.js
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "util": require.resolve("util/"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "http": require.resolve("stream-http"),
      "module": false,
      "vm": require.resolve("vm-browserify"),
      "dns": false,
      "net": false,
      "tls": false,
      "assert": false,
      "child_process": false, // Exclure le module 'child_process'
      "tty": false, // Exclure le module 'tty'
      "constants": require.resolve("constants-browserify"),
      "worker_threads": false
    }
  }
=========
            presets: ['@babel/preset-env'], // Use @babel/preset-env for ES6+ to ES5 conversion
          },
        },
      },
    ],
  },

>>>>>>>>> Temporary merge branch 2
};
