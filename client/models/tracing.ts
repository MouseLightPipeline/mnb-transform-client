import {ISwcTracing} from "./swcTracing";
import {IRegistrationTransform} from "./registrationTransform";
import {ITracingNode} from "./tracingNode";

export interface ITransformProgress {
    startedAt: Date;
    inputNodeCount: number;
    outputNodeCount: number;
}

export interface ITracing {
    id: string;
    nodeCount: number;
    firstNode: ITracingNode;
    swcTracing: ISwcTracing;
    registrationTransform: IRegistrationTransform;
    transformStatus: ITransformProgress;
    transformedAt: number;
    createdAt: number;
    updatedAt: number;
}
