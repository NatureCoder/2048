const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            title: '2048 game - production'
        })
    ],
    output: {
        filename: 'bundle.min.js',
    }
});