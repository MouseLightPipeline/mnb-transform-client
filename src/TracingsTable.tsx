import * as React from "react";
import {Table} from "react-bootstrap";
import moment = require("moment");
import {graphql, InjectedGraphQLProps} from "react-apollo";
import gql from "graphql-tag";

import {ITracing} from "./models/tracing";
import Timer = NodeJS.Timer;
import {formatNodeLocation} from "./models/nodeBase";
import {IRegistrationTransform} from "./models/registrationTransform";
import {ISwcTracing} from "./models/swcTracing";
import SyntheticEvent = React.SyntheticEvent;

const dendriteImage = require("file-loader!../public/dendrite.png");
const axonImage = require("file-loader!../public/axon.png");

const rowStyles = {
    selected: {
        backgroundColor: "#eeeeee"
    },
    unselected: {
    }
};

const cellStyles = {
    normal: {
        textAlign: "center",
        verticalAlign: "middle"
    },
    active: {
        fontWeight: 800,
        fontSize: "14px"
    }
};

const imageStyle = {
    maxHeight: "60px"
};

interface ITracingRowProps {
    isSelected: boolean;
    tracing: ITracing;
    onSelectedTracing?(tracing: ITracing): void;
}

interface ITracingRowState {
}

function formatUpdatedAt(tracing: ITracing) {
    if (!tracing.transformStatus) {
        if (!tracing.transformedAt) {
            return "Never";
        }
        return moment(new Date(tracing.transformedAt)).fromNow().toLocaleString();
    }

    if (tracing.transformStatus.inputNodeCount < 1) {
        return "waiting to start";
    }

    const elapsed = moment(new Date(tracing.transformStatus.startedAt)).fromNow().toLocaleString();

    return (<span style={cellStyles.active}>{`Transform started ${elapsed}`}<br/>{`${(100 * tracing.transformStatus.outputNodeCount/tracing.transformStatus.inputNodeCount).toFixed(2)}%`}</span>);
}

function formatSource(swcTracing: ISwcTracing) {
    if (!swcTracing) {
        return "(not found)";
    }

    return (
        <span>
            {swcTracing.filename}
            <br/>
            by {swcTracing.annotator}
        </span>
    );
}

function formatRegistrationTransform(registrationTransform: IRegistrationTransform) {
    if (!registrationTransform) {
        return "(not found)";
    }

    return (
        <span>
                {registrationTransform.name}
            <br/>
            {registrationTransform.location}
            </span>
    );
}

function formatTracingStructure(tracing: ITracing, cellStyle: any) {
    if (!tracing.swcTracing || !tracing.swcTracing.tracingStructure) {
        return (<td style={cellStyle}> {tracing.id.slice(0, 8)}</td>);
    }

    const structure = tracing.swcTracing.tracingStructure;

    return (<td style={cellStyle}>{tracing.id.slice(0, 8)}<br/><img style={imageStyle} src={structure.value === 1 ? axonImage : dendriteImage}/><br/>{structure.name}</td>);
}

class TracingRow extends React.Component<ITracingRowProps, ITracingRowState> {

    private handleClick(evt: any) {
        this.props.onSelectedTracing(this.props.tracing);
    }

    public render() {
        const cellStyle = cellStyles.normal;

        return (<tr onClick={(evt)=>this.handleClick(evt)} style={this.props.isSelected ? rowStyles.selected : rowStyles.unselected}>
                {formatTracingStructure(this.props.tracing, cellStyle)}
                <td style={cellStyle}>{formatSource(this.props.tracing.swcTracing)}</td>
                <td style={cellStyle}>{this.props.tracing.nodeCount}</td>
                <td style={cellStyle}>{formatRegistrationTransform(this.props.tracing.registrationTransform)}</td>
                <td style={cellStyle}>{formatUpdatedAt(this.props.tracing)}</td>
                <td style={cellStyle}>{this.props.tracing.swcTracing ? formatNodeLocation(this.props.tracing.swcTracing.firstNode) : ""}</td>
                <td style={cellStyle}>{formatNodeLocation(this.props.tracing.firstNode)}</td>
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
    transformStatus {
      startedAt
      inputNodeCount
      outputNodeCount
    }
    transformedAt
    createdAt
    updatedAt
    swcTracing {
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
      },
      tracingStructure {
        id
        name
        value
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

interface ITracingsGraphQLProps {
    tracings: ITracing[];
}

interface ITracingsTableProps extends InjectedGraphQLProps<ITracingsGraphQLProps> {
    selectedTracing: ITracing;
    onSelectedTracing?(tracing: ITracing): void;
}

interface ITracingsTableState {
}

@graphql(tracingsQuery, {
    options: {
        pollInterval: 5 * 1000
    }
})
export class TracingsTable extends React.Component<ITracingsTableProps, ITracingsTableState> {
    private _timeout: Timer | number; // Typescript and browser can"t agree.

    private refreshTimestamps() {
        this.forceUpdate();
        this._timeout = setTimeout(() => this.refreshTimestamps(), 60000);
    }

    public componentDidMount() {
        this._timeout = setTimeout(() => this.refreshTimestamps(), 60000);
    }

    public componentWillUnmount() {
        clearTimeout(this._timeout as Timer);
    }

    public render() {
        const tracings: ITracing[] = (this.props.data && !this.props.data.loading) ? this.props.data.tracings : [];

        const rows = tracings.map(tracing => (<TracingRow key={`tr_${tracing.id}`} tracing={tracing} onSelectedTracing={this.props.onSelectedTracing} isSelected={this.props.selectedTracing && tracing.id === this.props.selectedTracing.id}/>));

        return (
            <Table condensed>
                <thead>
                <tr>
                    <th colSpan={1} style={{backgroundColor: "#F5F5F5", borderRight: "1px solid #ddd"}}/>
                    <th colSpan={2}>Source</th>
                    <th colSpan={2}>Transform</th>
                    <th colSpan={2}>First Node</th>
                </tr>
                <tr>
                    <th className="small">Id</th>
                    <th className="small">SWC</th>
                    <th className="small">Nodes</th>
                    <th className="small">Source</th>
                    <th className="small">Applied</th>
                    <th className="small">SWC</th>
                    <th className="small">Transformed</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}

