import {IBrainArea} from "../models/brainArea";

export class CompartmentViewModel {
    private _compartment: IBrainArea;
    private _children: CompartmentViewModel[] = new Array<CompartmentViewModel>();

    public IsSelected: boolean = false;
    public IsExpanded: boolean = false;
    public IsFavorite: boolean = false;
    public ShouldShowChildren: boolean = true;
    public ShouldIncludeInHistory: boolean = false;

    public constructor(compartment: IBrainArea) {
        this._compartment = compartment;
    }

    public get Id(): string {
        return this._compartment.id;
    }

    public get Name(): string {
        return this._compartment.name;
    }

    public get CanExpand(): boolean {
        return this._children.length > 0 && this.ShouldShowChildren;
    }

    public matches(str: string): boolean {
        let matches: boolean = this.Name.toLowerCase().includes(str);

        if (!matches) {
            matches = this._compartment.acronym.toLowerCase().includes(str);
        }

        if (!matches && this._compartment.aliases.length > 0) {
            matches = this._compartment.aliases.some(a => a.includes(str));
        }

        return matches;
    }
}
