import {INodeBase} from "./nodeBase";
import {IBrainArea} from "./brainArea";
import {ISwcNode} from "./swcNode";

export interface ITracingNode extends INodeBase {
    swcNode: ISwcNode;
    brainArea: IBrainArea;
}

export interface INodePage {
    offset: number;
    limit: number;
    totalCount: number;
    hasNextPage: boolean;
    nodes: ITracingNode[];
}