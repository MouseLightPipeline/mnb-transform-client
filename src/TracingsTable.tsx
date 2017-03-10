import * as React from "react";
import {Table} from "react-bootstrap";
import moment = require("moment");
import {graphql, InjectedGraphQLProps} from 'react-apollo';
import gql from 'graphql-tag';


import {ITracing} from "./models/tracing";
import Timer = NodeJS.Timer;
import {INodeBase} from "./models/nodeBase";

interface ITracingRowProps {
    tracing: ITracing;
}

interface ITracingRowState {
}

class TracingRow extends React.Component<ITracingRowProps, ITracingRowState> {
    private formatCoordinates(node: INodeBase) {
        if (node) {
            return `(${node.x.toFixed(4)}, ${node.y.toFixed(4)}, ${node.z.toFixed(4)})`;
        } else {
            return "n/a";
        }
    }

    public render() {
        const updatedAt = moment(new Date(this.props.tracing.updatedAt)).fromNow();

        return (<tr>
                <td>{this.props.tracing.id.slice(0, 8)}</td>
                <td>{this.props.tracing.janeliaTracing.filename}</td>
                <td>{this.props.tracing.nodeCount}</td>
                <td>{this.props.tracing.registrationTransform.name}</td>
                <td>{this.formatCoordinates(this.props.tracing.firstNode)}</td>
                <td>{this.formatCoordinates(this.props.tracing.janeliaTracing.firstNode)}</td>
                <td>{updatedAt.toLocaleString()}</td>
            </tr>
        );
    }
}

const tracingsQuery = gql`{
  tracings {
    id
    nodeCount
    firstNode {
      sampleNumber
      parentNumber
      id
      x
      y
      z
    }
    createdAt
    updatedAt
    janeliaTracing {
      id
      annotator
      filename
      fileComments
      offsetX
      offsetY
      offsetZ
      firstNode {
        sampleNumber
        parentNumber
        id
        x
        y
        z
      }
    }
    registrationTransform {
      id
      name
      notes
      location
    }
    nodes {
      id
    }
  }
}`;

/*
const tracingsUpdatedAtQuery = gql`{
  tracings {
    id
    nodeCount
    updatedAt
  }
}`;
*/

interface ITracingsGraphQLProps {
    tracings: ITracing[];
}

interface ITracingsTableProps extends InjectedGraphQLProps<ITracingsGraphQLProps> {
}

interface ITracingsTableState {
}

@graphql(tracingsQuery)
export class TracingsTable extends React.Component<ITracingsTableProps, ITracingsTableState> {
    private _timeout: Timer | number; // Typescript and browser can't agree.

    private refreshTimestamps() {
        //if (this.props.data && !this.props.data.loading) {
       //     this.props.data.refetch()
       // }
        this._timeout = setTimeout(() => this.refreshTimestamps(), 1000);
    }

    public componentDidMount() {
        //this._timeout = setTimeout(() => this.refreshTimestamps(), 1000);
    }

    public componentWillUnmount() {
        clearTimeout(this._timeout as Timer);
    }

    public render() {
        const tracings: ITracing[] = (this.props.data && !this.props.data.loading) ? this.props.data.tracings : [];

        const rows = tracings.map(tracing => (<TracingRow key={`tr_${tracing.id}`} tracing={tracing}/>));

        return (
            <Table condensed>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Source</th>
                    <th>Nodes</th>
                    <th>Transform</th>
                    <th>Node 1 Janelia</th>
                    <th>Node 1 Transformed</th>
                    <th>Registration Applied</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}

