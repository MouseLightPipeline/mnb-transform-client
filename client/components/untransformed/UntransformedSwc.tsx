import * as React from "react";
import {Table, Button} from "react-bootstrap";
import {toast} from "react-toastify";

import {ISwcTracing} from "../../models/swcTracing";
import {ITracing} from "../../models/tracing";
import {APPLY_TRANSFORM_MUTATION, ApplyTransformMutation} from "../../graphql/swcTracings";
import {TextAlignProperty} from "csstype";

const cellStyles = {
    normal: {
        textAlign: "center" as TextAlignProperty,
        verticalAlign: "middle"
    },
    active: {
        fontWeight: 800,
        fontSize: "14px"
    }
};

const errorContent = (errors: any) => {
    return (<div><h3>Transform Failed</h3>{errors[0]}</div>);
};

function onApplyTransformComplete(errors: string[]) {
    if (errors.length > 0) {
        toast.error(errorContent(errors), {});
    }
}


function formatTracingStructure(tracing: ISwcTracing, cellStyle: any) {
    if (!tracing || !tracing.tracingStructure) {
        return (<td style={cellStyle}> {tracing.id.slice(0, 8)}</td>);
    }

    const structure = tracing.tracingStructure;

    return (
        <td style={cellStyle}>
            {tracing.id.slice(0, 8)}
            <br/>
            {structure.name}
        </td>);
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

interface IUntransformedRowProps {
    tracing: ISwcTracing;
    applyTransformMutation?(id: string): Promise<ITracing>;
}

class UntransformedRow extends React.Component<IUntransformedRowProps, {}> {
    private renderApplyCell() {
        return (
            <ApplyTransformMutation mutation={APPLY_TRANSFORM_MUTATION}
                                    onCompleted={(data) => onApplyTransformComplete(data.applyTransform.errors)}>
                {(applyTransform) => (
                    <Button bsSize="small" bsStyle="primary">Apply Transform&nbsp; onClick={() => {
                        applyTransform({variables: {swcId: this.props.tracing.id}});
                    }}
                    </Button>
                )}
            </ApplyTransformMutation>
        );
    }

    public render() {
        const cellStyle = cellStyles.normal;

        return (<tr>
                <td>{this.renderApplyCell()}</td>
                {formatTracingStructure(this.props.tracing, cellStyle)}
                <td style={cellStyle}>{formatSource(this.props.tracing)}</td>
                <td style={cellStyle}>{this.props.tracing.nodeCount}</td>
            </tr>
        );
    }
}

interface IUntransformedTableProps {
    loading: boolean;
    untransformedSwc: ISwcTracing[];
}

interface IUntransformedTableState {
    hasLoaded?: boolean;
    tracings?: ISwcTracing[];
}

export class UntransformedSwcTable extends React.Component<IUntransformedTableProps, IUntransformedTableState> {
    public constructor(props: IUntransformedTableProps) {
        super(props);

        this.state = {hasLoaded: false, tracings: []};
    }

    public componentWillReceiveProps(nextProps: IUntransformedTableProps) {
        if (!nextProps.loading) {
            // Cache current so that when going into anything but an instant query, existing rows in table don't drop during
            // this data.loading phase.  Causes flicker as table goes from populated to empty back to populated.
            this.setState({hasLoaded: true, tracings: nextProps.untransformedSwc});
        }

        return true;
    }

    public render() {
        if (!this.state.hasLoaded) {
            return (<h4>Loading...</h4>);
        }

        const rows = this.state.tracings.map(tracing => (
            <UntransformedRow key={`tr_${tracing.id}`} tracing={tracing}/>));

        return (
            <Table condensed>
                <thead>
                <tr>
                    <th className="small"/>
                    <th className="small">Id</th>
                    <th className="small">SWC</th>
                    <th className="small">Nodes</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}
