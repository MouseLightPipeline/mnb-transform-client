import * as React from "react";
import {Label, Menu, Segment, Image} from "semantic-ui-react";
import {NavLink, Route, Switch} from "react-router-dom";
import {ToastContainer, ToastPosition} from "react-toastify";

import {Content} from "./Content";
import {SYSTEM_MESSAGE_QUERY, SystemMessageQuery} from "../graphql/systemMessage";
import {TracingViewerContainer} from "./viewer/TracingViewerContainer";

const logo = require("file-loader!../../assets/mouseLight_nb_color.svg");

const toastStyleOverride = {
    minWidth: "600px"
};

const PageHeader = () => (
    <Menu inverted fluid stackable fixed="top">
        <Menu.Item as={NavLink} exact to="/" name="/" key="/">
            <Image size="small" src={logo}/>
        </Menu.Item>
        <Menu.Item as={NavLink} exact to="/tracings" name="tracings" key="tracings">Tracings</Menu.Item>
        <Menu.Item as={NavLink} exact to="/viewer" name="viewer" key="viewer">Viewer</Menu.Item>
        <Menu.Item position="right">
            <SystemMessageQuery query={SYSTEM_MESSAGE_QUERY} pollInterval={5000}>
                {({loading, error, data}) => {
                    if (loading || error) {
                        return null;
                    }

                    if (data.systemMessage) {
                        return (<Label icon="mail" content={data.systemMessage}/>);
                    }

                    return null;
                }}
            </SystemMessageQuery>
        </Menu.Item>
    </Menu>
);

export const App = () => (
    <div style={{display: "flex", flexDirection: "column", flexGrow: 1}}>
        <ToastContainer autoClose={3000} position={"bottom-center" as  ToastPosition} style={toastStyleOverride}/>
        <PageHeader/>
        <div style={{marginTop: "62px", padding: "10px", order: 1, flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <Switch>
                <Route path="/" exact render={() => (<Content/>)}/>
                <Route path="/tracings" render={() => (<Content/>)}/>
                <Route path="/viewer" render={() => (<TracingViewerContainer/>)}/>
            </Switch>
        </div>
        <Segment size="small" attached="bottom" inverted style={{order: 2}}>
            Mouse Light Neuron Browser Copyright © 2016 - {(new Date().getFullYear())} Howard Hughes Medical
            Institute
        </Segment>
    </div>
);
