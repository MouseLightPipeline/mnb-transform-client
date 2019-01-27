export enum TracingStructure {
    any = -1,       // No selection
    axon = 1,       // Must match value used in API
    dendrite = 2,   // Must match value used in API
    soma = 3,       // UI-only what to display for a neuron
    all = 4         // Same as above
}

export const AnyTracingStructureId = "ANY";

export const AnyTracingStructure: ITracingStructure = {
    id: AnyTracingStructureId,
    name: "any",
    value: -1
};

export interface ITracingStructure {
    id: string;
    name: string;
    value: number;
}

export function displayTracingStructure(tracingStructure: ITracingStructure): string {
    return tracingStructure ? tracingStructure.name : "(none)";
}
