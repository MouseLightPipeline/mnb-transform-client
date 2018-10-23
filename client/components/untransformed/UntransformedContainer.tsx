import * as React from "react";
import {Grid, Row, Col, Panel, Alert} from "react-bootstrap";

import {UntransformedSwcTable} from "./UntransformedSwc";
import {UNTRANSFORMED_SWC_QUERY, UntransformedSwcQuery} from "../../graphql/swcTracings";

export const UntransformedContainer = () => (
    <Grid fluid>
        <Row>
            <Col xs={12}>
                <Panel header={renderHeader()}>
                    <UntransformedSwcQuery query={UNTRANSFORMED_SWC_QUERY} pollInterval={5000}>
                        {({loading, error, data}) => {
                            if (error) {
                                return (
                                    <Alert bsStyle="danger">
                                        <div>
                                            <h5>Service Error</h5>
                                            {this.props.data.error.message}
                                        </div>
                                    </Alert>
                                );
                            }

                            if (!loading && data.untransformedSwc.length === 0) {
                                return "There are no untransformed tracings";
                            }

                            return (<UntransformedSwcTable loading={loading} untransformedSwc={data.untransformedSwc}/>);
                        }}
                    </UntransformedSwcQuery>
                </Panel>
            </Col>
        </Row>
    </Grid>
);

const renderHeader = () => (
    <div>
        <div style={{display: "inline-block"}}>
            <h4>Untransformed SWC Tracings</h4>
        </div>
    </div>
);
