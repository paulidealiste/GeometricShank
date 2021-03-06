const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const { spawn } = require('child_process');

module.exports = merge(common, {
  entry: {
    app: './src/main/index.js',
    vendor: ['vue']
  },
  target: "electron-main",
  devtool: 'source-map',
  devServer: {
    after(app) {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    }
  },
});
