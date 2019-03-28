import * as React from "react";

import {TracingSelection} from "./TracingSelection";
import {TracingViewer} from "./TracingViewer";
import {Header, Segment} from "semantic-ui-react";
import {CONSTANTS_QUERY, ConstantsQuery} from "../../graphql/constants";
import {CompartmentsViewModel} from "../../viewmodel/compartmentsViewModel";

type TracingViewerContainerState = {
    compartments: CompartmentsViewModel;
}

export class TracingViewerContainer extends React.Component<{}, TracingViewerContainerState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            compartments: null
        }
    }
    public render = () => (
        <ConstantsQuery query={CONSTANTS_QUERY}>
            {({loading, error, data}) => {
                this.setState({compartments: new CompartmentsViewModel(data)});

                return (
                    <div style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
                        <Header attached="top" content="Tracing Viewer" block as="h3" color="blue"/>
                        <Segment attached>
                            <TracingSelection/>
                        </Segment>
                        <Segment attached style={{paddingTop: 0, paddingBottom: 0}}>
                            <TracingViewer/>
                        </Segment>
                    </div>
                );
            }}
        </ConstantsQuery>
    );
}
