import {IBrainArea} from "./brainArea";

export interface INeuron {
    id: string;
    idNumber: number;
    idString: string;
    tag: string;
    keywords: string;
    x: number;
    y: number;
    z: number;
    brainArea: IBrainArea;
}
