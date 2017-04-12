import * as React from "react";
import {Table, Form, FormGroup, ControlLabel, DropdownButton, InputGroup, MenuItem} from "react-bootstrap";
import {graphql, InjectedGraphQLProps} from "react-apollo";
import gql from "graphql-tag";

import {ITracing, ITracingPage} from "./models/tracing";
import Timer = NodeJS.Timer;
import {TracingRow} from "./TracingRow";
import {ITracingStructure} from "./models/tracingStructure";

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

interface ITracingsGraphQLProps {
    tracings: ITracingPage;
}

interface ITracingsTableProps extends InjectedGraphQLProps<ITracingsGraphQLProps> {
    selectedTracing: ITracing;
    tracingStructureFilterId: string;
    onSelectedTracing?(tracing: ITracing): void;
}

interface ITracingsTableState {
    hasLoaded: boolean;
    tracings: ITracing[];
}

@graphql(tracingsQuery, {
    options: ({tracingStructureFilterId}) => ({
        pollInterval: 5 * 1000,
        variables: {queryInput: {tracingStructureId: tracingStructureFilterId}}
    })
})
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

const tracingStructuresQuery = gql`{
    tracingStructures {
        id
        name
        value
    }
}`;

const TRACING_STRUCTURE_ANY: ITracingStructure = {
    id: "",
    name: "any",
    value: -1
};

interface IFilterTracingsBarGraphQLProps {
    tracingStructures: ITracingStructure[];
}

interface IFilterTracingsBarProps extends InjectedGraphQLProps<IFilterTracingsBarGraphQLProps> {
    onTracingStructureFilter?(tracingStructureId: string): void;
}

interface IFilterTracingsBarState {
    structureMenuTitle?: string;
}

@graphql(tracingStructuresQuery, {})
export class FilterTracingsBar extends React.Component<IFilterTracingsBarProps, IFilterTracingsBarState> {
    public constructor(props: IFilterTracingsBarProps) {
        super(props);

        this.state = {structureMenuTitle: TRACING_STRUCTURE_ANY.name};
    }

    private onStructureFilterSelect(evt: any) {
        this.setState({structureMenuTitle: evt.name}, null);
        this.props.onTracingStructureFilter(evt.id);
    }

    private renderToolbar(menuItems: JSX.Element[]) {
        return (
            <div style={{padding: "10px", borderBottom: "1px solid #ddd"}}>
                <Form inline>
                    <FormGroup controlId="formInlineName">
                        <ControlLabel>Filter Tracing Structure:&nbsp;</ControlLabel>
                        <InputGroup style={{minWidth: "100px"}}>
                            <DropdownButton bsSize="small" componentClass={InputGroup.Button} id="input-dropdown-addon"
                                            title={this.state.structureMenuTitle}
                                            onSelect={(evt: any) => this.onStructureFilterSelect(evt)}>
                                {menuItems}
                            </DropdownButton>
                        </InputGroup>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    public render() {
        let structures = [TRACING_STRUCTURE_ANY];

        if (this.props.data.tracingStructures) {
            structures = [...structures, ...this.props.data.tracingStructures];
        }

        const menuItems = structures.map(s => (<MenuItem
            key={s.id + "_tracing_structure_key"} eventKey={s}>{s.name}</MenuItem>));

        return this.renderToolbar(menuItems);
    }
}

interface ITracingTableContainerProps {
    selectedTracing: ITracing;
    onSelectedTracing?(tracing: ITracing): void;
}

interface ITracingTableContainerState {
    tracingStructureFilterId: string;
}

/*
 Need a layer to manage offset, limit, and tracing that can pass to component with GraphQL query as props.
 */
export class TracingTableContainer extends React.Component<ITracingTableContainerProps, ITracingTableContainerState> {
    constructor(props: ITracingTableContainerProps) {
        super(props);

        this.state = {tracingStructureFilterId: ""};
    }

    private onTracingStructureFilter(tracingStructureFilterId: string) {
        this.setState({tracingStructureFilterId: tracingStructureFilterId}, null);
        this.props.onSelectedTracing(null);
    }

    public render() {
        return (
            <div>
                <FilterTracingsBar onTracingStructureFilter={(id: string) => this.onTracingStructureFilter(id)}/>
                <TracingsTable onSelectedTracing={this.props.onSelectedTracing}
                               selectedTracing={this.props.selectedTracing}
                               tracingStructureFilterId={this.state.tracingStructureFilterId}/>
            </div>
        );
    }
}
