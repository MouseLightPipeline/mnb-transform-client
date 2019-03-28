import gql from "graphql-tag";
import {Query} from "react-apollo";

import {ITracingStructure} from "../models/tracingStructure";
import {IStructureIdentifier} from "../models/structureIdentifier";
import {IBrainArea} from "../models/brainArea";

export const CONSTANTS_QUERY = gql`query ConstantsQuery {
  tracingStructures {
    id
    name
    value
  }
  structureIdentifiers {
    id
    name
    value
  }
  brainAreas {
    id
    name
    acronym
    aliases
    structureId
    depth
    parentStructureId
    structureIdPath
    geometryColor
    geometryFile
    geometryEnable
  }
}`;

export type ConstantsQueryResponse = {
    tracingStructures: ITracingStructure[];
    structureIdentifiers: IStructureIdentifier[];
    brainAreas: IBrainArea[];
}

export class ConstantsQuery extends Query<ConstantsQueryResponse, {}> {
}
