import * as React from "react";
import {Panel, Table} from "react-bootstrap";

import {ITracing} from "../../models/tracing";
import {ITracingNode, INodePage} from "../../models/tracingNode";
import {formatNodeLocation} from "../../models/nodeBase";
import {PaginationHeader} from "../editors/PaginationHeader";
import {TextAlignProperty} from "csstype";
import {ITracingNodesQueryChildProps, TracingNodesQuery} from "../../graphql/tracingNode";

const cellStyles = {
    normal: {
        textAlign: "left" as TextAlignProperty,
        verticalAlign: "middle"
    },
    active: {
        fontWeight: 800,
        fontSize: "14px"
    }
};

interface INodeRowProps {
    node: ITracingNode;
}

interface INodeRowState {
}

class NodeRow extends React.Component<INodeRowProps, INodeRowState> {
    public render() {
        return (<tr>
                <td style={cellStyles.normal}>{this.props.node.swcNode.structureIdentifier ? this.props.node.swcNode.structureIdentifier.name : ""}</td>
                <td style={cellStyles.normal}>{this.props.node.brainArea ? this.props.node.brainArea.name : "(none)"}</td>
                <td style={cellStyles.normal}>{formatNodeLocation(this.props.node)}</td>
                <td style={cellStyles.normal}>{this.props.node.sampleNumber} | {this.props.node.parentNumber}</td>
            </tr>
        );
    }
}


const NodeTable = (props: ITracingNodesQueryChildProps) => {
    const {loading, tracingNodePage} = props;

    const nodePage: INodePage = !loading ? tracingNodePage : null;

    const rows = nodePage ? nodePage.nodes.map(node => (<NodeRow key={`nr_${node.id}`} node={node}/>)) : [];

    const pageCount = nodePage ? Math.ceil(nodePage.totalCount / nodePage.limit) : 1;

    const activePage = nodePage ? (nodePage.offset ? (Math.floor(nodePage.offset / nodePage.limit) + 1) : 1) : 0;

    return (
        <div>
            <PaginationHeader pageCount={pageCount}
                              activePage={activePage}
                              limit={props.limit}
                              onUpdateLimitForPage={(limit: number) => props.onUpdateLimit(limit)}
                              onUpdateOffsetForPage={(page: number) => props.onUpdateOffsetForPage(page)}/>
            {nodePage != null ?
                <Table condensed striped>
                    <thead>
                    <tr>
                        <th>Structure</th>
                        <th>Area</th>
                        <th>Location</th>
                        <th>Node | Parent</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table> : null}
        </div>
    );
};

interface INodeTableContainerProps {
    tracing: ITracing;
}

interface INodeTableContainerState {
    offset?: number;
    limit?: number;
}

/*
 Need a layer to manage offset, limit, and tracing that can pass to component with GraphQL query as props.
 */
export class NodeTableContainer extends React.Component<INodeTableContainerProps, INodeTableContainerState> {
    private _pageMap = new Map<string, number>();

    constructor(props: INodeTableContainerProps) {
        super(props);

        this.state = {offset: 0, limit: 50};
    }

    private onUpdateOffsetForPage(page: number, forCurrent = true) {
        this.setState({offset: this.state.limit * (page - 1)}, null);

        if (this.props.tracing && forCurrent) {
            this._pageMap.set(this.props.tracing.id, page);
        }
    }

    private onUpdateLimit(limit: number) {
        this.setState({limit: limit}, null);
    }

    public componentWillReceiveProps(nextProps: INodeTableContainerProps) {
        if (nextProps.tracing !== this.props.tracing) {
            if (!nextProps.tracing || !this._pageMap.has(nextProps.tracing.id)) {
                this.onUpdateOffsetForPage(1, false);
            } else {
                this.onUpdateOffsetForPage(this._pageMap.get(nextProps.tracing.id), false);
            }
        }
    }

    private renderHeader(name: string) {
        return (
            <div>
                <div style={{display: "inline-block"}}>
                    <h4>{name}</h4>
                </div>
            </div>
        );
    }

    private getNodeTable() {
        return (
            <TableWithNodeTracings tracing={this.props.tracing} offset={this.state.offset} limit={this.state.limit}
                                   onUpdateOffsetForPage={page => this.onUpdateOffsetForPage(page)}
                                   onUpdateLimit={limit => this.onUpdateLimit(limit)}/>
        );
    }

    private getTableInstructions() {
        return (<div style={{padding: "10px"}}>Select a tracing above to display nodes</div>)
    }

    public render() {
        return (
            <Panel header={this.renderHeader("Transformed Nodes")}>
                {this.props.tracing ? this.getNodeTable() : this.getTableInstructions()}
            </Panel>
        );
    }
}


export const TableWithNodeTracings = TracingNodesQuery(NodeTable);