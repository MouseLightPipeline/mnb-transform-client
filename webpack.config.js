const path = require("path");

module.exports = {
    entry: [
        `webpack-dev-server/client?http://localhost:9663/`,
        "./src/index"
    ],
    devServer: {
        proxy: {
            "/graphql": {
                target: `http://localhost:9661`
            },
            "/subscriptions/*": {
                target: `http://localhost:9661`,
                ws: true
            }
        },
        disableHostCheck: true
    },
    output: {
        filename: 'bundle.js',
        path: '/',
        publicPath: '/static/'
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
    devtool: 'inline-source-map',
};
