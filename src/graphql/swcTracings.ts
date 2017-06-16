import gql from "graphql-tag";

export const UntransformedQuery = gql`query Untransformed {
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
