import * as React from "react";
import {Panel, Table, Alert, ControlLabel, Grid, Row, Col} from "react-bootstrap";
import {Dropdown, DropdownItemProps} from "semantic-ui-react";
import Timer = NodeJS.Timer;

import {ITracing} from "../../models/tracing";
import {TracingRow} from "./TracingRow";
import {AnyTracingStructure, displayTracingStructure} from "../../models/tracingStructure";
import {PaginationHeader} from "../editors/PaginationHeader";
import {ITracingsQueryChildProps} from "../../graphql/tracings";

interface ITracingsTableProps {
    loading: boolean;
    selectedTracing: ITracing;
    tracings: ITracing[];
    onSelectedTracing?(tracing: ITracing): void;
}

interface ITracingsTableState {
    hasLoaded: boolean;
    tracings: ITracing[];
}

class InternalTracingsTable extends React.Component<ITracingsTableProps, ITracingsTableState> {
    private _timeout: Timer | number; // Typescript and browser can't agree.

    public constructor(props: ITracingsTableProps) {
        super(props);

        this.state = {hasLoaded: false, tracings: []};
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
        if (!nextProps.loading) {
            this.setState({hasLoaded: true, tracings: nextProps.tracings});
        }
    }

    public render() {
        if (this.props.loading && !this.state.hasLoaded) {
            return (<h4>Loading...</h4>);
        }

        const rows = this.state.tracings.map(tracing => (
            <TracingRow key={`tr_${tracing.id}`} tracing={tracing} onSelectedTracing={this.props.onSelectedTracing}
                        isSelected={this.props.selectedTracing && tracing.id === this.props.selectedTracing.id}/>));

        return (
            <Table condensed>
                <thead>
                <tr>
                    <th colSpan={1} style={{backgroundColor: "#F5F5F5", borderRight: "1px solid #ddd"}}/>
                    <th colSpan={2}>Source</th>
                    <th colSpan={2} style={{
                        backgroundColor: "#FCFCFC",
                        borderRight: "1px solid #ddd",
                        borderLeft: "1px solid #ddd"
                    }}>Transform
                    </th>
                    <th colSpan={2}>First Node</th>
                </tr>
                <tr>
                    <th>Id</th>
                    <th>SWC</th>
                    <th>Nodes</th>
                    <th>Source</th>
                    <th>Applied</th>
                    <th>SWC</th>
                    <th>Transformed</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}

export class TracingTableContainer extends React.Component<ITracingsQueryChildProps, {}> {
    constructor(props: ITracingsQueryChildProps) {
        super(props);

        this.state = {tracingStructureFilterId: ""};
    }

    private renderHeader(name: string) {
        return (
            <div>
                <div style={{display: "inline-block"}}>
                    <h4>{name}</h4>
                </div>
                <span className="pull-right" style={{fontWeight: "normal", fontSize: "12px"}}>
                    Select a tracing to view nodes below
                </span>
            </div>
        );
    }

    private renderPanelFooter(totalCount: number, activePage: number, pageCount: number) {
        const start = this.props.offset + 1;
        const end = Math.min(this.props.offset + this.props.limit, totalCount);
        return (
            <div>
                <span>
                    {totalCount >= 0 ? (totalCount > 0 ? `Showing ${start} to ${end} of ${totalCount} tracings` : "It's a clean slate - upload the first tracings!") : ""}
                </span>
                <span className="pull-right">
                    {`Page ${activePage} of ${pageCount}`}
                </span>
            </div>
        );
    }

    public render() {
        const {loading, error} = this.props;

        if (error) {
            return (
                <Panel header={this.renderHeader("Tracings")}>
                    <Alert bsStyle="danger">
                        <div>
                            <h5>Service Error</h5>
                            {this.props.error.message}
                        </div>
                    </Alert>
                </Panel>
            );
        }

        let tracingStructures = loading ? [] : this.props.tracingStructures;

        tracingStructures = tracingStructures.slice();

        tracingStructures.unshift(AnyTracingStructure);

        const tracingStructureOptions: DropdownItemProps[] = tracingStructures.map(t => {
            return {
                key: t.id,
                text: displayTracingStructure(t),
                value: t.id
            }
        });

        const tracings = loading ? [] : this.props.tracings.tracings;

        const totalCount = loading ? 0 : this.props.tracings.matchCount;

        const pageCount = loading ? 1 : Math.ceil(totalCount / this.props.tracings.limit);

        const activePage = loading ? 0 : (this.props.tracings.offset ? (Math.floor(this.props.tracings.offset / this.props.tracings.limit) + 1) : 1);

        return (
            <Panel header={this.renderHeader("Tracings")}
                   footer={this.renderPanelFooter(totalCount, activePage, pageCount)}>
                <PaginationHeader pageCount={pageCount}
                                  activePage={activePage}
                                  limit={this.props.limit}
                                  onUpdateLimitForPage={limit => this.props.onUpdateLimit(limit)}
                                  onUpdateOffsetForPage={page => this.props.onUpdateOffsetForPage(page)}/>

                <div style={{paddingBottom: "20px", borderBottom: "1px solid #ddd"}}>
                    <Grid fluid>
                        <Row style={{margin: "0px"}}>
                            <Col md={2}>
                                <ControlLabel>Tracing Structure:&nbsp;</ControlLabel>
                                <Dropdown placeholder={"Select the structure..."} fluid selection
                                          options={tracingStructureOptions}
                                          value={this.props.tracingStructureFilterId}
                                          onChange={(e, {value}) => this.props.onTracingStructureFilter(value as string)}/>
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <InternalTracingsTable loading={this.props.loading} tracings={tracings}
                                       onSelectedTracing={this.props.onSelectedTracing}
                                       selectedTracing={this.props.selectedTracing}/>
            </Panel>
        );
    }
}
