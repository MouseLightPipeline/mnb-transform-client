"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const src = path.join(__dirname, "client");
const dist = path.join(__dirname, "dist", "public");
module.exports = {
    context: src,
    entry: [
        "./index"
    ],
    output: {
        filename: "bundle.js",
        path: dist
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            { test: /\.css$/, use: "style-loader" },
            { test: /\.css$/, use: "css-loader" }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};
//# sourceMappingURL=webpack.config.js.map