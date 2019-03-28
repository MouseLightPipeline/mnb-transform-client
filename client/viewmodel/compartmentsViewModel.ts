import {CompartmentViewModel} from "./compartmentViewModel";
import {IBrainArea} from "../models/brainArea";
import {ConstantsQueryResponse} from "../graphql/constants";

const ROOT_ID = 997;

export class CompartmentsViewModel {
    private _rootCompartment: CompartmentViewModel = null;
    private _visibleCompartments: Map<string, CompartmentViewModel> = new Map<string, CompartmentViewModel>();

    private _compartmentViewModelMap: Map<string, CompartmentViewModel> = new Map<string, CompartmentViewModel>();

    public constructor(data: ConstantsQueryResponse) {
        // TODO Populate viewmodel map, create viewmodel hierarchy, and set root node
        // this.createViewModel(this._constants.findBrainArea(ROOT_ID));
    }

    public get VisibleCompartments(): CompartmentViewModel[] {
        return Array.from(this._visibleCompartments.values());
    }

    public get VisibleCompartmentIds(): string[] {
        return Array.from(this._visibleCompartments.keys());
    }

    public clear() {
        this.mutate([this._rootCompartment.Id], this.VisibleCompartmentIds);
    }

    public setVisible(ids: string[]) {
        const toAdd = ids.slice();
        ids.push(this._rootCompartment.Id);

        this.mutate(toAdd, this.VisibleCompartmentIds);
    }

    public toggleVisible(viewModel: CompartmentViewModel) {
        if (viewModel.IsSelected) {
            this.mutate([], [viewModel.Id]);
        } else {
            this.mutate([viewModel.Id], []);
        }
    }

    public mutate(added: string[], removed: string[] = []) {
        removed.map(id => {
            const viewModel =  this._compartmentViewModelMap.get(id);

            viewModel.IsSelected = false;

            this._visibleCompartments.delete(viewModel.Id);
        });

        added.map(id => {
            const viewModel =  this._compartmentViewModelMap.get(id);

            viewModel.IsSelected = true;
            viewModel.ShouldIncludeInHistory = true;

            this._visibleCompartments.set(viewModel.Id, viewModel);
        });
    }

    private createViewModel(compartment: IBrainArea): CompartmentViewModel {
        const viewModel = new CompartmentViewModel(compartment);

        this._compartmentViewModelMap.set(compartment.id, viewModel);

        return viewModel;
    }
}
