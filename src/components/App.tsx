import * as React from "react";
import {InjectedGraphQLProps} from "react-apollo";
import {Navbar, Nav, Glyphicon, Badge, NavItem, Modal, Button} from "react-bootstrap"
import {Link} from "react-router";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {Content} from "./Content";
import graphql from "react-apollo/lib/graphql";
import {SystemMessageQuery} from "../graphql/systemMessage";

const logoImage = require("file-loader!../../public/mouseLight_logo_web_white.png");

const styles = {
    content: {
        marginTop: "50px",
        marginBottom: "50px"
    }
};

const toastStyleOverride = {
    minWidth: "600px"
};

interface IHeadingProps extends InjectedGraphQLProps<ISystemMessageQuery> {
    onSettingsClick(): void;
}

interface IHeadingState {
}

interface ISystemMessageQuery {
    systemMessage: string;
}

@graphql(SystemMessageQuery, {
    options: {
        pollInterval: 5000
    }
})
class Heading extends React.Component<IHeadingProps, IHeadingState> {
    public render() {
        if (this.props.data && this.props.data.error) {
            console.log(this.props.data.error);
        }

        return (
            <Navbar fluid fixedTop style={{marginBottom: 0}}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            <img src={logoImage}/>
                        </Link>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight style={{marginRight: "15px"}}>
                        <NavItem onSelect={() => this.props.onSettingsClick()}>
                            <Glyphicon glyph="cog"/>
                        </NavItem>
                    </Nav>
                    <Navbar.Text pullRight><Badge>{this.props.data.systemMessage}</Badge></Navbar.Text>
                </Navbar.Collapse>
            </Navbar>);
    }
}

const Footer = () => (
    <div className="footer">
        <span>Mouse Light Neuron Data Browser Copyright © 2016 - 2017 Howard Hughes Medical Institute</span>
    </div>
);

interface IAppProps {
}

interface IAppState {
    isSettingsOpen: boolean;
}

export class App extends React.Component<IAppProps, IAppState> {
    public constructor(props: IAppProps) {
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

interface ISettingsDialogState {
}

class SettingsDialog extends React.Component<ISettingsDialogProps, ISettingsDialogState> {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} aria-labelledby="contained-modal-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-sm">Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    There are no settings for this service.
                </Modal.Body>
                <Modal.Footer>
                    <Button bsSize="small" onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
