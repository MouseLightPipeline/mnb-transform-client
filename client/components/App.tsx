import * as React from "react";
import {Label, Menu, Segment, Image} from "semantic-ui-react";

import {Content} from "./Content";
import {SYSTEM_MESSAGE_QUERY, SystemMessageQuery} from "../graphql/systemMessage";
import {ToastContainer, ToastPosition} from "react-toastify";

const logo = require("file-loader!../../assets/mouseLight_nb_color.svg");

const toastStyleOverride = {
    minWidth: "600px"
};

const PageHeader = () => (
    <Menu inverted fluid stackable fixed="top">
        <Menu.Item>
            <Image size="small" src={logo}/>
        </Menu.Item>
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
    <div>
        <ToastContainer autoClose={3000} position={"bottom-center" as  ToastPosition} style={toastStyleOverride}/>
        <PageHeader/>
        <div style={{marginTop: "62px", padding: "20px"}}>
            <Content/>
        </div>
        <Segment size="small" attached="bottom" inverted>
            Mouse Light Neuron Browser Copyright © 2016 - {(new Date().getFullYear())} Howard Hughes Medical
            Institute
        </Segment>
    </div>
);
