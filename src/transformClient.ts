const Webpack = require("webpack");

const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../webpack.config.js");

const serverConfig = require("./serverConfig").default();

const localUri = `http://localhost:${serverConfig.port}`;
const apiUri = `http://${serverConfig.graphQlHostname}:${serverConfig.graphQlPort}`;

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    stats: {
        colors: true
    },
    proxy: {
        "/graphql": {
            target: apiUri
        }
    },
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    noInfo: false,
    quiet: false});

server.listen(serverConfig.port, "0.0.0.0", () =>{
    console.log(`Listening at ${localUri}/`);
    console.log(`\t with graphql proxy to ${apiUri}`)
});
