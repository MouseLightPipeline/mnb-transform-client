import * as React from "react";
import {Grid, Row, Col, Panel, Alert} from "react-bootstrap";
import {graphql, InjectedGraphQLProps} from "react-apollo";

import {UntransformedSwcTable} from "./UntransformedSwc";
import {UntransformedQuery} from "../../graphql/swcTracings";
import {ISwcTracing} from "../../models/swcTracing";

interface IUntransformedGraphQLProps {
    untransformedSwc: ISwcTracing[];
}

interface ICreateContainerProps extends InjectedGraphQLProps<IUntransformedGraphQLProps> {
}

interface ICreateContainerState {
}

@graphql(UntransformedQuery, {
    options: {
        pollInterval: 60000,
    }
})
export class UntransformedContainer extends React.Component<ICreateContainerProps, ICreateContainerState> {
    private renderHeader() {
        return (
            <div>
                <div style={{display: "inline-block"}}>
                    <h4>Untransformed SWC Tracings</h4>
                </div>
            </div>
        );
    }

    private renderContent() {
        if (!this.props.data || this.props.data.loading) {
            return <h4>Loading...</h4>
        }

        if (this.props.data.error) {
            return (
                <Alert bsStyle="danger">
                    <div>
                        <h5>Service Error</h5>
                        {this.props.data.error.message}
                    </div>
                </Alert>
            );
        }

        if (this.props.data.untransformedSwc.length === 0) {
            return "There are no untransformed tracings";
        }

        return (<UntransformedSwcTable data={this.props.data}/>);
    }

    public render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        <Panel header={this.renderHeader()}>
                            {this.renderContent()}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
