import {IJaneliaNode} from "./janeliaNode";

export interface IJaneliaTracing {
    id: string;
    filename: string;
    fileComments: string;
    annotator: string;
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    firstNode: IJaneliaNode;
    createdAt: number;
    updatedAt: number;
}