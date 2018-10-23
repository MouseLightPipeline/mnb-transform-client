import * as React from "react";
import {Glyphicon} from "react-bootstrap";
import moment = require("moment");
import {toast} from 'react-toastify';

import {formatNodeLocation} from "../../models/nodeBase";
import {IRegistrationTransform} from "../../models/registrationTransform";
import {ISwcTracing} from "../../models/swcTracing";
import {ITracing} from "../../models/tracing";
import {TextAlignProperty} from "csstype";
import {REAPPLY_TRANSFORM_MUTATION, ReapplyTransformMutation} from "../../graphql/swcTracings";

const dendriteImage = require("file-loader!../../../assets/dendrite.png");
const axonImage = require("file-loader!../../../assets/axon.png");

const rowStyles = {
    selected: {
        backgroundColor: "#eeeeee"
    },
    unselected: {}
};

const cellStyles = {
    normal: {
        textAlign: "left" as TextAlignProperty,
        verticalAlign: "middle"
    },
    active: {
        "font-weight": 800,
        fontSize: "14px"
    }
};

const imageStyle = {
    maxHeight: "60px"
};

function onReapplyTransformComplete(errors: string[]) {
    if (errors.length > 0) {
        toast.error(errorContent(errors), {});
    }
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

interface IUpdatedAtProps {
    tracing: ITracing;
}

const UpdatedAt = (props: IUpdatedAtProps) => {
    const {tracing} = props;

    if (!tracing.transformStatus) {
        return (
            <div>
                <span>
                    {props.tracing.transformedAt ? moment(new Date(props.tracing.transformedAt)).fromNow().toLocaleString() : "Never"}
                </span>
                <br/>
                <br/>
                <ReapplyTransformMutation mutation={REAPPLY_TRANSFORM_MUTATION}
                                          onCompleted={(data) => onReapplyTransformComplete(data.reapplyTransform.errors)}>
                    {(reapplyTransform) => {
                        return (
                            <a onClick={() => reapplyTransform({variables: {id: props.tracing.id}})}>
                                <Glyphicon glyph="refresh"/>&nbsp;reapply
                            </a>
                        );
                    }}
                </ReapplyTransformMutation>
            </div>
        );
    }

    if (tracing.transformStatus.inputNodeCount < 1) {
        return (<span>"waiting to start"</span>);
    }

    const elapsed = moment(new Date(tracing.transformStatus.startedAt)).fromNow().toLocaleString();

    return (
        <span style={cellStyles.active}>
            {`Transform started ${elapsed}`}<br/>{`${(100 * tracing.transformStatus.outputNodeCount / tracing.transformStatus.inputNodeCount).toFixed(2)}%`}
            </span>
    );
};

interface ITracingRowProps {
    isSelected: boolean;
    tracing: ITracing;
    onSelectedTracing?(tracing: ITracing): void;
    reapplyTransformMutation?(id: string): Promise<ITracing>;
}

export class TracingRow extends React.Component<ITracingRowProps, {}> {
    public render() {
        const cellStyle = cellStyles.normal;

        return (
            <tr onClick={() => this.props.onSelectedTracing(this.props.tracing)}
                style={this.props.isSelected ? rowStyles.selected : rowStyles.unselected}>
                {formatTracingStructure(this.props.tracing, cellStyle)}
                <td style={cellStyle}>{formatSource(this.props.tracing.swcTracing)}</td>
                <td style={cellStyle}>{this.props.tracing.nodeCount}</td>
                <td style={cellStyle}>{formatRegistrationTransform(this.props.tracing.registrationTransform)}</td>
                <td style={cellStyle}><UpdatedAt tracing={this.props.tracing}/></td>
                <td style={cellStyle}>{this.props.tracing.swcTracing ? formatNodeLocation(this.props.tracing.swcTracing.firstNode) : ""}</td>
                <td style={cellStyle}>{formatNodeLocation(this.props.tracing.firstNode)}</td>
            </tr>
        );
    }
}

