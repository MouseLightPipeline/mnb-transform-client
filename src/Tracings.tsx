import * as React from "react";
import {Panel} from "react-bootstrap";

import {TracingTableContainer} from "./TracingsTable";
import {ITracing} from "./models/tracing";
import {NodeTableContainer} from "./NodeTable";

interface ITracingsProps {
}

interface ITracingsState {
    selectedTracing: ITracing;
}

export class Tracings extends React.Component<ITracingsProps, ITracingsState> {
    constructor(props: ITracingsProps) {
        super(props);
        this.state = {
            selectedTracing: null
        }
    }

    private onSelectTracing(tracing: ITracing) {
        this.setState({selectedTracing: tracing}, null);
    }

    public render() {
        return (
            <div>
                <Panel header="Tracings" footer="Click a tracing to view nodes">
                    <TracingTableContainer onSelectedTracing={(tracing => this.onSelectTracing(tracing))}
                                   selectedTracing={this.state.selectedTracing}/>
                </Panel>
                <Panel header="Transformed Nodes">
                    <NodeTableContainer tracing={this.state.selectedTracing}/>
                </Panel>
            </div>
        );
    }
}
