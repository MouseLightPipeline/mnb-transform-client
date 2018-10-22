import {ISwcNode} from "./swcNode";
import {ITracingStructure} from "./tracingStructure";

export interface ISwcTracing {
    id: string;
    filename: string;
    fileComments: string;
    annotator: string;
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    tracingStructure: ITracingStructure;
    nodeCount: number;
    firstNode: ISwcNode;
    createdAt: number;
    updatedAt: number;
}