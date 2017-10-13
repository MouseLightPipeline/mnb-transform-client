const Webpack = require("webpack");
const passport = require("passport");
const DigestStrategy = require("passport-http").DigestStrategy;

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
        },
        "/subscriptions/*": {
            target: apiUri,
            ws: true
        }
    },
    setup: (app: any) => {
        app.use(passport.initialize());

        app.get("/", passport.authenticate('digest', {session: false}), (request: any, response: any, next: any) => {
            next();
        });
    },
    disableHostCheck: true,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    noInfo: false,
    quiet: false
});

passport.use(new DigestStrategy({qop: 'auth'},
    function (username: any, done: any) {
        if (username === "mouselight") {
            return done(null, {id: 1, name: username}, "MostlyCloudy");
        } else {
            return done("Invalid user", null);
        }
    },
    function (params: any, done: any) {
        // validate nonces as necessary
        done(null, true)
    }
));

passport.serializeUser(function (user: any, done: any) {
    done(null, user.id);
});

passport.deserializeUser(function (id: any, done: any) {
    done(null, {id: 1, name: "mouselight"});
});

server.listen(serverConfig.port, "0.0.0.0", () => {
    console.log(`Listening at ${localUri}/`);
    console.log(`\t with graphql proxy to ${apiUri}`)
});
