import * as React from "react";
import {Dropdown, DropdownItemProps, Form, Header, Segment} from "semantic-ui-react";

import {PaginationHeader} from "../editors/PaginationHeader";
import {ITracing} from "../../models/tracing";
import {NodeTableContainer} from "./NodeTable";
import {AnyTracingStructure, AnyTracingStructureId, displayTracingStructure} from "../../models/tracingStructure";
import {TRACINGS_QUERY, TracingsQuery} from "../../graphql/tracings";
import {TracingsTable} from "./TracingsTable";
import {UserPreferences} from "../../util/userPreferences";

interface ITracingsState {
    offset?: number;
    limit?: number;

    selectedTracing?: ITracing;
    tracingStructureFilterId?: string;
}

export class Tracings extends React.Component<{}, ITracingsState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            offset: 0,
            limit: 10,
            selectedTracing: null,
            tracingStructureFilterId: UserPreferences.Instance.preferredStructureId
        }
    }

    private onUpdateOffsetForPage = (page: number) => {
        this.setState({offset: this.state.limit * (page - 1), selectedTracing: null});
    };

    private onUpdateLimit = (limit: number) => {
        this.setState({limit: limit});
    };

    private onSelectTracing = (tracing: ITracing) => {
        this.setState({selectedTracing: tracing});
    };

    private onTracingStructureFilter(tracingStructureFilterId: string) {
        if (tracingStructureFilterId !== this.state.tracingStructureFilterId) {
            UserPreferences.Instance.preferredStructureId = tracingStructureFilterId;
            this.setState({tracingStructureFilterId, selectedTracing: null});
        }
    }

    private renderTracings() {
        return (
            <TracingsQuery query={TRACINGS_QUERY} pollInterval={5000}
                           variables={{
                               queryInput: {
                                   offset: this.state.offset,
                                   limit: this.state.limit,
                                   tracingStructureId: this.state.tracingStructureFilterId === AnyTracingStructureId ? "" : this.state.tracingStructureFilterId
                               }
                           }}>
                {({loading, error, data}) => {
                    if (error || !data || !data.tracings) {
                        return null;
                    }

                    const tracingStructures = data.tracingStructures.slice();

                    tracingStructures.unshift(AnyTracingStructure);

                    const tracingStructureOptions: DropdownItemProps[] = tracingStructures.map(t => {
                        return {
                            key: t.id,
                            text: displayTracingStructure(t),
                            value: t.id
                        }
                    });

                    const totalCount = data.tracings ? data.tracings.totalCount : 0;

                    const pageCount = Math.ceil(totalCount / this.state.limit);

                    const activePage = this.state.offset ? (Math.floor(this.state.offset / this.state.limit) + 1) : 1;

                    return (
                        <Segment.Group>
                            <Segment secondary>
                                <Header style={{margin: "0"}}>Transformed Nodes</Header>
                            </Segment>
                            {pageCount > 0 ? (<Segment>
                                <PaginationHeader pageCount={pageCount} activePage={activePage}
                                                  limit={this.state.limit}
                                                  onUpdateLimitForPage={this.onUpdateLimit}
                                                  onUpdateOffsetForPage={this.onUpdateOffsetForPage}/>
                            </Segment>) : null}

                            <Segment secondary>
                                <Form size="small">
                                    <Form.Field inline>
                                        <label>Tracing Structure</label>
                                        <Form.Dropdown placeholder={"Select the structure..."} fluid selection
                                                       options={tracingStructureOptions} style={{maxWidth: "300px"}}
                                                       value={this.state.tracingStructureFilterId} inline
                                                       onChange={(e, {value}) => this.onTracingStructureFilter(value as string)}/>
                                    </Form.Field>
                                </Form>
                            </Segment>
                            <TracingsTable tracings={data.tracings.tracings}
                                           selectedTracing={this.state.selectedTracing}
                                           onSelectTracing={this.onSelectTracing}/>
                        </Segment.Group>
                    );
                }}
            </TracingsQuery>
        );
    }

    private renderNodes() {
        if (this.state.selectedTracing) {
            return (
                <NodeTableContainer tracing={this.state.selectedTracing}/>
            );
        } else {
            return null;
        }
    }

    public render() {
        return (
            <div>
                {this.renderTracings()}
                {this.renderNodes()}
            </div>
        );
    }
}
