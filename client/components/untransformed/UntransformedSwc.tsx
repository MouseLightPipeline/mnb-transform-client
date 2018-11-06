import * as React from "react";
import {Button, Icon, Message, Table} from "semantic-ui-react";
import {toast} from "react-toastify";

import {ISwcTracing} from "../../models/swcTracing";
import {ITracing} from "../../models/tracing";
import {APPLY_TRANSFORM_MUTATION, ApplyTransformMutation} from "../../graphql/swcTracings";

const errorContent = (errors: any) => {
    return (<div><h3>Transform Failed</h3>{errors[0]}</div>);
};

function onApplyTransformComplete(errors: string[]) {
    if (errors.length > 0) {
        toast.error(errorContent(errors), {});
    }
}

function formatTracingStructure(tracing: ISwcTracing) {
    if (!tracing || !tracing.tracingStructure) {
        return (<td> {tracing.id.slice(0, 8)}</td>);
    }

    const structure = tracing.tracingStructure;

    return (
        <td>
            {tracing.id}
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
                    <Button size="mini" color="teal" onClick={() => {
                        applyTransform({variables: {swcId: this.props.tracing.id}});
                    }}> Apply Transform
                    </Button>
                )}
            </ApplyTransformMutation>
        );
    }

    public render() {
        return (<Table.Row>
                <Table.Cell style={{maxWidth: "200px"}}>{this.renderApplyCell()}</Table.Cell>
                {formatTracingStructure(this.props.tracing)}
                <Table.Cell>{formatSource(this.props.tracing)}</Table.Cell>
                <Table.Cell>{this.props.tracing.nodeCount}</Table.Cell>
            </Table.Row>
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
            return (
                <Message icon>
                    <Icon name="circle notched" loading/>
                    <Message.Content>
                        <Message.Header content="Requesting content"/>
                        We are retrieving untransformed system data.
                    </Message.Content>
                </Message>
            );
        }

        const rows = this.state.tracings.map(tracing => (
            <UntransformedRow key={`tr_${tracing.id}`} tracing={tracing}/>));

        return (
            <Table attached="bottom" compact="very">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{maxWidth: "200px"}}/>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>SWC</Table.HeaderCell>
                        <Table.HeaderCell>Nodes</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
        );
    }
}
