import * as React from "react";
import {ApolloProvider} from "react-apollo";
import ApolloClient, {createNetworkInterface} from "apollo-client";
import {addGraphQLSubscriptions, SubscriptionClient} from "subscriptions-transport-ws";

import {App} from "./App";

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

interface IApolloAppProps {
}

interface IApolloAppState {
}

export class ApolloApp extends React.Component<IApolloAppProps, IApolloAppState> {
    public render() {
        return (
            <ApolloProvider client={client}>
                <App children={this.props.children}/>
            </ApolloProvider>
        );
    }
}
