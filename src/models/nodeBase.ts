export interface INodeBase {
    id: string;
    sampleNumber: number;
    parentNumber: number;
    x: number;
    y: number;
    z: number;
    radius: number;
    createdAt: number;
    updatedAt: number;
}

export function formatNodeLocation(node: INodeBase) {
    if (node) {
        return `(${node.x.toFixed(6)}, ${node.y.toFixed(6)}, ${node.z.toFixed(6)})`;
    } else {
        return "n/a";
    }
}

