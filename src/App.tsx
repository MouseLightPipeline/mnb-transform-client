import * as React from "react";
import {ApolloProvider} from "react-apollo";
import ApolloClient from "apollo-client";
import {createNetworkInterface} from "apollo-client";
import {Navbar} from "react-bootstrap"

import {Content} from "./Content";

declare let window: {__APOLLO_STATE__: any};

const networkInterface = createNetworkInterface({
    uri: "/graphql"
});

// const wsClient = new Client("ws://localhost:8080");

// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//    networkInterface,
//    wsClient,
// );

const client = new ApolloClient({
    networkInterface: networkInterface,
    addTypename: true,
    dataIdFromObject: (result: any) => {
        if (result.id) {
            return result.__typename + result.id;
        }
        return null;
    },
    initialState: window.__APOLLO_STATE__,
    connectToDevTools: true
});

const styles = {
    content: {
        marginTop: "60px"
    }
};

interface IAppProps {
}

interface IAppState {
}

export class App extends React.Component<IAppProps, IAppState> {
    public render() {
        return (
            <ApolloProvider client={client}>
                <div>
                    <Navbar fixedTop fluid={true}>
                        <Navbar.Header>
                            <Navbar.Brand>
                                Transform Service
                            </Navbar.Brand>
                        </Navbar.Header>
                    </Navbar>
                    <div style={styles.content}>
                        <Content/>
                    </div>
                </div>
            </ApolloProvider>
        );
    }
}