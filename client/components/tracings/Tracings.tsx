import * as React from "react";
import {Grid, Row, Col} from "react-bootstrap";

import {TracingTableContainer} from "./TracingsTable";
import {ITracing} from "../../models/tracing";
import {NodeTableContainer} from "./NodeTable";
import {AnyTracingStructure} from "../../models/tracingStructure";

interface ITracingsProps {
}

interface ITracingsState {
    offset?: number;
    limit?: number;

    selectedTracing?: ITracing;
    tracingStructureFilterId?: string;
}

export class Tracings extends React.Component<ITracingsProps, ITracingsState> {
    constructor(props: ITracingsProps) {
        super(props);
        this.state = {
            offset: 0,
            limit: 10,
            selectedTracing: null,
            tracingStructureFilterId: AnyTracingStructure.id
        }
    }

    private onUpdateOffsetForPage(page: number) {
        this.setState({offset: this.state.limit * (page - 1), selectedTracing: null});
    }

    private onUpdateLimit(limit: number) {
        this.setState({limit: limit});
    }


    private onSelectTracing(tracing: ITracing) {
        this.setState({selectedTracing: tracing});
    }

    private onTracingStructureFilter(tracingStructureFilterId: string) {
        this.setState({tracingStructureFilterId, selectedTracing: null});
    }

    private renderSection(content: any) {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        {content}
                    </Col>
                </Row>
            </Grid>
        );
    }

    private renderTracings() {
        return this.renderSection(
            <TracingTableContainer offset={this.state.offset}
                                   limit={this.state.limit}
                                   selectedTracing={this.state.selectedTracing}
                                   tracingStructureFilterId={this.state.tracingStructureFilterId}
                                   onUpdateOffsetForPage={page => this.onUpdateOffsetForPage(page)}
                                   onUpdateLimit={limit => this.onUpdateLimit(limit)}
                                   onTracingStructureFilter={(id: string) => this.onTracingStructureFilter(id)}
                                   onSelectedTracing={(tracing => this.onSelectTracing(tracing))}/>
        );
    }

    private renderNodes() {
        if (this.state.selectedTracing) {
            return this.renderSection(
                <NodeTableContainer tracing={this.state.selectedTracing}/>
            );
        } else {
            return null;
        }
    }

    public render() {
        return (
            <div>
                {this.renderTracings()}
                {this.renderNodes()}
            </div>
        );
    }
}
