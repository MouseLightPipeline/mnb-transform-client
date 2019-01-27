import {ITracing} from "../models/tracing";
import {ITracingNode} from "../models/tracingNode";
import {ITracingStructure, TracingStructure} from "../models/tracingStructure";

import {NeuronViewModel} from "./neuronViewModel";

export class TracingViewModel {
    private id: string;
    private tracing: ITracing;
    private structure: ITracingStructure;
    private readonly _neuron: NeuronViewModel;
    private soma: ITracingNode;
    private nodeLookup: Map<number, ITracingNode>;

    public constructor(id: string, neuron: NeuronViewModel) {
        this._neuron = neuron;

        this.id = id;
        this.tracing = null;
        this.structure = null;
        this.soma = null;
        this.nodeLookup = null;
    }

    public get neuron() {
        return this._neuron;
    }

    public get NeuronId() {
        return this._neuron.Id;
    }

    public get IsSomaOnly(): boolean {
        return this._neuron.CurrentViewMode.structure === TracingStructure.soma;
    }

    public get IsHighlighted(): boolean {
        return this._neuron.isInHighlightList && (this._neuron.CurrentViewMode.structure === TracingStructure.all || this._neuron.CurrentViewMode.structure === this.structure.value);
    }
}
