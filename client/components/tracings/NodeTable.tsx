import * as React from "react";

import {ITracing} from "../../models/tracing";
import {ITracingNode} from "../../models/tracingNode";
import {formatNodeLocation} from "../../models/nodeBase";
import {PaginationHeader} from "../editors/PaginationHeader";
import {TRACING_NODES_QUERY, TracingNodesQuery} from "../../graphql/tracingNode";
import {Header, Segment, Table} from "semantic-ui-react";

interface INodeRowProps {
    node: ITracingNode;
}

interface INodeRowState {
}

class NodeRow extends React.Component<INodeRowProps, INodeRowState> {
    public render() {
        return (<tr>
                <td>{this.props.node.swcNode.structureIdentifier ? this.props.node.swcNode.structureIdentifier.name : ""}</td>
                <td>{this.props.node.brainArea ? this.props.node.brainArea.name : "(none)"}</td>
                <td>{formatNodeLocation(this.props.node)}</td>
                <td>{this.props.node.sampleNumber} | {this.props.node.parentNumber}</td>
            </tr>
        );
    }
}

type TracingNodeTableProps = {
    nodes: ITracingNode[];
}

const NodeTable = (props: TracingNodeTableProps) => {

    const rows = props.nodes.map(node => (<NodeRow key={`nr_${node.id}`} node={node}/>));

    return (
        <Table attached="bottom" compact="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Structure</Table.HeaderCell>
                    <Table.HeaderCell>Area</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Node | Parent</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows}
            </Table.Body>
        </Table>
    );
};

interface INodeTableContainerProps {
    tracing: ITracing;
}

interface INodeTableContainerState {
    offset?: number;
    limit?: number;
}

export class NodeTableContainer extends React.Component<INodeTableContainerProps, INodeTableContainerState> {
    private _pageMap = new Map<string, number>();

    constructor(props: INodeTableContainerProps) {
        super(props);

        this.state = {offset: 0, limit: 10};
    }

    private onUpdateOffsetForPage = (page: number, forCurrent = true) => {
        this.setState({offset: this.state.limit * (page - 1)});

        if (this.props.tracing && forCurrent) {
            this._pageMap.set(this.props.tracing.id, page);
        }
    };

    private onUpdateLimit = (limit: number) => {
        this.setState({limit: limit});
    };

    public componentWillReceiveProps(nextProps: INodeTableContainerProps) {
        if (nextProps.tracing !== this.props.tracing) {
            if (!nextProps.tracing || !this._pageMap.has(nextProps.tracing.id)) {
                this.onUpdateOffsetForPage(1, false);
            } else {
                this.onUpdateOffsetForPage(this._pageMap.get(nextProps.tracing.id), false);
            }
        }
    }

    public render() {
        return (
            <TracingNodesQuery query={TRACING_NODES_QUERY} pollInterval={10000} skip={!this.props.tracing}
                               variables={{
                                   page: {
                                       offset: this.state.offset,
                                       limit: this.state.limit,
                                       tracingId: this.props.tracing.id
                                   }
                               }}>
                {({loading, error, data}) => {
                    if (error || !data || !data.tracingNodePage) {
                        return null;
                    }

                    const totalCount = data.tracingNodePage ? data.tracingNodePage.totalCount : 0;

                    const pageCount = Math.ceil(totalCount / this.state.limit);

                    const activePage = this.state.offset ? (Math.floor(this.state.offset / this.state.limit) + 1) : 1;

                    return (
                        <Segment.Group>
                            <Segment secondary>
                                <Header style={{margin: "0"}}>Transformed Nodes</Header>
                            </Segment>
                            {pageCount > 0 ? (<Segment>
                                <PaginationHeader pageCount={pageCount} activePage={activePage}
                                                  limit={this.state.limit}
                                                  onUpdateLimitForPage={this.onUpdateLimit}
                                                  onUpdateOffsetForPage={this.onUpdateOffsetForPage}/>
                            </Segment>) : null}
                            {pageCount > 0 ? (<NodeTable nodes={data.tracingNodePage.nodes}/>) : <Segment>
                                There are no transformed nodes for this tracing.
                            </Segment>}
                        </Segment.Group>
                    );
                }}
            </TracingNodesQuery>
        );
    }
}
