import * as path from "path";

const dist = path.join(__dirname, "public");

module.exports = {
    entry: [
        "./client/index"
    ],
    output: {
        filename: 'bundle.js',
        path: dist,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {test: /\.css$/, use: 'style-loader'},
            {test: /\.css$/, use: 'css-loader'}
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: 'inline-source-map'
};
