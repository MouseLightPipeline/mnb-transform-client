import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory} from "react-router";

import {ApolloApp} from "./components/ApolloApp";

// TODO remove after replacing slider
import "rc-slider/assets/index.css";

const rootEl = document.getElementById("root");

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={ApolloApp}/>
    </Router>, rootEl
);
