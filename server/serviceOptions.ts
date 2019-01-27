const configurations: any = {
    port: 5000,
    graphQLPort: 5000,
    graphQLHostname: "transform-api",
    graphQLEndpoint: "graphql",
    staticHostname: "static-api",
    staticEndpoint: "static",
    staticPort: 5000,
    authRequired: true,
    authUser: "mouselight",
    authPassword: "auth_secret" // always override this, but in the event env is not set, don't leave completely open
};

function loadConfiguration() {
    const config = Object.assign({}, configurations);

    config.port = process.env.TRANSFORM_CLIENT_PORT || config.port;
    config.graphQLHostname = process.env.TRANSFORM_API_HOST || process.env.CORE_SERVICES_HOST || config.graphQLHostname;
    config.graphQLPort = parseInt(process.env.TRANSFORM_API_PORT) || config.graphQLPort;
    config.staticHostname = process.env.STATIC_API_HOST || process.env.CORE_SERVICES_HOST || config.staticHostname;
    config.staticPort = parseInt(process.env.STATIC_API_PORT) || config.staticPort;
    config.authRequired = process.env.TRANSFORM_AUTH_REQUIRED !== "false";
    config.authUser = process.env.TRANSFORM_AUTH_USER || config.authUser;
    config.authPassword = process.env.TRANSFORM_AUTH_PASS || config.authPassword;

    return config;
}

export const ServiceOptions = loadConfiguration();