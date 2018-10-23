import * as React from "react";
import {Navbar, Nav, Glyphicon, Badge, NavItem, Modal, Button} from "react-bootstrap"
import {ToastContainer} from 'react-toastify';

import {Content} from "./Content";
import {SYSTEM_MESSAGE_QUERY, SystemMessageQuery} from "../graphql/systemMessage";

const logoImage = require("file-loader!../../assets/mouseLight_logo_web_white.png");

const styles = {
    content: {
        marginTop: "50px",
        marginBottom: "50px"
    }
};

const toastStyleOverride = {
    minWidth: "600px"
};

interface IHeadingProps {
    onSettingsClick(): void;
}

const Heading = (props: IHeadingProps) => (
    <Navbar fluid fixedTop style={{marginBottom: 0}}>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="/">
                    <img src={logoImage}/>
                </a>
            </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav pullRight style={{marginRight: "15px"}}>
                <NavItem onSelect={() => props.onSettingsClick()}>
                    <Glyphicon glyph="cog"/>
                </NavItem>
            </Nav>
            <SystemMessageQuery query={SYSTEM_MESSAGE_QUERY} pollInterval={5000}>
                {({loading, error, data}) => {
                    if (loading || error) {
                        return null;
                    }
                    return (
                        <Navbar.Text pullRight><Badge>{data.systemMessage}</Badge></Navbar.Text>
                    );
                }}
            </SystemMessageQuery>
        </Navbar.Collapse>
    </Navbar>
);

const Footer = () => (
    <div className="footer">
        <span>Mouse Light Neuron Data Browser Copyright © 2016 - 2017 Howard Hughes Medical Institute</span>
    </div>
);

interface IAppState {
    isSettingsOpen: boolean;
}

export class App extends React.Component<{}, IAppState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            isSettingsOpen: false
        }
    }

    private onSettingsClick() {
        this.setState({isSettingsOpen: true}, null);
    }

    private onSettingsClose() {
        this.setState({isSettingsOpen: false}, null);
    }

    public render() {
        return (
            <div>
                <ToastContainer autoClose={3000} position="bottom-center" style={toastStyleOverride}/>
                <SettingsDialog show={this.state.isSettingsOpen}
                                onHide={() => this.onSettingsClose()}/>
                <Heading onSettingsClick={() => this.onSettingsClick()}/>
                <div style={styles.content}>
                    <Content/>
                </div>
                <Footer/>
            </div>
        );
    }
}

interface ISettingsDialogProps {
    show: boolean

    onHide(): void;
}

const SettingsDialog = (props: ISettingsDialogProps) => (
    <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-sm">Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            There are no settings for this service.
        </Modal.Body>
        <Modal.Footer>
            <Button bsSize="small" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
    </Modal>
);
