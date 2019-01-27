import gql from "graphql-tag";
import {Query} from "react-apollo";

import {ITracing} from "../models/tracing";
import {ITracingStructure} from "../models/tracingStructure";

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
      neuron {
        id
        idString
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

export class TracingsQuery extends Query<TracingsQueryResponse, TracingsQueryVariables> {
}
