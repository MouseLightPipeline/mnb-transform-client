import {ApolloError} from "apollo-client";
import gql from "graphql-tag";
import {graphql, Query} from "react-apollo";

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

export const TRACING_NODES_QUERY = gql`query ($page: PageInput) {
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

export class TracingNodesQuery extends Query<TracingNodesQueryResponse, TracingNodesQueryVariables> {};