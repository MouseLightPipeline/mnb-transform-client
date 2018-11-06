"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
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
    mode: "production",
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
};
//# sourceMappingURL=webpack.config.js.map