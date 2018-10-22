import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory} from "react-router";

require("file-loader?name=index.html!../index.html");

import {ApolloApp} from "./components/ApolloApp";

import 'react-toastify/dist/ReactToastify.min.css';

// TODO remove after replacing slider
import "rc-slider/assets/index.css";

const rootEl = document.getElementById("root");

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={ApolloApp}/>
    </Router>, rootEl
);
