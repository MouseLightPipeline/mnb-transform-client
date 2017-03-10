import * as injectTapEventPlugin from "react-tap-event-plugin";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory} from "react-router";

import {App} from "./App";
const rootEl = document.getElementById("root");

injectTapEventPlugin();

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
    </Router>, rootEl
);
