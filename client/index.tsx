import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import {ApolloApp} from "./components/ApolloApp";

require("file-loader?name=index.html!../index.html");

import "react-toastify/dist/ReactToastify.min.css";

import "../assets/style.css";

// TODO remove after replacing slider
import "rc-slider/assets/index.css";

ReactDOM.render(
    <BrowserRouter>
        <ApolloApp/>
    </BrowserRouter>,
    document.getElementById("root")
);
