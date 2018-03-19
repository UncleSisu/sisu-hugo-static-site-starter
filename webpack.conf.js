import webpack from 'webpack';
import path from 'path';

// Source and Output directories
// __dirname is the current directory of this file (node.js variable)
const sourcePath = path.join(__dirname, './src');
const outputPath = path.join(__dirname, './dist/js');

// Environment
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

export default {
  // Mode
  // ----------------------------------------------------------- //
  mode: nodeEnv,

  // DevTools
  // ----------------------------------------------------------- //
  // Use external source maps for production and inline for dev
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',

  // Context
  // ----------------------------------------------------------- //
  // Start in our source path directory
  context: sourcePath,

  // Entry
  // ----------------------------------------------------------- //
  // Tell webpack where to start and follows the graph of dependencies
  // so it knows what to bundle
  // To bundle multiple files into one:
  // entry: {
  //   myBundleName: ['./home.js', './events.js', './vendor.js']
  // }
  // Multiple files with multiple outputs:
  // entry: {
  //   fileNameOne: './file.js',
  //   fileNameTwo: './anotherFile.js'
  // }
  entry: {
    scripts: [
      './scripts/scripts.js'
    ]
  },

  // Output
  // ----------------------------------------------------------- //
  // Where the files will be saved to
  output: {
    path: outputPath,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    sourceMapFilename: '[file].map'
  },

  // Resolve
  // ----------------------------------------------------------- //
  // Help webpack resolve import statements
  // e.g. import React from 'react';
  resolve: {
    // Define file extensions so you can leave them off when importing
    extensions: [
      '.webpack-loader.js',
      '.web-loader.js',
      '.loader.js',
      '.js'
    ],

    // Tell webpack where to find files
    // Allows you to include them without the full path
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath
    ],

    // Manually tell webpack where older library files are
    // so they will work with modern imports like:
    // import OldLibrary from 'old-library';
    alias: {
      // Use .modernizrrc instead of full library to create a custom build
      // See loader below
      modernizr$: path.resolve(__dirname, '.modernizrrc'),
      postal: path.resolve('node_modules', 'postal/lib/postal.lodash.js'),
      Easing: path.resolve('node_modules', 'gsap/src/uncompressed/easing/EasePack.js')
    }
  },

  // Optimization
  // ----------------------------------------------------------- //
  optimization: {
    // Split all the files imported from node_modules into a separate vendor file
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  // Loaders
  // ----------------------------------------------------------- //
  // Tell webpack what loader to use for each module based on file type
  // Webpack treats every file (.css, .html, .scss, .jpg, etc.) as a module
  // Transformations/preprocessing can be applied to the source code of a module
  module: {
    rules: [
      // static files (images, svgs, fonts)
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=/[hash].[ext]'
      },
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // Javascript
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        exclude: /node_modules/,
        query: { cacheDirectory: true }
      },
      // Modernizr
      // create custom build based on .modernizrrc.json file
      // all the options: https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json
      {
        test: /\.modernizrrc(\.json)?$/,
        exclude: /node_modules/,
        use: ['modernizr-loader', 'json-loader']
      },
    ]
  },

  // Plugins
  // ----------------------------------------------------------- //
  plugins: [
    // Hash module IDs so changing local imports won't effect the vendor file's cache
    // https://webpack.js.org/guides/caching/
    new webpack.HashedModuleIdsPlugin()
  ],

  // Stats
  // ----------------------------------------------------------- //
  stats: {
    colors: {
      green: '\u001b[32m'
    }
  }
};
