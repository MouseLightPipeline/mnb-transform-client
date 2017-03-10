import {IJaneliaTracing} from "./janeliaTracing";
import {IRegistrationTransform} from "./registrationTransform";
import {ITracingNode} from "./tracingNode";

export interface ITracing {
    id: string;
    nodeCount: number;
    firstNode: ITracingNode;
    janeliaTracing: IJaneliaTracing;
    registrationTransform: IRegistrationTransform;
    createdAt: number;
    updatedAt: number;
}
