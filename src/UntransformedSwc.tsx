import * as React from "react";
import {Panel, Table, Button} from "react-bootstrap";
import {graphql, InjectedGraphQLProps} from "react-apollo";
import gql from "graphql-tag";
import {toast} from "react-toastify";
import {cloneDeep} from "lodash"

import {ISwcTracing} from "./models/swcTracing";
import {ITracing} from "./models/tracing";

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

const errorContent = (errors: any) => {
    return (<div><h3>Transform Failed</h3>{errors[0]}</div>);
};

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

interface IUntransformedRowGraphQLProps {
}

interface IUntransformedRowProps extends InjectedGraphQLProps<IUntransformedRowGraphQLProps> {
    tracing: ISwcTracing;
    applyTransformMutation?(id: string): Promise<ITracing>;
}

interface IUntransformedRowState {
}

const applyTransformMutation = gql`
  mutation applyTransform($swcId: String!) {
    applyTransform(swcId: $swcId) {
        tracing {
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
        }
        errors
    }
  }
`;

@graphql(applyTransformMutation, {
    props: ({mutate}) => ({
        applyTransformMutation: (id: string) => mutate({
            variables: {
                swcId: id
            }
        })
    })
})
class UntransformedRow extends React.Component<IUntransformedRowProps, IUntransformedRowState> {

    private onApplyClick(id: string) {
        this.props.applyTransformMutation(id).then((result: any) => {
            const transformResult = result.data.applyTransform;
            if (transformResult.errors.length > 0) {
                toast.error(errorContent(transformResult.errors), {});
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    private renderApplyCell() {
        return (
            <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.onApplyClick(this.props.tracing.id)}>
                Apply Transform&nbsp;
            </Button>
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

const untransformedQuery = gql`{
    untransformedSwc {
      id
      annotator
      filename
      fileComments
      offsetX
      offsetY
      offsetZ
      nodeCount
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
}`;


const untransformedSubscription = gql`subscription onUntransformedSwc {
    transformApplied {
      id
    }
}`;

interface IUntransformedGraphQLProps {
    untransformedSwc: ISwcTracing[];
}

interface IUntransformedTableProps extends InjectedGraphQLProps<IUntransformedGraphQLProps> {
}

interface IUntransformedTableState {
    hasLoaded: boolean;
    tracings: ISwcTracing[];
}

@graphql(untransformedQuery, {
    options: {
        pollInterval: 1 * 60 * 1000,
    }
})
class UntransformedSwcTable extends React.Component<IUntransformedTableProps, IUntransformedTableState> {
    private _subscription: any = null;

    public constructor(props: IUntransformedTableProps) {
        super(props);

        this.state = {hasLoaded: false, tracings: []};
    }

    public componentWillReceiveProps(nextProps: IUntransformedTableProps) {

        if (this.props.data && !this.props.data.loading) {
            // Cache current so that when going into anything but an instant query, existing rows in table don't drop during
            // this data.loading phase.  Causes flicker as table goes from populated to empty back to populated.
            this.setState({hasLoaded: true, tracings: this.props.data.untransformedSwc}, null);
        }

        if (nextProps.data && !nextProps.data.loading) {
            if (!this._subscription) {
                this._subscription = nextProps.data.subscribeToMore({
                    document: untransformedSubscription,
                    updateQuery: (previous, {subscriptionData}) => {
                        const modifiedResult: any = cloneDeep(previous);
                        modifiedResult.untransformedSwc = modifiedResult.untransformedSwc.filter((u: ISwcTracing) => u.id !== subscriptionData.data.transformApplied.id);
                        return modifiedResult;
                    },
                    onError: (err: any) => console.log(err)
                });
            }
        }

        return true;
    }

    public render() {
        let tracings: ISwcTracing[] = [];

        if (!this.props.data || this.props.data.loading) {
            if (this.state.hasLoaded) {
                tracings = this.state.tracings;
            }
        } else {
            tracings = this.props.data.untransformedSwc;
        }

        const rows = tracings.map(tracing => (<UntransformedRow key={`tr_${tracing.id}`} tracing={tracing}/>));

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

interface IUntransformedSwcProps {
}

interface IUntransformedSwcState {
}

export class UntransformedSwc extends React.Component<IUntransformedSwcProps, IUntransformedSwcState> {
    constructor(props: IUntransformedSwcProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Panel header="Untransformed SWC Files">
                    <UntransformedSwcTable/>
                </Panel>
            </div>
        );
    }
}
