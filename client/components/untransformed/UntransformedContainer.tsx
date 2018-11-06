import * as React from "react";
import {Header, Message, Segment} from "semantic-ui-react";

import {UntransformedSwcTable} from "./UntransformedSwc";
import {UNTRANSFORMED_SWC_QUERY, UntransformedSwcQuery} from "../../graphql/swcTracings";

export const UntransformedContainer = () => (
    <Segment.Group>
        <Segment secondary>
            <Header style={{margin: "0"}}>Untransformed SWC Tracings</Header>
        </Segment>
        <UntransformedSwcQuery query={UNTRANSFORMED_SWC_QUERY} pollInterval={5000}>
            {({loading, error, data}) => {
                if (error) {
                    return (
                        <Message negative icon="exclamation triangle" header="Service not responding"
                                 content="System data could not be loaded.  Will attempt again shortly."/>
                    );
                }

                if (!loading && data.untransformedSwc.length === 0) {
                    return "There are no untransformed tracings";
                }

                return (<UntransformedSwcTable loading={loading} untransformedSwc={data.untransformedSwc}/>);
            }}
        </UntransformedSwcQuery>
    </Segment.Group>
);
