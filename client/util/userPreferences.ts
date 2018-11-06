import {PreferencesManager} from "./preferencesManager";
import {AnyTracingStructureId} from "../models/tracingStructure";

const TracingPageOffset = "tracing.page.offset";
const TracingPageLimit = "tracing.page.limit";
const PreferredStructureId = "tracing.page.structureid";

export class UserPreferences extends PreferencesManager {
    private static _instance: UserPreferences = null;

    public static get Instance(): UserPreferences {
        if (!this._instance) {
            this._instance = new UserPreferences("mnb:");
        }

        return this._instance;
    }

    public get tracingPageOffset(): number {
        return this.loadLocalValue(TracingPageOffset, 0);
    }

    public set tracingPageOffset(offset: number) {
        this.saveLocalValue(TracingPageOffset, offset);
    }

    public get tracingPageLimit(): number {
        return this.loadLocalValue(TracingPageLimit, 10);
    }

    public set tracingPageLimit(offset: number) {
        this.saveLocalValue(TracingPageLimit, offset);
    }

    public get preferredStructureId(): string {
        return this.loadLocalValue(PreferredStructureId, "");
    }

    public set preferredStructureId(id: string) {
        this.saveLocalValue(PreferredStructureId, id);
    }

    protected validateDefaultPreferences() {
        this.setDefaultLocalValue(TracingPageOffset, 0);
        this.setDefaultLocalValue(TracingPageLimit, 25);
        this.setDefaultLocalValue(PreferredStructureId, AnyTracingStructureId);
    }
}

