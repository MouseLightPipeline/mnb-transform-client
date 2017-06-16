import * as React from "react";
import {Grid, Row, Col, Panel} from "react-bootstrap";

import {TracingTableContainer} from "./TracingsTable";
import {ITracing} from "../../models/tracing";
import {NodeTableContainer} from "./NodeTable";
import {AnyTracingStructure, ITracingStructure} from "../../models/tracingStructure";

interface ITracingsProps {
}

interface ITracingsState {
    offset?: number;
    limit?: number;

    selectedTracing?: ITracing;
    tracingStructureFilter?: ITracingStructure;
}

export class Tracings extends React.Component<ITracingsProps, ITracingsState> {
    constructor(props: ITracingsProps) {
        super(props);
        this.state = {
            offset: 0,
            limit: 10,
            selectedTracing: null,
            tracingStructureFilter: AnyTracingStructure
        }
    }

    private onUpdateOffsetForPage(page: number) {
        this.setState({offset: this.state.limit * (page - 1), selectedTracing: null});
    }

    private onUpdateLimit(limit: number) {
        this.setState({limit: limit}, null);
    }


    private onSelectTracing(tracing: ITracing) {
        this.setState({selectedTracing: tracing}, null);
    }

    private onTracingStructureFilter(tracingStructureFilter: ITracingStructure) {
        this.setState({tracingStructureFilter, selectedTracing: null});
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
                                   tracingStructureFilter={this.state.tracingStructureFilter}
                                   onUpdateOffsetForPage={page => this.onUpdateOffsetForPage(page)}
                                   onUpdateLimit={limit => this.onUpdateLimit(limit)}
                                   onTracingStructureFilter={id => this.onTracingStructureFilter(id)}
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
