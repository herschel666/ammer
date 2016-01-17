
'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'ammer.js': path.join(__dirname, 'src', 'index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        library: 'ammer',
        libraryTarget: 'umd',
        publicPath: '/',
        filename: '[name]'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel?presets[]=es2015'
        }]
    },
    resolveLoader: {
        root: [path.join(__dirname, 'node_modules')]
    }
};
