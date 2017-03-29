import * as React from "react";
import { Glyphicon} from "react-bootstrap";
import {graphql, InjectedGraphQLProps} from "react-apollo";
import gql from "graphql-tag";
import moment = require("moment");
import { toast } from 'react-toastify';

import {formatNodeLocation} from "./models/nodeBase";
import {IRegistrationTransform} from "./models/registrationTransform";
import {ISwcTracing} from "./models/swcTracing";
import {ITracing} from "./models/tracing";

const dendriteImage = require("file-loader!../public/dendrite.png");
const axonImage = require("file-loader!../public/axon.png");

const rowStyles = {
    selected: {
        backgroundColor: "#eeeeee"
    },
    unselected: {}
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

interface ITracingsRowGraphQLProps {
}

interface ITracingRowProps extends InjectedGraphQLProps<ITracingsRowGraphQLProps> {
    isSelected: boolean;
    tracing: ITracing;
    onSelectedTracing?(tracing: ITracing): void;
    reapplyTransformMutation?(id: string): Promise<ITracing>;
}

interface ITracingRowState {
}

function formatUpdatedAt(tracing: ITracing, reapplyFcn: any) {
    if (!tracing.transformStatus) {
        if (!tracing.transformedAt) {
            return "Never";
        }
        return (<div><span>{moment(new Date(tracing.transformedAt)).fromNow().toLocaleString()}</span><br/><br/><a
            onClick={(evt) => reapplyFcn(evt, tracing.id)}><Glyphicon glyph="refresh"/>&nbsp;reapply</a>
        </div>);
    }

    if (tracing.transformStatus.inputNodeCount < 1) {
        return "waiting to start";
    }

    const elapsed = moment(new Date(tracing.transformStatus.startedAt)).fromNow().toLocaleString();

    return (<span
        style={cellStyles.active}>{`Transform started ${elapsed}`}<br/>{`${(100 * tracing.transformStatus.outputNodeCount / tracing.transformStatus.inputNodeCount).toFixed(2)}%`}</span>);
}

function formatSource(swcTracing: ISwcTracing) {
    if (!swcTracing) {
        return "(not found)";
    }

    return (
        <span>
            {swcTracing.filename}
            <br/>
            <span style={{fontStyle: "italic"}}>annotated by</span> {swcTracing.annotator}
        </span>
    );
}

function formatRegistrationTransform(registrationTransform: IRegistrationTransform) {
    if (!registrationTransform) {
        return "(not found)";
    }

    return (<span>{registrationTransform.name}<br/>{registrationTransform.location}</span>);
}

function formatTracingStructure(tracing: ITracing, cellStyle: any) {
    if (!tracing.swcTracing || !tracing.swcTracing.tracingStructure) {
        return (<td style={cellStyle}> {tracing.id.slice(0, 8)}</td>);
    }

    const structure = tracing.swcTracing.tracingStructure;

    return (<td style={cellStyle}>{tracing.id.slice(0, 8)}<br/><img style={imageStyle}
                                                                    src={structure.value === 1 ? axonImage : dendriteImage}/><br/>{structure.name}
    </td>);
}

const errorContent = (errors: any) => {
    return (<div><h3>Transform Failed</h3>{errors[0]}</div>);
};

const reapplyTransformMutation = gql`
  mutation reapplyTransform($id: String!) {
    reapplyTransform(id: $id) {
        tracing {
            id
        }
        errors
    }
  }
`;

@graphql(reapplyTransformMutation, {
    props: ({mutate}) => ({
        reapplyTransformMutation: (id: string) => mutate({
            variables: {
                id: id
            }
        })
    })
})
export class TracingRow extends React.Component<ITracingRowProps, ITracingRowState> {

    private handleClick() {
        this.props.onSelectedTracing(this.props.tracing);
    }

    private onReapplyClick(evt: any, id: string) {
        evt.stopPropagation();
        this.props.reapplyTransformMutation(id).then((result: any) => {
            const transformResult = result.data.reapplyTransform;
            if (transformResult.errors.length > 0) {
                toast.error(errorContent(transformResult.errors), {});
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    public render() {
        const cellStyle = cellStyles.normal;

        return (<tr onClick={() => this.handleClick()}
                    style={this.props.isSelected ? rowStyles.selected : rowStyles.unselected}>
                {formatTracingStructure(this.props.tracing, cellStyle)}
                <td style={cellStyle}>{formatSource(this.props.tracing.swcTracing)}</td>
                <td style={cellStyle}>{this.props.tracing.nodeCount}</td>
                <td style={cellStyle}>{formatRegistrationTransform(this.props.tracing.registrationTransform)}</td>
                <td style={cellStyle}>{formatUpdatedAt(this.props.tracing, (evt: any, id: string) => this.onReapplyClick(evt, id))}</td>
                <td style={cellStyle}>{this.props.tracing.swcTracing ? formatNodeLocation(this.props.tracing.swcTracing.firstNode) : ""}</td>
                <td style={cellStyle}>{formatNodeLocation(this.props.tracing.firstNode)}</td>
            </tr>
        );
    }
}

