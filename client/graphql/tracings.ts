import {ApolloError} from "apollo-client";
import gql from "graphql-tag";
import {graphql, Query} from "react-apollo";

import {ITracing} from "../models/tracing";
import {AnyTracingStructureId, ITracingStructure} from "../models/tracingStructure";

export const TracingFieldsFragment = gql`fragment TracingFields on Tracing {
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
}`;

export const TRACINGS_QUERY = gql`query ($queryInput: TracingsQueryInput) {
  tracings(queryInput: $queryInput) {
    offset
    limit
    totalCount
    matchCount
    tracings {
        ...TracingFields
    }
  }
  tracingStructures {
    id
    name
    value
  }
}
${TracingFieldsFragment}`;

/*
type TracingsQueryInputProps = {
    offset: number;
    limit: number;

    selectedTracing: ITracing;
    tracingStructureFilterId: string;

    onUpdateOffsetForPage(page: number): void;
    onUpdateLimit(limit: number): void;
    onSelectedTracing?(tracingId: ITracing): void;
    onTracingStructureFilter(structureId: string): void;
}
*/

type TracingsQueryPageInput = {
    offset: number;
    limit: number;
    tracingStructureId: string;
}

type TracingsQueryVariables = {
    queryInput: TracingsQueryPageInput;
}

type TracingsData = {
    offset: number;
    limit: number;
    totalCount: number;
    matchCount: number;
    tracings: ITracing[];
}

type TracingsQueryResponse = {
    tracings: TracingsData;
    tracingStructures: ITracingStructure[];
}

/*
export interface ITracingsQueryChildProps {
    loading: boolean,
    error?: ApolloError,
    tracings?: TracingsData,
    tracingStructures?: ITracingStructure[];

    offset: number;
    limit: number;

    selectedTracing: ITracing;
    tracingStructureFilterId: string;

    onUpdateOffsetForPage(page: number): void;
    onUpdateLimit(limit: number): void;
    onSelectedTracing?(tracingId: ITracing): void;
    onTracingStructureFilter(structureId: string): void;
}
*/

export class TracingsQuery extends Query<TracingsQueryResponse, TracingsQueryVariables> {
}
