const configurations: any = {
    development: {
        port: 9663,
        graphQlEndpoint: "/graphql",
        graphQlHostname: "localhost",
        graphQlPort: 9661
    },
    test: {
        port: 9663,
        graphQlEndpoint: "/graphql",
        graphQlHostname: "transform-api",
        graphQlPort: 9661
    },
    production: {
        port: 9663,
        graphQlEndpoint: "/graphql",
        graphQlHostname: "transform-api",
        graphQlPort: 9661
    }
};

export default function () {
    let env = process.env.NODE_ENV || "development";

    let config = configurations[env];

    config.port = process.env.TRANSFORM_CLIENT_PORT || config.port;
    config.graphQlHostname = process.env.TRANSFORM_API_HOST || config.graphQlHostname;
    config.graphQlPort = process.env.TRANSFORM_API_PORT || config.graphQlPort;

    return config;
}
