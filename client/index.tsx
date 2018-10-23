import * as React from "react";
import * as ReactDOM from "react-dom";

require("file-loader?name=index.html!../index.html");

import 'react-toastify/dist/ReactToastify.min.css';

// TODO Remove after removing bootstrap
import "../assets/mouselight.bootstrap.css";
import "../assets/style.css";

// TODO remove after replacing slider
import "rc-slider/assets/index.css";

import {ApolloApp} from "./components/ApolloApp";

ReactDOM.render(<ApolloApp/>, document.getElementById("root"));
