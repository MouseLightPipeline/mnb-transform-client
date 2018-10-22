import * as React from "react";
import {Panel, Table, Alert, ControlLabel, Grid, Row, Col} from "react-bootstrap";
import {Dropdown, DropdownItemProps} from "semantic-ui-react";
import {graphql, InjectedGraphQLProps} from "react-apollo";
import gql from "graphql-tag";

import {ITracing, ITracingPage} from "../../models/tracing";
import Timer = NodeJS.Timer;
import {TracingRow} from "./TracingRow";
import {GraphQLDataProps} from "react-apollo/lib/graphql";
import {
    AnyTracingStructure,
    AnyTracingStructureId,
    displayTracingStructure,
    ITracingStructure
} from "../../models/tracingStructure";
import {PaginationHeader} from "../editors/PaginationHeader";

const tracingsQuery = gql`query ($queryInput: TracingsQueryInput) {
  tracings(queryInput: $queryInput) {
    offset
    limit
    totalCount
    matchCount
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
        }
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
    }
  }
}`;

interface ITracingsTableProps {
    data: GraphQLDataProps & ITracingsGraphQLProps;
    selectedTracing: ITracing;
    tracingStructureFilterId: string;
    onSelectedTracing?(tracing: ITracing): void;
}

interface ITracingsTableState {
    hasLoaded: boolean;
    tracings: ITracing[];
}

class TracingsTable extends React.Component<ITracingsTableProps, ITracingsTableState> {
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
        if (this.props.data && !this.props.data.loading) {
            this.setState({hasLoaded: true, tracings: this.props.data.tracings.tracings}, null);
        }
    }

    public render() {
        let tracings: ITracing[] = [];

        if (!this.props.data || this.props.data.loading) {
            if (this.state.hasLoaded) {
                tracings = this.state.tracings;
            }
        } else if (this.props.data.error) {
            console.log(this.props.data.error);
        } else {
            tracings = this.props.data.tracings.tracings;
        }

        const rows = tracings.map(tracing => (
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

interface ITracingStructuresQueryProps {
    tracingStructures: ITracingStructure[];
}

interface ITracingsGraphQLProps {
    tracings: ITracingPage;
}

interface ITracingTableContainerProps extends InjectedGraphQLProps<ITracingsGraphQLProps> {
    selectedTracing: ITracing;
    offset: number;
    limit: number;
    tracingStructureFilterId?: string;
    tracingStructuresQuery?: ITracingStructuresQueryProps & GraphQLDataProps;

    onUpdateOffsetForPage(page: number): void;
    onUpdateLimit(limit: number): void;
    onSelectedTracing?(tracingId: ITracing): void;
    onTracingStructureFilter(structureId: string): void;
}

interface ITracingTableContainerState {
}

const TracingStructuresQuery = gql`query {
    tracingStructures {
        id
        name
        value
    }
}`;

@graphql(tracingsQuery, {
    options: ({offset, limit, tracingStructureFilterId}) => ({
        pollInterval: 5 * 1000,
        variables: {queryInput: {offset, limit, tracingStructureId: tracingStructureFilterId == AnyTracingStructureId ? "" : tracingStructureFilterId}}
    })
})
@graphql(TracingStructuresQuery, {
    name: "tracingStructuresQuery"
})
export class TracingTableContainer extends React.Component<ITracingTableContainerProps, ITracingTableContainerState> {
    constructor(props: ITracingTableContainerProps) {
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
        if (this.props.data && this.props.data.error) {
            return (
                <Panel header={this.renderHeader("Tracings")}>
                    <Alert bsStyle="danger">
                        <div>
                            <h5>Service Error</h5>
                            {this.props.data.error.message}
                        </div>
                    </Alert>
                </Panel>
            );
        }

        let tracingStructures = this.props.tracingStructuresQuery && !this.props.tracingStructuresQuery.loading ? this.props.tracingStructuresQuery.tracingStructures : [];

        tracingStructures = tracingStructures.slice();

        tracingStructures.unshift(AnyTracingStructure);


        const tracingStructureOptions: DropdownItemProps[] = tracingStructures.map(t => {
            return {
                key: t.id,
                text: displayTracingStructure(t),
                value: t.id
            }
        });

        console.log(tracingStructureOptions);
        console.log(this.props.tracingStructureFilterId);

        const tracingsPage = (this.props.data && !this.props.data.loading && !this.props.data.error) ? this.props.data.tracings : null;

        const totalCount = tracingsPage ? tracingsPage.matchCount : 0;

        const pageCount = tracingsPage ? Math.ceil(totalCount / tracingsPage.limit) : 1;

        const activePage = tracingsPage ? (tracingsPage.offset ? (Math.floor(tracingsPage.offset / tracingsPage.limit) + 1) : 1) : 0;

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
                                {/*
                                <TracingStructureSelect idName="createTracingStructureSelect"
                                                        clearable={false}
                                                        options={tracingStructures}
                                                        selectedOption={this.props.tracingStructureFilter}
                                                        onSelect={t => {
                                                            this.props.onTracingStructureFilter(t)
                                                        }}/>*/}
                                <Dropdown placeholder={"Select the structure..."} fluid selection options={tracingStructureOptions}
                                          value={this.props.tracingStructureFilterId}
                                          onChange={(e, {value}) => this.props.onTracingStructureFilter(value as string)}/>
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <TracingsTable data={this.props.data}
                               onSelectedTracing={this.props.onSelectedTracing}
                               selectedTracing={this.props.selectedTracing}
                               tracingStructureFilterId={this.props.tracingStructureFilterId}/>
            </Panel>
        );
    }
}
