import * as React from "react";
import {ApolloProvider} from "react-apollo";
import ApolloClient from "apollo-client";
import {createNetworkInterface} from "apollo-client";
import {addGraphQLSubscriptions, SubscriptionClient} from 'subscriptions-transport-ws';
import {Navbar} from "react-bootstrap"
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {Content} from "./Content";

declare let window: { __APOLLO_STATE__: any, location: any };

const networkInterface = createNetworkInterface({
    uri: "/graphql"
});

const uri = window.location.href.replace("http://", "ws://");

const wsClient = new SubscriptionClient(`${uri}subscriptions`, {
    reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
);

const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
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

const toastStyleOverride = {
    minWidth: "600px"
};

export class App extends React.Component<IAppProps, IAppState> {
    public render() {
        return (
            <ApolloProvider client={client}>
                <div>
                    <ToastContainer autoClose={3000} position="bottom-center" style={toastStyleOverride}/>
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