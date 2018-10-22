const path = require('path');

const presetEnv = require('@babel/preset-env/lib/index.js');
delete presetEnv.default;
delete presetEnv.isPluginRequired;
delete presetEnv.transformIncludesAndExcludes;

module.exports = {
  entry: {
    vue: 'vue',
    index: resolve('src/renderer/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        // vue-loader configuration
        test: /\.vue%/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ['vue-style-loader', {
              loader: 'css-loader',
            }]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: 'static/fonts/'
            }
          }
        ]
      }
    ]
  }
};
