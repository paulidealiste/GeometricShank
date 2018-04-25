const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    entry: {
        app: './main.js',
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    output: {
        filename: 'geometric-shank.js',
        library: "GeometricShank",
        libraryTarget: "var",
        libraryExport: "default",
    },
    node: {
        fs: 'empty'
    }
});