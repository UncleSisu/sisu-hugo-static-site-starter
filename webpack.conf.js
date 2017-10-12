import webpack from 'webpack';
import path from 'path';

// Source and Output directories
// __dirname is the current directory of this file (node.js variable)
const sourcePath = path.join(__dirname, './src');
const outputPath = path.join(__dirname, './dist/js');

// Environment
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

// Plugins
// ----------------------------------------------------------- //
const plugins = [
  // Allow you to reference environment variables through process.env
  new webpack.EnvironmentPlugin({
    NODE_ENV: nodeEnv
  }),

  // Prints more readable module names in the browser console on HMR updates
  // prevent ID's from changing, invalidating the cache
  new webpack.NamedModulesPlugin(),

  // Generates chunks of common modules shared between entry points
  // and splits them into separate bundles
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'manifest'],
    minChunks: Infinity
  })
];

// add to plugins array based on prod/dev environment
// If in production
if (isProd) {
  plugins.push(
    // minify the code
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // and uglify it
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    })
  );
// if in development mode
} else {
  // add dev plugins here
}

export default {
  // DevTools
  // ----------------------------------------------------------- //
  // add support for the Chrome DevTools Extension
  // use eval in prod to see compiled output
  // use source maps if in dev
  devtool: isProd ? 'cheap-source-map' : 'cheap-module-eval-source-map',

  // Context
  // ----------------------------------------------------------- //
  // start in our source path directory
  context: sourcePath,

  // Entry
  // ----------------------------------------------------------- //
  // Tell webpack where to start and follows the graph of dependencies
  // so it knows what to bundle
  // to bundle multiple files into one:
  // entry: {
  //   myBundleName: ['./home.js', './events.js', './vendor.js']
  // }
  // multiple files with multiple outputs:
  // entry: {
  //   fileNameOne: './file.js',
  //   fileNameTwo: './anotherFile.js'
  // }
  entry: {
    // dev files
    scripts: [
      './scripts/scripts.js'
    ],
    // vendor files
    // manually tell webpack to group certain files
    // instead of just relying on the CommonsChunkPlugin
    vendor: [
      'jquery',
      'jquery.easing',
      'modernizr',
      'postal'
    ]
  },

  // Output
  // ----------------------------------------------------------- //
  // where the files will be saved to
  output: {
    path: outputPath,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    sourceMapFilename: '[file].map'
  },

  // Resolve
  // ----------------------------------------------------------- //
  // help webpack resolve import statements
  // e.g. import React from 'react';
  resolve: {
    // define file extensions
    // so you can leave them off when importing
    extensions: [
      '.webpack-loader.js',
      '.web-loader.js',
      '.loader.js',
      '.js'
    ],

    // tell webpack where to find files
    // allows you to include them without the full path
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath
    ],

    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc'),
      postal: path.resolve('node_modules', 'postal/lib/postal.lodash.js'),
      Easing: path.resolve('node_modules', 'gsap/src/uncompressed/easing/EasePack.js')
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

  // see plugins setup above
  // ----------------------------------------------------------- //
  plugins,

  // Stats
  // ----------------------------------------------------------- //
  stats: {
    colors: {
      green: '\u001b[32m'
    }
  }
};
