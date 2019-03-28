export interface IBrainArea {
    id: string;
    name: string;
    depth: number;
    acronym: string;
    aliases: string[];
    structureId: number;
    structureIdPath: string;
    parentStructureId: number;
    geometryFile: string;
    geometryColor: string;
    geometryEnable: boolean;
}
