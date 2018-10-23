import {ApolloError} from "apollo-client";
import gql from "graphql-tag";
import {graphql} from "react-apollo";

import {ITracing} from "../models/tracing";
import {ITracingNode} from "../models/tracingNode";

export const TracingNodeFieldsFragment = gql`fragment TracingNodeFields on Node {
      id
      sampleNumber
      parentNumber
      x
      y
      z
      brainArea {
        id
        name
      }
      swcNode {
        structureIdentifier {
        id
        name
        }
      }
}`;

const TRACING_NODES_QUERY = gql`query ($page: PageInput) {
    tracingNodePage(page: $page) {
        offset
        limit
        totalCount
        hasNextPage
        nodes {
          ...TracingNodeFields
       }
    }
}
${TracingNodeFieldsFragment}`;

type TracingNodesQueryInputProps = {
    offset: number;
    limit: number;

    tracing: ITracing;
    onUpdateOffsetForPage(page: number): void;
    onUpdateLimit(limit: number): void;
}

type TracingNodesQueryPageInput = {
    offset: number;
    limit: number;
    tracingId: string;
}

type TracingNodesQueryVariables = {
    page: TracingNodesQueryPageInput;
}

type TracingNodesData = {
    offset: number;
    limit: number;
    totalCount: number;
    hasNextPage: boolean;
    nodes: ITracingNode[];
}

type TracingNodesQueryResponse = {
    tracingNodePage: TracingNodesData;
}

export interface ITracingNodesQueryChildProps {
    loading: boolean,
    error?: ApolloError,
    tracingNodePage?: TracingNodesData,

    offset: number;
    limit: number;

    onUpdateOffsetForPage(page: number): void;
    onUpdateLimit(limit: number): void;
}

export const TracingNodesQuery = graphql<TracingNodesQueryInputProps, TracingNodesQueryResponse, TracingNodesQueryVariables, ITracingNodesQueryChildProps>(TRACING_NODES_QUERY, {
    options: ({offset, limit, tracing}) => ({
        pollInterval: 5000,
        variables: {
            page: {
                offset,
                limit,
                tracingId: tracing ? tracing.id : "",
            }
        }
    }),
    props: ({data, ownProps}) => ({
        ...data,
        ...ownProps
    })
});