const Webpack = require("webpack");

const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../webpack.config.js");

const debug = require("debug")("ndb:transform-client:app");

const PORT = 9663;

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    stats: {
        colors: true
    },
    proxy: {
        "/graphql": {
            target: `http://localhost:9661`
        }
    },
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    noInfo: false,
    quiet: false});

server.listen(PORT, "0.0.0.0", () =>{
    debug(`Starting server on http://localhost:${PORT}`);
});
