import * as React from "react";
import {Table} from "semantic-ui-react";
import Timer = NodeJS.Timer;

import {ITracing} from "../../models/tracing";
import {TracingRow} from "./TracingRow";

interface ITracingsTableProps {
    selectedTracing: ITracing;
    tracings: ITracing[];

    onSelectTracing?(tracing: ITracing): void;
}

interface ITracingsTableState {
    tracings: ITracing[];
}

export class TracingsTable extends React.Component<ITracingsTableProps, ITracingsTableState> {
    private _timeout: Timer | number; // Typescript and browser can't agree.

    public constructor(props: ITracingsTableProps) {
        super(props);

        this.state = {tracings: props.tracings};
    }

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

    public componentWillReceiveProps(nextProps: ITracingsTableProps) {
        // Cache current so that when going into anything but an instant query, existing rows in table don't drop during
        // this data.loading phase.  Causes flicker as table goes from populated to empty back to populated.
        this.setState({tracings: nextProps.tracings});
    }

    public render() {
        const rows = this.state.tracings.map(tracing => (
            <TracingRow key={`tr_${tracing.id}`} tracing={tracing} onSelectTracing={this.props.onSelectTracing}
                        isSelected={this.props.selectedTracing && tracing.id === this.props.selectedTracing.id}/>));

        return (
            <Table attached="bottom" compact="very" structured selectable celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell/>
                        <Table.HeaderCell colSpan={2} textAlign="center">Source</Table.HeaderCell>
                        <Table.HeaderCell colSpan={2} textAlign="center">Transform</Table.HeaderCell>
                        <Table.HeaderCell colSpan={2} textAlign="center">First Node</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>SWC</Table.HeaderCell>
                        <Table.HeaderCell>Nodes</Table.HeaderCell>
                        <Table.HeaderCell>Source</Table.HeaderCell>
                        <Table.HeaderCell>Applied</Table.HeaderCell>
                        <Table.HeaderCell>SWC</Table.HeaderCell>
                        <Table.HeaderCell>Transformed</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
        );
    }
}
