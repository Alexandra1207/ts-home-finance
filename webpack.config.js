const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "static/images", to: "images"},
                {from: "node_modules/bootstrap-icons/bootstrap-icons.svg", to: "images/icons"},
            ],
        }),
    ],
    // module: {
    //     rules: [
    //         // ...
    //         {
    //             test: /\.css$/,
    //             use: ['style-loader', 'css-loader'],
    //         },
    //         {
    //             test: /\.tsx?$/,
    //             loader: 'ts-loader',
    //             exclude: /node_modules/,
    //         },
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['@babel/preset-env']
    //                 }
    //             }
    //         },
    //         {
    //             test: /\.(woff|woff2|eot|ttf|otf)$/,
    //             use: ['file-loader'],
    //         },
    //     ],
    // },
};