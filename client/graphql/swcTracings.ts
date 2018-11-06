import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";

import {ISwcTracing} from "../models/swcTracing";
import {TracingFieldsFragment} from "./tracings";

//
// Query Untransformed SWC
//

export const UNTRANSFORMED_SWC_QUERY = gql`query Untransformed {
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


type UntransformedSwcQueryResponse = {
    untransformedSwc: ISwcTracing[];
}

export class UntransformedSwcQuery extends Query<UntransformedSwcQueryResponse, {}> {
}

//
// Apply Transform Mutation
//

export const APPLY_TRANSFORM_MUTATION = gql`
  mutation applyTransform($swcId: String!) {
    applyTransform(swcId: $swcId) {
        tracing {
            ...TracingFields
        }
        errors
    }
  }
  ${TracingFieldsFragment}
`;

type ApplyTransformMutationVariables = {
    swcId: string;
}

type ApplyTransformMutationData = {
    tracing: ISwcTracing;
    errors: string[];
}

type ApplyTransformMutationResponse = {
    applyTransform: ApplyTransformMutationData;
}

export class ApplyTransformMutation extends Mutation<ApplyTransformMutationResponse, ApplyTransformMutationVariables> {
}

//
// Apply Transform Mutation
//

export const REAPPLY_TRANSFORM_MUTATION = gql`
  mutation reapplyTransform($id: String!) {
    reapplyTransform(id: $id) {
        tracing {
            ...TracingFields
        }
        errors
    }
  }
  ${TracingFieldsFragment}
`;

type ReapplyTransformMutationVariables = {
    id: string;
}

type ReapplyTransformMutationData = {
    tracing: ISwcTracing;
    errors: string[];
}

type ReapplyTransformMutationResponse = {
    reapplyTransform: ReapplyTransformMutationData;
}

export class ReapplyTransformMutation extends Mutation<ReapplyTransformMutationResponse, ReapplyTransformMutationVariables> {
}
